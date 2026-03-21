const QuestionDisplay = ({question}) => {
    return (
        <div>
            <h2 className="text-xl font-semibold text-justify">{question?.text || "Loading question..."}</h2>

            {/* Response count */}
        </div>
    );
}

export default QuestionDisplay;