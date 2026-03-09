import { ManagementButton } from ".";
import { User } from "lucide-react";
import { DashboardSubtitle } from "..";
import { useTranslation } from "react-i18next";

const ManagementSection = () => {
    const { t } = useTranslation();

    return (
        <section className="mt-8">
            <DashboardSubtitle label={t("admin.overview.title")} />

            <div className="
                grid grid-cols-1 md:grid-cols-2 
                gap-6 
                justify-items-center">
                <ManagementButton
                    icon={User}
                    label={t("admin.overview.managementUser")}
                    to="/dashboard_admin/users"
                />

                <ManagementButton
                    icon="/ClickerIcon.png"
                    label={t("admin.overview.managementClicker")}
                    to="/dashboard_admin/clickers"
                />
            </div>
        </section>
    );
}

export default ManagementSection;
