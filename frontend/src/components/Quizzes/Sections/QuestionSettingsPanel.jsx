import { 
    Card, 
    CardHeader,
    CardTitle,
    CardContent 
} from "@/components/ui/card";
import {
    QuestionTypeSelector,
    QuestionTimeLimit,
    QuestionPoint,
    QuestionOptionsSelector
} from "@/components/Question/SettingsPanel";
import { createDefaultOptions } from "@/utils/questions";

const QuestionSettingsPanel = ({ question, onChange }, maxHeight) => {
    if(!question) return null;

    const handleTypeChange = (type) => {
        onChange({ type, options: createDefaultOptions(type) });
    }

    const handleOptionsCountChange = (count) => {
        let newOptions = [...question.options];

        while(newOptions.length < count) {
            newOptions.push({ text: "", isCorrect: false });
        }

        while(newOptions.length > count) {
            newOptions.pop();
        }

        onChange({ options: newOptions });
    }


    return (
        <Card >
            <CardHeader>
                <CardTitle className="text-center">Settings</CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col gap-2 items-center">
                <div
                    className="flex flex-col gap-2 overflow-y-auto min-h-0"
                    style={{ maxHeight: maxHeight ? `${maxHeight}px` : "none" }}
                >
                    <QuestionTypeSelector
                        value={question ? question.type : "multiple-choice"}
                        onChange={value => handleTypeChange(value)}
                    />

                    {question?.type === "multiple-choice" && (
                        <QuestionOptionsSelector value={question.options.length.toString()} onChange={value => handleOptionsCountChange(Number(value))} />
                    )}

                    <QuestionTimeLimit  
                        timeLimit={question?.timeLimit}
                        onChange={onChange}
                    />

                    <QuestionPoint  
                        points={question?.points}
                        onChange={onChange}
                    />
                </div>
            </CardContent>
        </Card>
    );
};

QuestionSettingsPanel.__TYPE = "SETTINGS";

export default QuestionSettingsPanel;