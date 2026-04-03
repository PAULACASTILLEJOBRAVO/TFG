import { useState } from "react";
import { Spinner } from "../../ui/spinner";

import { 
    AuthButton, 
    AuthInput 
} from '@/components/Auth';
import { useLogin } from "@/hooks/Auth/useLogin";

import { 
    InfoToast, 
    ErrorToast 
} from "@/components/Common/Toasts";

import { 
    validatePassword, 
    validateEmail 
} from "@/utils/validators";
import { Checkbox } from "@/components/ui/checkbox";

const LoginForm = ({onToggle}) => {
    const [form, setForm] = useState({email: "", password: ""});
    const [rememberMe, setRememberMe] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [touched, setTouched] = useState({email: false, password: false});

    const passwordError = validatePassword(form.password);
    const emailError = validateEmail(form.email);

    const { loginUser, loading: loginLoading, feedback: loginFeedback } = useLogin();

    const handleLogin = async (event) => {
        event.preventDefault();
        
        setSubmitted(true);
        if(emailError || passwordError) return;
        
        try{
            await loginUser(form, rememberMe);
        }catch(err){
            console.error("Login error:", err);
        }
    };

    return (
        <div className="h-full flex flex-col">                 
            <div className="flex-1"/>

            <h1 className="text-center text-3xl font-bold text-white mb-14">
                SING IN
            </h1>

            <div className="flex flex-col gap-2 mb-8">
                
                <AuthInput
                    id="email"
                    label="Email"
                    value={form.email}
                    onChange={(e) => setForm({...form, email: e.target.value})}
                    onBlur={() => setTouched(prev => ({...prev, email: true}))}
                    error={(touched.email || submitted) && !!emailError?.email}
                    errorMessage={emailError?.email}
                    modeAuth={true}
                    isRequired={true}
                />

                <AuthInput
                    id="password"
                    label="Password"
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({...form, password: e.target.value})}
                    onBlur={() => setTouched(prev => ({...prev, password: true}))}
                    error={(touched.password || submitted) && !!passwordError?.password}
                    errorMessage={passwordError?.password}
                    modeAuth={true}
                    isRequired={true}
                />

           
                <div className="flex items-center gap-2">
                    <Checkbox className="bg-white" checked={rememberMe} onCheckedChange={(checked) => setRememberMe(checked)} />
                    <span className="text-sm text-white select-none">Remember me</span>
                </div>
            </div>

 
            
            <AuthButton onClick={handleLogin} disabled={loginLoading}>
                {loginLoading ? <Spinner /> : "LOGIN"}
            </AuthButton>
            
            <button 
                className="mt-4 text-sm text-white underline sm:hidden"
                onClick={onToggle}
            >
                Don't have an account? Sign Up
            </button>

            <div className="flex-1"/>

            {loginFeedback && loginFeedback.type === "error" && <ErrorToast message={loginFeedback.message} mode={true}/>}  
            {loginFeedback && loginFeedback.type === "info" && <InfoToast message={loginFeedback.message} mode={true}/>}
        </div>
    );
}

export default LoginForm;