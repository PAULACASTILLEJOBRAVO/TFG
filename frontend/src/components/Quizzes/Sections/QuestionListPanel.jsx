import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CreateButton from "@/components/Common/ActionButtons/CreateButton";
import QuestionSlideCard from "@/components/Question/QuestionSlideCard";

const newQuestionTemplate = { text: "", type: "multiple-choice", options: [] };

const QuestionListPanel = ({ displayQuestions, selectedQuestion, onSelect, onAdd, onDelete }) => {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="text-center">
                   Questions
                </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col gap-2 overflow-y-auto p-4">
               {displayQuestions.map((question, index) => {
                    const isSelected = index === selectedQuestion;

                    return (
                        <QuestionSlideCard key={index} index={index} onDelete={onDelete} onSelect={() => onSelect(index)} isSelected={isSelected} /> 
                    ); 
                })}

                <CreateButton label="pregunta" onClick={() => onAdd(newQuestionTemplate)}/>
            </CardContent>
        </Card>
    );
};

export default QuestionListPanel;