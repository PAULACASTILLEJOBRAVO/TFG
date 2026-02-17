import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription, 
    DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const DeleteQuizDialog = ({open, quiz, onConfirm, onClose}) => {
    if (!quiz) return null;

    return(
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Eliminar quiz
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Esta opción eliminará el quiz <strong>{quiz.title}</strong>. 
                    No podrá ser publicado ni jugado, pero podrás restaurarlo más tarde si lo deseas.
                </DialogDescription>

                <DialogFooter className="gap-2">
                    <Button variant="destructive" onClick={() => onConfirm("Quiz removed by the teacher with id: " + quiz.creatorId)}>
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

export default DeleteQuizDialog;