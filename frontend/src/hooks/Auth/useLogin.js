import { loginRequest } from "@/services/auth.service";
import { useAuth } from "@/auth/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { classifyStatus } from "@/utils/auth";

export const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState(null);

    const { login } = useAuth();
    const navigate = useNavigate();

    const loginUser = async (form, rememberMe = false) => {
        setLoading(true);
        setFeedback(null);

        try{
            const data = await loginRequest(form);  
            const type = classifyStatus(data.status);

            // 200-299 -> success
            if (type === "success") {
                login(data.data.data, rememberMe);
                navigate(`/dashboard_${data.data.data.role}`);
            } else {
                setFeedback(
                    { type: "info", message: data.data.message || "" }
                );
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

    return { loginUser, loading, feedback };
}
