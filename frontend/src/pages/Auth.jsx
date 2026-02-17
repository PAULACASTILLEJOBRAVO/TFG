import { useState } from "react";
import { 
    AuthLayout, 
    AuthContainer, 
    AuthSidePanel, 
    AuthCard 
} from "@/components/Auth";
import { 
    LoginForm, 
    RegisterForm
}  from "@/components/Auth/Forms";

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