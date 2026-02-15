import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectLabel, SelectGroup } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const QuizDifficultySelector = ({value, onChange, difficulties}) => { 
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
                    Dificultad
                </Label>
            </div>
            <Select value={value ? value : difficulties[0].value} onValueChange={onChange}>
                <SelectTrigger>
                    <SelectValue placeholder="Selecciona dificultad" />
                </SelectTrigger>

                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Dificultad</SelectLabel>
                        {difficulties.map(difficulty => (   
                            <SelectItem key={difficulty._id} value={difficulty.value}>
                                {difficulty.label}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
}

export default QuizDifficultySelector;