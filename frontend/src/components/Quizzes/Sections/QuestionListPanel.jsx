import { 
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle 
} from "@/components/ui/card";
import { CreateButton } from "@/components/Common/ActionButtons";
import { QuestionSlideCard } from "@/components/Question";
import { createNewQuestion } from "@/utils/questions";
import { useTranslation } from "react-i18next";

const QuestionListPanel = ({ displayQuestions, selectedQuestion, questionErrors, onSelect, onAdd, onDelete, maxHeight }) => {
    const { t } = useTranslation();

    return (
        <Card className="flex flex-col h-full">
            <CardHeader>
                <CardTitle className="text-center">
                    {t("teacher.quizzesManagement.quizForm.questions")}
                </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col min-h-0">
                <div
                    className="flex flex-col gap-2 overflow-y-auto min-h-0"
                    style={{ maxHeight: maxHeight ? `${maxHeight}px` : "none" }}
                >
                    {displayQuestions.map((question, index) => {
                        const isSelected = index === selectedQuestion;

                        return (
                            <QuestionSlideCard 
                                key={index} 
                                index={index} 
                                questionError={questionErrors?.[index]}
                                onDelete={onDelete} 
                                onSelect={() => onSelect(index)} 
                                isSelected={isSelected} 
                            /> 
                        ); 
                    })}
                </div> 
            <CreateButton label={t("common.create")} onClick={() => onAdd(createNewQuestion())}/>
            </CardContent>
        </Card>
    );
};

QuestionListPanel.__TYPE = "LIST";

export default QuestionListPanel;