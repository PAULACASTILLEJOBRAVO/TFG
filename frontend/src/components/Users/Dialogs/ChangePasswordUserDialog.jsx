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
import { useTranslation } from "react-i18next";

const ChangePasswordUserDialog = ({open, user, onConfirm, onClose}) => {
    const { t } = useTranslation();
    
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
                       {t("admin.usersManagement.dialogs.changePassword.title")}
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    <strong>{t("admin.usersManagement.dialogs.changePassword.description", {username: user.username})}</strong>
                </DialogDescription>

                <AuthInput
                    id="new-password"
                    label={t("admin.usersManagement.dialogs.changePassword.newPassword")}
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
                    label={t("admin.usersManagement.dialogs.changePassword.confirmPassword")}
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
                        {t("common.changePassword")}
                    </Button>

                    <Button variant="outline" onClick={onClose}>
                        {t("common.cancel")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default ChangePasswordUserDialog;