import { Input } from "../ui/input";
import { Label } from "../ui/label";

const AuthInput = ({label, value, ...props}) => {
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
                    border border-black rounded-2xl
                    px-4 pt-6 
                    bg-white 
                    text-black 
                    placeholder-transparent 
                    focus:outline-none
                "/>
                <Label 
                    htmlFor={props.id}
                    className={`
                        absolute 
                        left-3 top-[0.9rem] 
                        z-10
                        origin-left
                        text-gray-500 text-sm 
                        transition-all 
                        duration-200
                        peer-focus:top-1 peer-focus:translate-y-0 peer-focus:text-sm peer-focus:text-black
                        ${value ? "top-1 translate-y-0 text-sm text-black" : "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400"}  
                    `}>
                    {label}
                </Label>
            
        </div>
    )
}

export default AuthInput;