import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectLabel, SelectGroup } from "@/components/ui/select";

const QuestionTypeSelector = ({value, onChange}) => { 
    return(
        <div className="w-full">
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger>
                    <SelectValue placeholder="Options count" />
                </SelectTrigger>

                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Type</SelectLabel>
                        {[2, 3, 4].map(n => (   
                            <SelectItem key={n} value={n.toString()}>
                                {n} options
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
}

export default QuestionTypeSelector;