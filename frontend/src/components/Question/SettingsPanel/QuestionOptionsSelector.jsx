import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue, 
    SelectGroup 
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";

const QuestionTypeSelector = ({value, onChange}) => { 
    const { t } = useTranslation();

    return(
        <div className="w-full">
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger>
                    <SelectValue />
                </SelectTrigger>

                <SelectContent>
                    <SelectGroup>
                        {[2, 3, 4, 5, 6, 7, 8].map(n => (   
                            <SelectItem key={n} value={n.toString()}>
                                {n} {t("teacher.quizzesManagement.quizForm.settings.options")}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
}

export default QuestionTypeSelector;