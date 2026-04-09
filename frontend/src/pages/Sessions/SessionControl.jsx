import { AppBreadcrumb } from "@/components/Common";
import { DashboardContent } from "@/components/Dashboard/Layout";
import { useQuizForTeacher } from "@/hooks/Quizzes/useQuizForTeacher";
import { useAuth } from "@/auth/AuthContext";
import { 
    useState,
    useRef,
    useEffect
 } from "react";
import { useParams } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { 
    SessionSteps,
    QuestionControlScreen
} from "@/components/Sessions/Sections/";
import { useCoordinatorSerial } from "@/hooks/Hardware/useCoordinatorSerial";
import { useSessionActions } from "@/hooks/Sessions/useSessionActions";
import { useResponseActions } from "@/hooks/Response/useResponseActions";

const SessionControl = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const { quizForTeacher, loading } = useQuizForTeacher(id);
    const {
        connect,
        listen,
        disconnect,
        send,
        connected,
        loading: loadingSerial,
        error: errorSerial
    } = useCoordinatorSerial();
    const { create: createSession, update: updateSession } = useSessionActions();
    const { create: createResponse } = useResponseActions();

    // State
    const [presentationOpened, setPresentationOpened] = useState(false);
    const [sessionStarted, setSessionStarted] = useState(false);
    const [resultsReady, setResultsReady] = useState(false);

    // Refs
    const presentationWindowRef = useRef(null);
    const currentQuestionRef = useRef(null);
    const sessionIdRef = useRef(null);
    const responseQueueRef = useRef([]);
    const questionsRef = useRef([]);
    const deviceIdsRef = useRef([]);

    // Data
    const [sessionId, setSessionId] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [results, setResults] = useState([]);

    const startListening = async () => {
        await listen((event) => {
            switch(event.type) {

                case "ANSWER":
                    const questionId = currentQuestionRef.current;
                
                    handleUpdateQuestion(prev => {
                        // If there is nothing yet for this question, create the object
                        if (!questionId) return;

                        if (!deviceIdsRef.current.includes(event.deviceId)) {
                            deviceIdsRef.current.push(event.deviceId);
                        }

                        const existingQuestion = prev.find(q => q.questionId === questionId);

                        if(existingQuestion) {
                            // If the option already exists, increment the count, otherwise add it
                            const existingOption = existingQuestion.answers.find(a => a.option === event.option);

                            let updatedAnswers;

                            if(existingOption) {
                                // Increment count for existing option
                                updatedAnswers = existingQuestion.answers.map(a => 
                                    a.option === event.option
                                        ? { ...a, count: a.count + 1 }
                                        : a
                                );
                            } else {
                                // Add new option
                                updatedAnswers = [...existingQuestion.answers, { option: event.option, count: 1 }];
                            }

                            // Update total responses
                            return prev.map(q =>
                                q.questionId === questionId
                                    ? { 
                                        ...q, 
                                        answers: updatedAnswers, 
                                        totalResponses: q.totalResponses + 1 
                                    }
                                    : q
                            );
                        }

                        // If the question didn't exist yet
                        return [
                            ...prev,
                            {
                                questionId: questionId,
                                options: quizForTeacher.questionIds?.find(q => q._id === questionId)?.options || [],
                                answers: [{ option: event.option, count: 1 }],
                                totalResponses: 1
                            }
                        ];
                    });

                    const currentSessionId = sessionIdRef.current;

                    if (!questionId || !currentSessionId) return;

                    responseQueueRef.current.push({
                        sessionId: currentSessionId,
                        questionId,
                        deviceId: event.deviceId, 
                        answer: event.option,
                    });

                    break;

                case "STOP_QUESTION":
                    updateSession(sessionIdRef.current, {
                        questions: questionsRef.current,
                        deviceIds: deviceIdsRef.current
                    });
                    break;

                case "RESULT":
                    setResultsReady(true);
                    setResults(event.options);
                    break;

                case "ERROR":
                    console.error(event.raw);
                    break;
            }
        });

        console.warn("Listening started...");
    }

    // Handlers
    const handleConnectReceiver = async () => {
        // Logic to connect receiver
        try {
            if(!connected) {
                await connect();
                await startListening();
            }
        } catch (error) {
            console.error("Error connecting to receiver:", error);  
        }  
    }

    const handleOpenPresentation = () => {
        // Logic to open presentation

        // If the presentation window is already open, focus it instead of opening a new one
        if (presentationWindowRef.current && !presentationWindowRef.current.closed) {
            presentationWindowRef.current.focus();
            return;
        }

        const width = 1024;
        const height = 768;
        const top = window.screenY + (window.outerHeight - height) / 2;
        const left = window.screenX + (window.outerWidth - width) / 2;

        // If not, open a new window and store the reference
        presentationWindowRef.current = window.open(`/dashboard_teacher/session/${id}/presentation`, "presentation-window", `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`);
        
        setPresentationOpened(true);
    }

    const handleClosePresentation = () => {
        if (presentationWindowRef.current && !presentationWindowRef.current.closed) {
            presentationWindowRef.current.close();
        }
    }; 

    const handleStartSession = async () => {
        // Logic to start session
        try {
            const newSession = await createSession({
                teacherId: user?._id,
                quizId: id,
                deviceIds: [],
                questions: [],
                startTime: new Date()
            });

            setSessionId(newSession._id);
            sessionIdRef.current = newSession._id;
            setSessionStarted(true);
        } catch (error) {
            console.error("Error starting session:", error);
        }
    };

    const handleUpdateQuestion = (updater) => {
        setQuestions((prev) => updater(prev));
        questionsRef.current = updater(questionsRef.current);
    }

    useEffect(() => {
        let processing = false;

        const interval = setInterval(async () => {
            if (processing) return;
            if (responseQueueRef.current.length === 0) return;

            processing = true;

            const batch = [...responseQueueRef.current];
            responseQueueRef.current = [];

            try {
                // Process the batch of responses
                await Promise.all(batch.map(res => createResponse(res)));
            } finally {
                processing = false;
            }
        }, 500); // Every 500ms

        return () => clearInterval(interval);
    }, []);

    return (
        <DashboardContent>
            <AppBreadcrumb />

            {loading ? (
                <div className="flex justify-center">
                    <Spinner className="h-10 w-10" color="blue" />
                </div>
            ) : (
                !sessionStarted ? (
                    <div className="flex flex-col items-center gap-4 mt-6 max-w-xl mx-auto">
                        <h1 className="text-4xl font-bold">{quizForTeacher?.title}</h1>
                        <SessionSteps 
                            presentationOpened={presentationOpened}
                            sessionStarted={sessionStarted}
                            connected={connected}
                            loadingSerial={loadingSerial}
                            onConnectReceiver={handleConnectReceiver}
                            onOpenPresentation={handleOpenPresentation}
                            onStartSession={handleStartSession}
                        />                    
                    </div>  
                ):(
                    <QuestionControlScreen 
                        quiz={quizForTeacher} 
                        questions={questions}
                        results={results}
                        resultsReady={resultsReady}
                        sessionId={sessionId}
                        disconnect={disconnect} 
                        send={send} 
                        setResultsReady={setResultsReady}
                        setCurrentQuestionId={(id) => currentQuestionRef.current = id} 
                        onClosePresentation={handleClosePresentation}
                    />
                )
            )}
        </DashboardContent>
    );
};

export default SessionControl;