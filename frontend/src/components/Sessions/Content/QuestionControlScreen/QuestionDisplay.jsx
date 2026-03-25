const QuestionDisplay = ({question, totalResponses}) => {
    return (
        <div>
            <h2 className="text-xl font-semibold text-justify">{question?.text || "Loading question..."}</h2>

            <p className="text-sm text-gray-500 mt-2">{totalResponses} {totalResponses === 1 ? "response" : "responses"}</p>
        </div>
    );
}

export default QuestionDisplay;