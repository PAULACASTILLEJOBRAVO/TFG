import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription, 
    DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const DeleteClickerDialog = ({open, clicker, onConfirm, onClose}) => {
    return(
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Eliminar clicker
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Esta opción eliminará el clicker <strong>{clicker.deviceCode}</strong>. 
                </DialogDescription>

                <DialogFooter className="gap-2">
                    <Button variant="destructive" onClick={() => onConfirm("Clicker removed by an admin")}>
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

export default DeleteClickerDialog;