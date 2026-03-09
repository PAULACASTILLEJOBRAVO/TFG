import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

const ClickerStatusChip = ({ status }) => {
    const { t } = useTranslation();

    if(status === "damaged") {
        return (
            <Badge variant="destructive">
                {t("admin.clickersManagement.row.edit.damaged")}
            </Badge>
        );
    }

    if(status === "assigned") {
        return (
            <Badge variant="outline" className="bg-blue-500 text-white hover:bg-blue-400">
                {t("admin.clickersManagement.row.edit.assigned")}
            </Badge>
        );
    }

    if(status === "available") {
        return (
            <Badge variant="outline" className="bg-green-500 text-white hover:bg-green-400">
                {t("admin.clickersManagement.row.edit.available")}
            </Badge>
        );
    }

    if(status === "retired") {
        return (
            <Badge variant="outline" className="bg-gray-500 text-white hover:bg-gray-400">
                {t("admin.clickersManagement.row.edit.retired")}
            </Badge>
        );
    }

    return (
        <Badge variant="outline">
            {t("admin.clickersManagement.row.edit.unknown")}
        </Badge>
    );
}

export default ClickerStatusChip;