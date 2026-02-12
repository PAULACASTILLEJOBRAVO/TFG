import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectLabel, SelectGroup } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const typesQuestion = [
    { value: "multiple-choice", label: "Multiple Choice" },
    { value: "true-false", label: "True/False" },
]

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
                    Question type
                </Label>
            </div>
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger>
                    <SelectValue placeholder="Select a type" />
                </SelectTrigger>

                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Type</SelectLabel>
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