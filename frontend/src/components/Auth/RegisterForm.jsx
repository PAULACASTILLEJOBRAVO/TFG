import { useState } from "react";

import AuthButton from '@/components/Auth/AuthButton';
import AuthInput from "@/components/Auth/AuthInput";

const RegisterForm = () => {
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

            <h1 className="text-center text-3xl font-bold text-white mb-6">
                SING UP
            </h1>

            
            <div className="flex flex-col gap-2 mb-6">
                
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

            <div className="flex-1"/>
        </div>
    );
}

export default RegisterForm;