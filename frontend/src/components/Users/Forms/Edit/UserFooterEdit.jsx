import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const UserFooterEdit = ({ onCancel, onSave }) => {
    const { t } = useTranslation();

    return(
        <div className="flex justify-end gap-2 mt-4">
            <Button className="bg-green-500 hover:bg-green-500" onClick={onSave}>
                {t("common.update")} {t("admin.usersManagement.labelButton")}
            </Button>

            <Button variant="outline" onClick={onCancel}>
                {t("common.cancel")}
            </Button>
        </div>
    )
}

export default UserFooterEdit;