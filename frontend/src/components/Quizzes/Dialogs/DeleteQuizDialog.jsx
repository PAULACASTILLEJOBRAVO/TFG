import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription, 
    DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const DeleteQuizDialog = ({open, quiz, onConfirm, onClose}) => {
    if (!quiz) return null;

    const { t } = useTranslation();

    return(
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {t("teacher.quizzesManagement.dialogs.delete.title")}
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    {t("teacher.quizzesManagement.dialogs.delete.description")}
                    <br />
                    <strong>{t("teacher.quizzesManagement.dialogs.delete.warning", {title: quiz.title})}</strong>
                </DialogDescription>

                <DialogFooter className="gap-2">
                    <Button variant="destructive" onClick={() => onConfirm("Quiz removed by the teacher with id: " + quiz.creatorId)}>
                        {t("common.delete")}
                    </Button>

                    <Button variant="outline" onClick={onClose}>
                        {t("common.cancel")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default DeleteQuizDialog;