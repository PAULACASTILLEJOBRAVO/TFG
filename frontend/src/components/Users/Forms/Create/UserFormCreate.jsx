import { EditInput } from "@/components/Common";
import { UserRoleSelector } from "../Edit";
import { 
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserProfilePictureChanger } from "../View";
import { 
    validateUsername, 
    validateEmail, 
    validatePassword 
} from "@/utils/validators";
import { useState } from "react";

const UserFormCreate = ({newUser, onChange, onSubmit}) => {
    const [submitted, setSubmitted] = useState(false);
    const [touched, setTouched] = useState({email: false, password: false});
    const [confirmPassword, setConfirmPassword] = useState("");

    const usernameError = validateUsername(newUser.username);
    const passwordError = validatePassword(newUser.password, confirmPassword);
    const emailError = validateEmail(newUser.email);

    const handleConfirm = () => {
        setSubmitted(true);

        if(usernameError || passwordError || emailError) return;

        onSubmit(newUser);
    };

    return (
        <Card className="max-w-xl mx-auto">
            <CardHeader>
                <CardTitle>Información del usuario</CardTitle>
            </CardHeader>

            <CardContent className="space-y-2">
                <div className="flex justify-center">
                    <UserProfilePictureChanger avatar={newUser.profilePicture} username={newUser.username} onChange={onChange} />
                </div>
                
                <EditInput 
                    label="Nombre completo (Opcional)" 
                    value={newUser.fullname} 
                    onChange={e => onChange("fullname", e.target.value)} 
                />

                <EditInput 
                    label="Nombre de usuario" 
                    value={newUser.username} 
                    onChange={e => onChange("username", e.target.value)} 
                    onBlur={() => setTouched(prev => ({...prev, username: true}))}
                    error={(touched.username || submitted) && !!usernameError?.username}
                    errorMessage={usernameError?.username}
                    isRequired={true}
                />

                <EditInput 
                    label="Email" 
                    type="email" 
                    value={newUser.email} 
                    onChange={e => onChange("email", e.target.value)} 
                    onBlur={() => setTouched(prev => ({...prev, email: true}))}
                    error={(touched.email || submitted) && !!emailError?.email}
                    errorMessage={emailError?.email}
                    isRequired={true}
                />
                
                <EditInput 
                    label="Contraseña" 
                    type="password" 
                    value={newUser.password} 
                    onChange={e => onChange("password", e.target.value)} 
                    onBlur={() => setTouched(prev => ({...prev, password: true}))}
                    error={(touched.password || submitted) && !!passwordError?.password}
                    errorMessage={passwordError?.password}
                    isRequired={true}  
                />

                <EditInput 
                    label="Confirmar contraseña" 
                    type="password"
                    value={confirmPassword} 
                    onChange={e => setConfirmPassword(e.target.value)}
                    onBlur={() => setTouched(prev => ({...prev, confirmPassword: true}))}
                    error={(touched.confirmPassword || submitted) && !!passwordError?.confirmPassword}
                    errorMessage={passwordError?.confirmPassword}
                    isRequired={true}  
                />
                
                <UserRoleSelector onChange={value => onChange("role", value)} />

                <div className="pt-4">
                    <Button className="bg-green-500 hover:bg-green-500 w-full" onClick={handleConfirm}>
                        Crear usuario
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

export default UserFormCreate;