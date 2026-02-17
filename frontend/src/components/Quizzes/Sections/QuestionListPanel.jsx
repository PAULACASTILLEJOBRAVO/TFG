import { 
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle 
} from "@/components/ui/card";
import { CreateButton } from "@/components/Common/ActionButtons";
import { QuestionSlideCard } from "@/components/Question";
import { createNewQuestion } from "@/utils/questions";

const QuestionListPanel = ({ displayQuestions, selectedQuestion, onSelect, onAdd, onDelete, maxHeight }) => {
    return (
        <Card className="flex flex-col h-full">
            <CardHeader>
                <CardTitle className="text-center">
                   Questions
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
                            <QuestionSlideCard key={index} index={index} onDelete={onDelete} onSelect={() => onSelect(index)} isSelected={isSelected} /> 
                        ); 
                    })}
                </div> 
            <CreateButton label="pregunta" onClick={() => onAdd(createNewQuestion())}/>
            </CardContent>
        </Card>
    );
};

QuestionListPanel.__TYPE = "LIST";

export default QuestionListPanel;