import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

const QuestionPoint = ({ points, onChange }) => {
    const isActive = points !== null;
    
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
                    Points
                </Label>
                <Switch
                    checked={isActive}
                    onCheckedChange={(checked) => {
                        onChange({ "points": checked ? 0 : null });
                    }}
                />
            </div>

            {isActive && (
                <Input
                    type="number"
                    min="0"
                    max="1000"
                    step="10"
                    value={points}
                    onChange={e => onChange({ "points": Number(e.target.value) })}
                    placeholder="Enter points"
                />
            )}
        </div>
    );
}

export default QuestionPoint;