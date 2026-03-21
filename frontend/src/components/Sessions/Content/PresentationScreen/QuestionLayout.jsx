import { colorCard } from "@/utils/constants";

const QuestionLayout = ({ currentQuestion, questionIndex, totalQuestions }) => {
    if(!currentQuestion) return null;

    return (
        <div className="h-full w-full">
            {currentQuestion && (
                <div className="flex flex-col gap-3 xl:gap-12 w-full h-full p-2 xl:px-12 xl:py-8">
                    <div className="w-full text-right">
                        <span className="text-gray-600 bg-white text-md xl:text-2xl font-semibold">
                            Question {questionIndex + 1} / {totalQuestions}
                        </span>
                    </div>

                    <h1 className="text-xl xl:text-5xl font-bold text-center">
                        {currentQuestion.text}
                    </h1>

                    <div className="grid grid-cols-1 gap-2 xl:gap-8 flex-1">
                        {currentQuestion.options.map((option, index) => {
                            const bgColor = colorCard[index].normal;

                            return (
                                <div
                                    key={index}
                                    className={`${bgColor} flex items-center p-2 xl:p-4 rounded-md shadow-lg`}
                                >
                                    <span className="text-white font-semibold text-sm xl:text-3xl mr-4">
                                        {String.fromCharCode(65 + index)}
                                    </span>

                                    <span className="text-white font-semibold text-xs xl:text-2xl">
                                        {option.text}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuestionLayout;