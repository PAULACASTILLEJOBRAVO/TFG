import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

const UserStatusChip = ({ deleted }) => {
    const { t } = useTranslation();

    if(deleted) {
        return (
            <Badge variant="destructive" className="shrink-0">
                {t("admin.usersManagement.drawer.view.archived")}
            </Badge>
        );
    }
}

export default UserStatusChip;