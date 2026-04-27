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

const ArchiveUserDialog = ({open, user, onConfirm, onClose}) => {
    const { t } = useTranslation();

    return(
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {t("admin.usersManagement.dialogs.archive.title")}
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    {t("admin.usersManagement.dialogs.archive.description")}
                    <br />
                    <strong>{t("admin.usersManagement.dialogs.archive.warning", {username: user.username})}</strong>
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

export default ArchiveUserDialog;