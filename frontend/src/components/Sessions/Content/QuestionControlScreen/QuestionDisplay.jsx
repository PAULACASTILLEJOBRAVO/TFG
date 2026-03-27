import { Users } from "lucide-react";

const QuestionDisplay = ({question, totalResponses}) => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4">
            <h2 className="text-xl font-semibold text-justify">{question?.text || "Loading question..."}</h2>

            <p className="text-lg text-center text-gray-500 mt-2 flex items-center gap-1">
                <Users className="w-6 h-6" />
                <strong className="text-xl">{totalResponses}</strong> {totalResponses === 1 ? "response" : "responses"}
            </p>
        </div>
    );
}

export default QuestionDisplay;