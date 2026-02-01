import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import AuthInput from "@/components/Auth/AuthInput";

const ChangePasswordUserDialog = ({open, user, onConfirm, onClose}) => {
    const [password, setPassword] = useState("");

    if(!user) return null;

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
                    label="Nueva Contraseña"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword( e.target.value)}
                />

                <DialogFooter className="gap-2">
                    <Button className="bg-green-500 hover:bg-green-500" onClick={() => onConfirm(password)}>
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