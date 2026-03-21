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

    // Data
    const [session, setSession] = useState({teacherId: user ? user._id : null, quizId: id ? id : null, playerIds: [], startTime: null, endTime: null});
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
                    console.log(event.raw);
                    break;

                case "TIMEOUT":
                    console.log(event.raw);
                    break;

                case "STOP_QUESTION":
                    console.log(event.raw);
                    break;

                case "RESULT":
                    setResultsReady(true);
                    console.log(event.raw);
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
                        results={results}
                        resultsReady={resultsReady} 
                        disconnect={disconnect} 
                        send={send} 
                        setResultsReady={setResultsReady}
                        onClosePresentation={handleClosePresentation}
                    />
                )
            )}
        </DashboardContent>
    );
};

export default SessionControl;