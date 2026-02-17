import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription, 
    DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const DeleteUserDialog = ({open, user, onConfirm, onClose}) => {
    return(
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Eliminar usuario
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Esta opción eliminará al usuario <strong>{user.username}</strong>. 
                    No podrá volver a iniciar sesión.
                </DialogDescription>

                <DialogFooter className="gap-2">
                    <Button variant="destructive" onClick={() => onConfirm("User removed by an admin")}>
                        Eliminar
                    </Button>

                    <Button variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default DeleteUserDialog;