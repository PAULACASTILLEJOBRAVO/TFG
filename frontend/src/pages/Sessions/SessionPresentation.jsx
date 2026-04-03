import { PresentationScreen } from "@/components/Sessions/Sections";
import { 
    useState, 
    useEffect 
} from "react";

const SessionPresentation = () => {
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(10);
    const [questionActive, setQuestionActive] = useState(false);
    const [results, setResults] = useState([]);

    useEffect(() => {
        const channel = new BroadcastChannel("quiz-session");

        const handleMessage = (event) => {
            if (event.data.type === "SHOW_RESULTS") {
                setResults(event.data.results);
                setQuestionActive(false);
            }

            if (event.data.type === "NEW_QUESTION") {
                setCurrentQuestion(event.data.question);
                setQuestionIndex(event.data.questionIndex);
                setTotalQuestions(event.data.totalQuestions);
                setResults([]); 
                setQuestionActive(true);
            }
        };

        channel.addEventListener("message", handleMessage);

        return () => {
            channel.removeEventListener("message", handleMessage);
            channel.close();
        };
    }, []);

    return (
        <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center">
            <PresentationScreen
                currentQuestion={currentQuestion}
                questionActive={questionActive}
                questionIndex={questionIndex}
                totalQuestions={totalQuestions}
                results={results}
            />
        </div>
    );
};

export default SessionPresentation;