import { AppBreadcrumb } from "@/components/Common";
import { DashboardContent } from "@/components/Dashboard/Layout";
import { useQuiz } from "@/hooks/Quizzes/useQuiz";
import { useAuth } from "@/auth/AuthContext";
import { 
    useState,
    useRef
 } from "react";
import { useParams } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { 
    SessionSteps,
    QuestionControlScreen
} from "@/components/Sessions/Sections/";
import { useCoordinatorSerial } from "@/hooks/Hardware/useCoordinatorSerial";

const SessionControl = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const { quiz, loading } = useQuiz(id);
    const {
        connect,
        listen,
        disconnect,
        send,
        connected,
        loading: loadingSerial,
        error: errorSerial
    } = useCoordinatorSerial();

    // State
    const [presentationOpened, setPresentationOpened] = useState(false);
    const [sessionStarted, setSessionStarted] = useState(false);
    const [resultsReady, setResultsReady] = useState(false);

    // Refs
    const presentationWindowRef = useRef(null);
    const currentQuestionRef = useRef(null);

    // Data
    const [session, setSession] = useState({teacherId: user ? user._id : null, quizId: id ? id : null, playerIds: [], questions: [], startTime: null, endTime: null});
    const [questions, setQuestions] = useState([{questionId: null, answers: [], totalResponses: 0}]);
    const [results, setResults] = useState([]);

    const startListening = async () => {
        await listen((event) => {
            switch(event.type) {
                case "SUCCESS":
                    console.log(event.raw);
                    break;

                case "QUESTION_ACK":
                    console.log(event.raw);
                    break;

                case "ANSWER":
                    handleUpdateQuestion(prev => {
                        // If there is nothing yet for this question, create the object
                        const questionId = currentQuestionRef.current;
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
                                answers: [{ option: event.option, count: 1 }],
                                totalResponses: 1
                            }
                        ];
                    });
                    break;

                case "TIMEOUT":
                    console.log(event.raw);
                    break;

                case "STOP_QUESTION":
                    console.log(event.raw);
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

        console.log("Listening started...");
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

    const handleStartSession = () => {
        // Logic to start session
        setSessionStarted(true);
        setSession((prev) => ({ ...prev, startTime: new Date() }));
    };

    const handleUpdateQuestion = (updater) => {
        setQuestions((prev) => updater(prev));
    }

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
                        <h1 className="text-4xl font-bold">{quiz?.title}</h1>
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
                        quiz={quiz} 
                        questions={questions}
                        results={results}
                        resultsReady={resultsReady}
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