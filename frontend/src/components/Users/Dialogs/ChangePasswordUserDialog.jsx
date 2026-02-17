import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription, 
    DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AuthInput } from "@/components/Auth";
import { validatePassword } from "@/utils/validators";

const ChangePasswordUserDialog = ({open, user, onConfirm, onClose}) => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [touched, setTouched] = useState({password: false, confirmPassword: false});
    const [submitted, setSubmitted] = useState(false);

    const passwordError = validatePassword(password, confirmPassword);

    const handleConfirm = () => {
        setSubmitted(true);
        
        if (passwordError?.password || passwordError?.confirmPassword) return; 

        onConfirm(password);
    }

    return(
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                       Cambiar contraseña
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Establece una nueva contraseña para el usuario <strong>{user.username}</strong>. 
                </DialogDescription>

                <AuthInput
                    id="new-password"
                    label="Nueva Contraseña"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword( e.target.value)}
                    onBlur={() => setTouched(prev => ({...prev, password: true}))}
                    error={(touched.password || submitted) && !!passwordError?.password}
                    errorMessage={passwordError?.password}
                    isRequired={true}
                />

                <AuthInput
                    id="confirm-password"
                    label="Confirmar contraseña"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onBlur={() => setTouched(prev => ({...prev, confirmPassword: true}))}
                    error={(touched.confirmPassword || submitted) && !!passwordError?.confirmPassword}
                    errorMessage={passwordError?.confirmPassword}
                    isRequired={true}
                />

                <DialogFooter className="gap-2">
                    <Button className="bg-green-500 hover:bg-green-500" onClick={handleConfirm}>
                        Cambiar contraseña
                    </Button>

                    <Button variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default ChangePasswordUserDialog;