import { useState } from "react";
import { registerRequest, loginRequest } from "../../services/auth.service";
import { useAuth } from "../../auth/AuthContext";
import { validatePassword } from "../../utils/validators";

import AuthButton from '@/components/Auth/AuthButton';
import AuthInput from "@/components/Auth/AuthInput";

const RegisterForm = ({onToggle}) => {
    const [form, setForm] = useState({username: "",email: "", password: ""});
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [messages, setMessages] = useState("");

    const { login } = useAuth();

    const loginFunction = async (credentials) => {
        setLoading(true);
        setError(null);
        setMessages("");

        try{
            const { message, data } = await loginRequest(form);
            login(data);
            setMessages(message);
        }catch(err){
            const errorMessage = err.response?.data?.message || "Error to login";
            setError(errorMessage);
        }finally{
            setLoading(false);
        }
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        
        setLoading(true);
        setError(null);
        setMessages("");

        const validationError = validatePassword(form.password, confirmPassword);
        if(validationError){
            setError(validationError);
            setLoading(false);
            return;
        }

        try{
            const { data } = await registerRequest(form);
            await loginFunction({email: form.email, password: form.password});
        }catch(err){
            const errorMessage = err.response?.data?.message || "Error to register";
            setError(errorMessage);
        }finally{
            setLoading(false);
        }
    }

    return(
        <div className="h-full flex flex-col">
            <div className="flex-1"/>
            {messages && <p>{messages}</p>}

            <h1 className="text-center text-3xl font-bold text-white sm:mb-6 mb-5">
                SING UP
            </h1>
            
            <div className="flex flex-col gap-2 sm:mb-6 mb-3">
                
                <AuthInput
                    label="Username"
                    value={form.username}
                    onChange={(e) => setForm({...form, username: e.target.value})}
                />

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

                <AuthInput
                    label="Confirm password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </div>
        
            <AuthButton onClick={handleRegister} disabled={loading}>
                CREATE ACCOUNT
            </AuthButton>

            <button 
                className="mt-2 text-sm text-white underline sm:hidden"
                onClick={onToggle}
            >
                Have an account? Sign In
            </button>

            {error && <p className="text-red-500">{error}</p>}

            <div className="flex-1"/>
        </div>
    );
}

export default RegisterForm;