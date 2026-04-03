import { useAuth } from "@/auth/AuthContext";
import { useTranslation } from "react-i18next";

const DashboardTitle = () => {
    const { user } = useAuth();

    const { t } = useTranslation();

    return(
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center font-bold my-4 md:my-6">
            { user.role === "admin" ? t("admin.adminPanel") : t(`${user.role}.greeting`, { username: user.username }) }
        </h1>
    );
}

export default DashboardTitle;