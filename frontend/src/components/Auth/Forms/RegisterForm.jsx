import { useState } from "react";
import { Spinner } from "../../ui/spinner";

import { useRegister } from "@/hooks/Auth/useRegister";

import { AuthButton, AuthInput } from '@/components/Auth';

import { InfoToast, ErrorToast } from "@/components/Common/Toasts";

import { validatePassword, validateUsername, validateEmail } from "@/utils/validators";

const RegisterForm = ({onToggle}) => {
    const [form, setForm] = useState({username: "",email: "", password: ""});
    const [touched, setTouched] = useState({username: false, email: false, password: false, confirmPassword: false});
    const [submitted, setSubmitted] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");

    const passwordError = validatePassword(form.password, confirmPassword);
    const usernameError = validateUsername(form.username);
    const emailError = validateEmail(form.email);

    const { registerUser, loading: registerLoading, feedback: registerFeedback } = useRegister();

    const handleRegister = async (event) => {
        event.preventDefault();
        setSubmitted(true);

        if(usernameError || emailError || passwordError) return;

        try{
            await registerUser(form);
        }catch(err){
            console.error("Register error:", err);
        }
    }

    return(
        <div className="h-full flex flex-col">
            <div className="flex-1"/>

            <h1 className={`text-center 
            ${
                (submitted || Object.values(touched).some(Boolean)) && (passwordError || usernameError || emailError) ? "text-xl font-semibold" : "text-3xl font-bold"
            }
            text-white 
            ${
               (submitted || Object.values(touched).some(Boolean)) && (passwordError || usernameError || emailError) ? "" : "sm:mb-6 mb-5"
            }`}>
                SING UP
            </h1>
            
            <div className={`flex flex-col gap-2 ${
                (submitted || Object.values(touched).some(Boolean)) && (passwordError || usernameError || emailError) ? "" : "sm:mb-6 mb-3"
            }`}>
                
                <AuthInput  
                    id="username"
                    label="Username"
                    value={form.username}
                    onChange={(e) => setForm({...form, username: e.target.value})}
                    onBlur={() => setTouched(prev => ({...prev, username: true}))}
                    error={(touched.username || submitted) && !!usernameError?.username}
                    errorMessage={usernameError?.username}
                    modeAuth={true}
                    isRequired={true}
                />

                <AuthInput
                    id="email"
                    label="Email"
                    type="email"
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

                <AuthInput
                    id="confirm-password"
                    label="Confirm password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onBlur={() => setTouched(prev => ({...prev, confirmPassword: true}))}
                    error={(touched.confirmPassword || submitted) && !!passwordError?.confirmPassword}
                    errorMessage={passwordError?.confirmPassword}
                    modeAuth={true}
                    isRequired={true}
                />
            </div>
        
            <AuthButton onClick={handleRegister} disabled={registerLoading}>
                {registerLoading ? <Spinner/> : "CREATE ACCOUNT"}
            </AuthButton>

            <button 
                className="mt-2 text-sm text-white underline sm:hidden"
                onClick={onToggle}
            >
                Have an account? Sign In
            </button>

            <div className="flex-1"/>

            {registerFeedback && registerFeedback.type === "error" && <ErrorToast message={registerFeedback.message} mode={true}/>}  
            {registerFeedback && registerFeedback.type === "info" && <InfoToast message={registerFeedback.message} mode={true}/>}
        </div>
    );
}

export default RegisterForm;