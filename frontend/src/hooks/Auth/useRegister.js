import { registerRequest } from "@/services/auth.service";
import { useLogin } from "./useLogin";
import { useState } from "react";
import { classifyStatus } from "@/utils/auth";

export const useRegister = () => {
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState(null);

    const { loginUser } = useLogin();

    const registerUser = async (form) => {        
        setLoading(true);
        setFeedback(null);

        try{
            const data = await registerRequest(form);
            const type = classifyStatus(data.status);
            
            if(type === "success"){
                await loginUser(form);
            }else{
                setFeedback({type: "info", message: data.data.message || ""});
            }
        }catch(err){
            const status = err.response?.status;
            const errorMessage = err.response?.data?.message || "Error to login";
            const type = classifyStatus(status);

            // 400-499 -> client error, 500-599 -> server error
            if(type === "info"){
                setFeedback({ type: "info", message: errorMessage });
            }else{
                setFeedback({ type: "error", message: errorMessage });
            }
        }finally{
            setLoading(false);
        }
    }

    return { registerUser, loading, feedback };
}

