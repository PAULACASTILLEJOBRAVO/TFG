import { 
    useState,
    useEffect,
    useRef
} from "react";
import { 
    QuestionPagination,
    QuestionDisplay,
    ButtonActions,
    CountdownTimer
 } from "../Content/QuestionControlScreen";
 import { useNavigate } from "react-router-dom";
 import { useSessionActions } from "@/hooks/Sessions/useSessionActions";

const QuestionControlScreen = ({quiz, questions, results, resultsReady, sessionId, disconnect, send, setResultsReady, setCurrentQuestionId, onClosePresentation }) => {
    const { complete } = useSessionActions();
    
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [questionActive, setQuestionActive] = useState(true);
    const [showResult, setShowResult] = useState(false);

    const question = quiz?.questionIds[currentQuestionIndex];
    const questionStats = questions?.find(q => q.questionId === question?._id) || { totalResponses: 0 }; // Find stats for the current question
    const totalResponses = questionStats.totalResponses;

    const navigate = useNavigate();

    // Handlers
    const handleEndQuestion = async () => {
        await send(`qa stop_question`);
        setQuestionActive(false);
    }

    const handleShowResults = async () => {
        await send(`qa get_answers`);
        setShowResult(true);
    }

    const handleNextQuestion = async () => {
        if (currentQuestionIndex < quiz.questionIds.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setQuestionActive(true);
            setShowResult(false);
            setResultsReady(false);
        } else {
            // If it's the last question, end the session
            if (!sessionId) return;

            await complete(sessionId, {
                status: "completed",
                questions: questions,
                endTime: new Date()
            });

            onClosePresentation();

            await disconnect(); // Disconnect from serial to free the port
            setQuestionActive(false);
            setShowResult(false);
            navigate("/dashboard_teacher/quizzes"); // Redirigir a la página de resultados
        }
    }

    // Communication channel between control and presentation
    const channelRef = useRef(null);

    useEffect(() => {
        channelRef.current = new BroadcastChannel("quiz-session");

        return () => {
            channelRef.current.close();
        };
    }, []);

    const handleStartQuestion = (question) => {
        channelRef.current.postMessage({
            type: "NEW_QUESTION",
            question: question,
            questionIndex: currentQuestionIndex,
            totalQuestions: quiz.questionIds?.length
        });
    };

    const handleSendResults = (results) => {
        channelRef.current.postMessage({
            type: "SHOW_RESULTS",
            results: results,
            questionIndex: currentQuestionIndex
        });
    };

    useEffect(() => {
        if(!question) return;
    
        const sendQuestion = async () => {
            setCurrentQuestionId(question._id); // Set the current question ID in the parent component

            const questionId = currentQuestionIndex+1;
            const numberOptions = question.options?.length ?? 0;
            const time = question?.timeLimit ?? -1;

            send(`qa send_question ${questionId} 1 ${numberOptions} ${time}`);
            
            handleStartQuestion(question);
        };

        sendQuestion();
    },[question]);

    useEffect(() => {
        if (resultsReady && results) {
            handleSendResults(results);
        }
    }, [resultsReady, results]);

    return(
        <div className="flex flex-col items-center gap-4 mt-6 max-w-xl mx-auto">

            {/* Timer */}
            {questionActive && question?.timeLimit && (
                <CountdownTimer timeLimit={question?.timeLimit} questionActive={questionActive} onTimeEnd={() => setQuestionActive(false)} />
            )}

            {/* Pagination */}
            <QuestionPagination currentIndex={currentQuestionIndex} totalQuestions={quiz?.questionIds.length} />
       
            {/* Information */}
            <QuestionDisplay question={question} totalResponses={totalResponses}/>

            {/* Buttons */}
            <ButtonActions 
                questionActive={questionActive} 
                showResult={showResult}
                onEndQuestion={handleEndQuestion}
                onNextQuestion={handleNextQuestion}
                onShowResults={handleShowResults}
            />

        </div>
    );
}

export default QuestionControlScreen;