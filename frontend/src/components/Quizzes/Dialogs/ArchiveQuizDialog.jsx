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

const ArchiveQuizDialog = ({open, quiz, onConfirm, onClose}) => {
    if (!quiz) return null;

    const { t } = useTranslation();

    return(
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {t("teacher.quizzesManagement.dialogs.archive.title")}
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    {t("teacher.quizzesManagement.dialogs.archive.description")}
                    <br />
                    <strong>{t("teacher.quizzesManagement.dialogs.archive.warning", {title: quiz.title})}</strong>
                </DialogDescription>

                <DialogFooter className="gap-2">
                    <Button variant="destructive" onClick={() => onConfirm()}>
                        {t("common.archive")}
                    </Button>

                    <Button variant="outline" onClick={onClose}>
                        {t("common.cancel")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default ArchiveQuizDialog;