import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import EditInput from "@/components/Common/EditInput";
import OptioRow from "@/components/Question/EditorPanel/OptionRow";
import { RadioGroup } from "@/components/ui/radio-group";
import { forwardRef } from "react";

const colorCard = {
    0: "bg-red-500",
    1: "bg-yellow-500",
    2: "bg-blue-500",
    3: "bg-green-500",
    4: "bg-pink-500",
    5: "bg-orange-500",
    6: "bg-purple-500",
    7: "bg-teal-500",
}

const QuestionEditorPanel = forwardRef(({ question, onChange }, ref) => {
    if(!question) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-center">Editor</CardTitle>
            </CardHeader>

            <CardContent className="gap-4">
                <Card ref={ref} className="p-4 border border-dashed border-gray-300 items-center justify-center">
                    <EditInput
                        label="Write a question"
                        value={question.text ?? ""}
                        onChange={(e) => onChange({"text": e.target.value})}
                        className="w-full"
                    />
                   
                    <CardContent className="p-0">
                        <div className="flex flex-col gap-3 pt-4">
                            <RadioGroup className="w-full flex flex-col"
                                value={question.options.findIndex(option => option.isCorrect).toString()}
                                onValueChange={(value) => {
                                    const index = Number(value);
                                    const newOptions = question.options.map((option, i) => ({ ...option, isCorrect: i === index }));
                                    onChange({"options": newOptions});
                                }}
                            >
            
                                {question.options.map((option, index) => (
                                    <OptioRow
                                        key={index}
                                        label={String.fromCharCode(65 + index)}
                                        color={question.type === "true-false" ? (index === 0 ? "bg-green-500" : "bg-red-500") : (colorCard[index])}
                                        value={option.text}
                                        index={index}
                                        onChange={(e) => {
                                            const newOptions = [...question.options];
                                            newOptions[index].text = e.target.value;
                                            onChange({"options": newOptions});
                                        }}
                                       
                                    />
                                ))}
                            </RadioGroup>
                        </div>
                    </CardContent>
                </Card>
            </CardContent>
        </Card>
    );
});

QuestionEditorPanel.__TYPE = "EDITOR";

export default QuestionEditorPanel;