import { Input } from "@/components/ui/input";
import { RadioGroupItem } from "@/components/ui/radio-group";

const OptionRow = ({ label, color, value, index, onChange, onBlur }) => {
    return (
        <div className={`${color} flex items-center gap-3 p-3 rounded-md `}>
            <div className="flex items-center gap-3 w-full">
                {/** LETTER */}
                <span className="font-bold text-white">{label}</span>

                {/** INPUT */}
                <Input 
                    className="
                        h-12 
                        w-full 
                        px-3 pt-6 
                        bg-transparent 
                        text-white 
                        font-extrabold
                        border-0
                        border-b-2
                        border-white/70
                        rounded-none
                        placeholder-transparent 
                        focus:outline-none
                        focus:ring-0
                        focus-visible:ring-0
                        focus-visible:ring-offset-0
                        focus-visible:border-black"
                    type="text"
                    value={value ?? ""}
                    onChange={onChange}
                    onBlur={onBlur}
                />

                {/** RADIO */}
                <RadioGroupItem
                    value={index.toString()}
                    className="bg-white/70 data-[state=checked]:bg-white h-5 w-5 rounded-full border-2 border-white focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-white focus:outline-none"
                />
            </div>
        </div>
    );
}

export default OptionRow;