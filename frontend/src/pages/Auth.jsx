import { useState } from "react";

import AuthLayout from "@/components/Auth/AuthLayout";
import AuthContainer from "@/components/Auth/AuthContainer";
import AuthSidePanel from "@/components/Auth/AuthSidePanel";
import AuthCard from "@/components/Auth/AuthCard";
import LoginForm from "@/components/Auth/Forms/LoginForm";
import RegisterForm from "@/components/Auth/Forms/RegisterForm";

const Auth = () => {
    const [mode, setMode] = useState("login"); // "login" | "register"

    const handleToggle = () => {
        setMode(mode === "login" ? "register" : "login");
    };

    return(
        <AuthLayout>
            <AuthContainer>
                    <AuthSidePanel onToggle={handleToggle}/>

                    <AuthCard mode = {mode}>
                        {mode === "login" ? <LoginForm onToggle={handleToggle} /> : <RegisterForm onToggle={handleToggle}/>}
                    </AuthCard>
            </AuthContainer> 
        </AuthLayout>
    );
}

export default Auth;