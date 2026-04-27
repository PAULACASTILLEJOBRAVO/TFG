import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { 
    Eye,
    EyeClosed 
} from "lucide-react";

const AuthInput = ({label, value, error, modeAuth = false, type = "text", isRequired = false, errorMessage = "", helperText = "", ...props}) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";
    const inputType = isPassword
        ? (showPassword ? "text" : "password")
        : type;

    const message = error ? errorMessage : helperText;

    return(
        <>
            <div className="relative w-full">
                <Input
                    id={props.id}
                    {...props}
                    type={inputType}
                    placeholder=" "
                    aria-invalid={error}
                    aria-describedby={`${props.id}-message`}
                    className={`
                        peer 
                        h-12 
                        w-full 
                        border
                        px-4 pt-6 
                        bg-white 
                        text-black 
                        placeholder-transparent 
                        focus:outline-none
                        transition-colors duration-200
                        ${error 
                            ? (modeAuth 
                                ? "border-4 border-red-900 focus:border-red-900" 
                                : "border-red-500 focus:border-red-500") 
                            : "border-black focus:border-black"}
                        ${isPassword ? "pr-10" : ""}    
                    `}
                />
                <Label 
                    htmlFor={props.id}
                    className={`
                        absolute 
                        left-3 top-[0.9rem] 
                        z-10
                        origin-left
                        text-sm
                        transition-all 
                        duration-200
                        peer-focus:top-1 peer-focus:translate-y-0 peer-focus:text-sm
                        ${value 
                            ? "top-1 translate-y-0 text-sm" 
                            : "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base"
                        }    
                        ${error 
                            ? "text-red-500" 
                            : "text-gray-500 peer-focus:text-black"
                        }
                    `}>
                    {label} {isRequired && <span className="text-red-600">*</span>}
                </Label>

                {isPassword && (
                    <Button
                        variant="ghost"
                        onClick={() => setShowPassword(prev => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                        tabIndex={-1}
                    >
                        {showPassword ? (
                            <EyeClosed className="h-5 w-5" />
                        ) : (
                            <Eye className="h-5 w-5" />
                        )}
                    </Button>
                )}
            </div>

            <div className="mt-[-0.8rem] ">
                {message && (
                    <p
                        id={`${props.id}-message`}
                        className={`text-sm ${
                            error
                                ? modeAuth
                                    ? "text-white"
                                    : "text-red-500"
                                : "text-gray-500"
                        }`}
                    >
                        * {message}
                    </p>
                )}
            </div>
        </>
    )
}

export default AuthInput;