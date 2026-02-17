import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription, 
    DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const PublishQuizDialog = ({open, quiz, onConfirm, onClose}) => {
    if (!quiz) return null;

    return(
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Publicar quiz
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Esta opción publicará el quiz <strong>{quiz.title}</strong>. 
                    Los alumnos podrán jugarlo una vez publicado.
                </DialogDescription>

                <DialogFooter className="gap-2">
                    <Button className="bg-green-600 hover:bg-green-700" onClick={onConfirm}>
                        Publicar
                    </Button>

                    <Button variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default PublishQuizDialog;