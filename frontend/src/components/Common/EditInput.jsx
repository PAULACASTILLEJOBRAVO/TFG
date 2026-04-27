import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { 
    Eye, 
    EyeClosed 
} from "lucide-react";

const EditInput = ({label, value, type = "text", error, isRequired = false, errorMessage = "", helperText = "", ...props}) => {
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
                    value={value}
                    type={inputType}
                    placeholder=" "
                    aria-invalid={error}
                    aria-describedby={`${props.id}-message`}
                    className={`
                        peer 
                        h-12 
                        w-full 
                        px-3 pt-6 
                        bg-transparent 
                        text-black 
                        border-0
                        border-b-2
                        border-gray-300
                        rounded-none
                        placeholder-transparent 
                        focus:outline-none
                        focus:ring-0
                        focus-visible:ring-0
                        focus-visible:ring-offset-0
                        focus-visible:border-black
                        ${error 
                            ? "border-red-500 focus:border-red-500"
                            : "border-black focus:border-black"
                        }
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
                        text-gray-500 text-xs 
                        transition-all 
                        duration-200
                        peer-focus:top-1 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-muted-foreground
                        ${value 
                            ? "top-1 translate-y-0 text-xs" 
                            : "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base"
                        }  
                        ${error 
                            ? "text-red-500" 
                            : "text-gray-500 peer-focus:text-black"
                        }
                    `}
                >
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

            <div className="mt-1 ">
                {message && (
                    <p
                        id={`${props.id}-message`}
                        className={`text-sm ${error ? "text-red-500" : "text-gray-500"}`}
                    >
                        {<span className="text-red-500">*</span>} {message}
                    </p>
                )}
            </div>
        </>
    )
}

export default EditInput;

