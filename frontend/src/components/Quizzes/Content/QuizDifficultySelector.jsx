import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue, 
    SelectGroup 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";

const QuizDifficultySelector = ({value, onChange, difficulties}) => { 
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
                    {t('teacher.quizzesManagement.quizForm.difficulty.label')}
                </Label>
            </div>
            <Select value={value ? value : difficulties[0].value} onValueChange={onChange}>
                <SelectTrigger>
                    <SelectValue placeholder={t('teacher.quizzesManagement.quizForm.difficulty.select')} />
                </SelectTrigger>

                <SelectContent>
                    <SelectGroup>
                        {difficulties.map(difficulty => (   
                            <SelectItem key={difficulty._id} value={difficulty.value}>
                                {t('common.quizzesManagement.detailsCard.difficulty.' + difficulty.value)}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
}

export default QuizDifficultySelector;