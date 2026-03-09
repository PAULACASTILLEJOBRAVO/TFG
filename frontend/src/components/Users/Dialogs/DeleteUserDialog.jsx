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

const DeleteUserDialog = ({open, user, onConfirm, onClose}) => {
    const { t } = useTranslation();

    return(
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {t("admin.usersManagement.dialogs.delete.title")}
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    {t("admin.usersManagement.dialogs.delete.description")}
                    <br />
                    <strong>{t("admin.usersManagement.dialogs.delete.warning", {username: user.username})}</strong>
                </DialogDescription>

                <DialogFooter className="gap-2">
                    <Button variant="destructive" onClick={() => onConfirm("User removed by an admin")}>
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

export default DeleteUserDialog;