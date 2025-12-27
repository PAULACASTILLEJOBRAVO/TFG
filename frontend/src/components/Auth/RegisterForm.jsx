import { useState } from "react";

import AuthButton from '@/components/Auth/AuthButton';
import AuthInput from "@/components/Auth/AuthInput";

const RegisterForm = ({onToggle}) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleLogin = () => {
        console.log("Register con: ", username, email, password, confirmPassword);
    }

    return(
        <div className="h-full flex flex-col">
            <div className="flex-1"/>

            <h1 className="text-center text-3xl font-bold text-white sm:mb-6 mb-5">
                SING UP
            </h1>
            
            <div className="flex flex-col gap-2 sm:mb-6 mb-3">
                
                <AuthInput
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <AuthInput
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <AuthInput
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <AuthInput
                    label="Confirm password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </div>
        
            <AuthButton onClick={handleLogin}>
                CREATE ACCOUNT
            </AuthButton>

            <button 
                className="mt-2 text-sm text-white underline sm:hidden"
                onClick={onToggle}
            >
                Have an account? Sign In
            </button>

            <div className="flex-1"/>
        </div>
    );
}

export default RegisterForm;