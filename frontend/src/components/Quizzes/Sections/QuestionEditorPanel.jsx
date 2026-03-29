import { 
    Card, 
    CardHeader, 
    CardTitle, 
    CardContent 
} from "@/components/ui/card";
import { EditInput} from "@/components/Common";
import { OptionRow } from "@/components/Question/EditorPanel";
import { RadioGroup } from "@/components/ui/radio-group";
import { forwardRef, Fragment } from "react";
import { bgColorCard } from "@/utils/constants";
import { useTranslation } from "react-i18next";

const QuestionEditorPanel = forwardRef(({ question, questionError, touched, submitted, onChange, onBlur }, ref) => {
    if(!question) return null;

    const { t } = useTranslation();

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-center">Editor</CardTitle>
            </CardHeader>

            <CardContent className="gap-4">
                <Card ref={ref} className="p-4 border border-dashed border-gray-300 items-center justify-center">
                    <EditInput
                        id="question-text"
                        className="w-full"
                        label={t("teacher.quizzesManagement.quizForm.editor.title")}
                        value={question.text ?? ""}
                        onChange={(e) => onChange({"text": e.target.value})}
                        onBlur={() => onBlur("question", "text")}
                        error={(submitted || touched?.text) && !!questionError?.text}
                        errorMessage={questionError?.text}
                        isRequired={true}
                    />
                   
                    <CardContent className="p-0">
                        <div className="flex flex-col gap-3 pt-4">
                            <RadioGroup className="w-full flex flex-col"
                                value={question.options.findIndex(option => option.isCorrect).toString()}
                                onValueChange={(value) => {
                                    const index = Number(value);
                                    const newOptions = question.options.map((option, i) => ({ ...option, isCorrect: i === index }));
                                    onChange({"options": newOptions});
                                    onBlur("question", "isCorrect");
                                }}
                            >
            
                                {question.options.map((option, index) => {
                                    const optionError = questionError?.optionErrors?.options?.[index] || null;

                                    return(
                                        <Fragment key={index}>
                                        <OptionRow
                                            label={String.fromCharCode(65 + index)}
                                            color={bgColorCard[index].normal}
                                            value={option.text}
                                            index={index}
                                            onChange={(e) => {
                                                const newOptions = [...question.options];
                                                newOptions[index].text = e.target.value;
                                                onChange({"options": newOptions});
                                            }}
                                            optionError={optionError}
                                            onBlur={() => onBlur("question", "options", index)}
                                        />

                                        {(submitted || touched?.options?.[index]) && optionError && (
                                            <span className="text-sm text-red-500 mt-1">
                                            * {optionError}
                                            </span>
                                        )}
                                        </Fragment>   
                                    )
                                })}
                            </RadioGroup>
                            
                            {(submitted || !touched?.isCorrect) && questionError?.options && (
                                <span className="text-sm text-red-500 mt-1">
                                * {questionError?.options}
                                </span>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </CardContent>
        </Card>
    );
});

QuestionEditorPanel.__TYPE = "EDITOR";

export default QuestionEditorPanel;