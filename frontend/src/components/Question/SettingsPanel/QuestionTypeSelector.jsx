import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue, 
    SelectGroup 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { typesQuestion } from "@/utils/constants";
import { useTranslation } from "react-i18next";

const QuestionTypeSelector = ({value, onChange}) => { 
    const { t } = useTranslation();
    
    return(
        <div className="w-full">
            <div className="px-3 bg-transparent text-black">
                <Label 
                    className={`
                        left-3 top-[0.9rem] 
                        z-10
                        origin-left
                        text-gray-500 text-xs 
                    `}>
                    {t("teacher.quizzesManagement.quizForm.settings.type")}
                </Label>
            </div>
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger>
                    <SelectValue placeholder={t("teacher.quizzesManagement.quizForm.settings.selectType")} />
                </SelectTrigger>

                <SelectContent>
                    <SelectGroup>
                        {typesQuestion.map(type => (   
                            <SelectItem key={type.value} value={type.value}>
                                {t(type.labelKey)}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
}

export default QuestionTypeSelector;