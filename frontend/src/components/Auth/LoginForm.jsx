import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginRequest } from "../../services/auth.service";
import { useAuth } from "../../auth/AuthContext";

import AuthButton from '@/components/Auth/AuthButton';
import AuthInput from "@/components/Auth/AuthInput";

const LoginForm = ({onToggle}) => {
    const [form, setForm] = useState({email: "", password: ""});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [messages, setMessages] = useState("");

    const { login } = useAuth();

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        
        setLoading(true);
        setError(null);
        setMessages("");

        try{
            const { message, data } = await loginRequest(form);
            login(data);
            setMessages(message);

            navigate(`/dashboard_${data.role}`);
        }catch(err){
            const errorMessage = err.response?.data?.message || "Error to login";
            setError(errorMessage);
        }finally{
            setLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col">
            {messages && <p>{messages}</p>}                   
            <div className="flex-1"/>

            <h1 className="text-center text-3xl font-bold text-white mb-14">
                SING IN
            </h1>

            <div className="flex flex-col gap-2 mb-8">
                
                <AuthInput
                    label="Email"
                    value={form.email}
                    onChange={(e) => setForm({...form, email: e.target.value})}
                />

                <AuthInput
                    label="Password"
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({...form, password: e.target.value})}
                />
            </div>
            
            <AuthButton onClick={handleLogin} disabled={loading}>
                LOGIN
            </AuthButton>
            
            <button 
                className="mt-4 text-sm text-white underline sm:hidden"
                onClick={onToggle}
            >
                Don't have an account? Sign Up
            </button>

            <div className="flex-1"/>
            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
}

export default LoginForm;