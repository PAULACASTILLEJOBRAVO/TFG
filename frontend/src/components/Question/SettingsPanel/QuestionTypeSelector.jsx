import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue, 
    SelectLabel, 
    SelectGroup 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { typesQuestion } from "@/utils/constants";

const QuestionTypeSelector = ({value, onChange}) => { 
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
                    Tipo de pregunta
                </Label>
            </div>
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger>
                    <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>

                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Tipo</SelectLabel>
                        {typesQuestion.map(type => (   
                            <SelectItem key={type.value} value={type.value}>
                                {type.label}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
}

export default QuestionTypeSelector;