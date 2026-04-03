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

const PublishQuizDialog = ({open, quiz, onConfirm, onClose}) => {
    if (!quiz) return null;

    const { t } = useTranslation();

    return(
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {t("teacher.quizzesManagement.dialogs.publish.title")}
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    {t("teacher.quizzesManagement.dialogs.publish.description")}
                    <br />
                    <strong>{t("teacher.quizzesManagement.dialogs.publish.warning", {title: quiz.title})}</strong>
                </DialogDescription>

                <DialogFooter className="gap-2">
                    <Button className="bg-green-600 hover:bg-green-700" onClick={onConfirm}>
                        {t("common.publish")}
                    </Button>

                    <Button variant="outline" onClick={onClose}>
                        {t("common.cancel")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default PublishQuizDialog;