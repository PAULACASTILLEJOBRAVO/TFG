import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

const QuestionTimeLimit = ({ timeLimit, onChange }) => {
    const isActive = timeLimit !== null;
    
    return (
        <div className="w-full flex flex-col gap-2">
            <div className="px-3 bg-transparent text-black flex items-center justify-between">
                <Label 
                    className={`
                        left-3 top-[0.9rem] 
                        z-10
                        origin-left
                        text-gray-500 text-xs 
                    `}>
                    Time Limit (seconds)
                </Label>
                <Switch
                    checked={isActive}
                    onCheckedChange={(checked) => {
                        onChange({ "timeLimit": checked ? 10 : null });
                    }}
                />
            </div>

            {isActive && (
                <Input
                    type="number"
                    min="10"
                    step="5"
                    value={timeLimit}
                    onChange={e => onChange({ "timeLimit": Number(e.target.value) })}
                    placeholder="Enter time limit in seconds"
                />
            )}
        </div>
    );
}

export default QuestionTimeLimit;