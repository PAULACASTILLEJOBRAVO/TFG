import { 
    QuestionLayout,
    WaitingLayout,
    ResultLayout
 } from "../Content/PresentationScreen";

const PresentationScreen = ({ currentQuestion, questionActive, questionIndex, totalQuestions, results }) => {
    return (
        <div className="h-full w-full">
            {!currentQuestion && (
                <WaitingLayout />
            )}

            {currentQuestion && !questionActive && (
                <ResultLayout 
                    currentQuestion={currentQuestion}
                    results={results} 
                />
            )}

            {currentQuestion && questionActive && (
                <QuestionLayout
                    currentQuestion={currentQuestion}
                    questionIndex={questionIndex}
                    totalQuestions={totalQuestions}
                    questionActive={questionActive}
                />
            )}
        </div>
    );
};

export default PresentationScreen;