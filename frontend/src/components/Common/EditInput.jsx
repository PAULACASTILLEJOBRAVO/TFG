import { Input } from "../ui/input";
import { Label } from "../ui/label";

const EditInput = ({label, value, error, isRequired = false, errorMessage = "", helperText = "", ...props}) => {
    const message = error ? errorMessage : helperText;

    return(
        <>
            <div className="relative w-full">
                <Input
                    id={props.id}
                    {...props}
                    value={value}
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
                        }`
                    }
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
            </div>
        </>
    )
}

export default EditInput;

