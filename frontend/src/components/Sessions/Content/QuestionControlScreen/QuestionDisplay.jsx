import { Check, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { textColorCard } from "@/utils/constants";

const QuestionDisplay = ({question, questionStats, totalResponses}) => {
    const { t } = useTranslation();
    
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4">
            <h2 className="text-xl font-semibold text-justify">{question?.text || "Loading question..."}</h2>

            <p className="text-lg text-center text-gray-500 mt-2 flex items-center gap-1">
                <Users className="w-6 h-6" />
                <strong className="text-xl">{totalResponses}</strong> {totalResponses === 1 ? t("teacher.sessionControl.questionDisplay.response") : t("teacher.sessionControl.questionDisplay.responses")}
            </p>

            <div className="mt-4 w-full">
               {questionStats.questionSnapshot?.options?.map((option, index) => {
                    const answerCount = questionStats.answers?.find(a => a.letter === option.letter)?.count || 0;       

                    return (
                        <div key={option._id} className="flex justify-between items-center py-1">
            
                            {/* LEFT: check */}
                            <div className="w-6 flex justify-center">
                                {option.isCorrect && (
                                    <Check className="h-5 w-5 text-green-500" />
                                )}
                            </div>

                            {/* CENTER: letter + text */}
                            <div className="flex-1 flex items-center">
                                <span className={textColorCard[index]}>
                                    {option.letter}. {option.text}
                                </span>
                            </div>

                            {/* RIGHT: stats */}
                            <span className="text-base text-gray-500">
                                {answerCount} / {totalResponses}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default QuestionDisplay;