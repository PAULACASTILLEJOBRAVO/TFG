import { Input } from "../ui/input";
import { Label } from "../ui/label";

const AuthInput = ({label, ...props}) => {
    return(
        <div className="relative w-full">
            <Input
                id={props.id}
                {...props}
                placeholder=" "
                className="
                    peer 
                    h-12 
                    w-full 
                    border border-black rounded 
                    px-3 pt-4 
                    bg-white 
                    text-black 
                    placeholder-transparent 
                    focus:outline-none"
            />
                <Label 
                    htmlFor={props.id}
                    className="
                        absolute 
                        left-3 top-3 
                        z-10
                        origin-left
                        text-gray-500 text-sm 
                        transition-all 
                        duration-200
                        peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 
                        peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-sm peer-focus:text-black"
                >
                    {label}
                </Label>
            
        </div>
    )
}

export default AuthInput;