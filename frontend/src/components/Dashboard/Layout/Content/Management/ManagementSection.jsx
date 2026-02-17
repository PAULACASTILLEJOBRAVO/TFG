import { ManagementButton } from ".";
import { User } from "lucide-react";
import { DashboardSubtitle } from "..";

const ManagementSection = () => {
    return (
        <section className="mt-8">
            <DashboardSubtitle label="Gestión"/>

            <div className="
                grid grid-cols-1 md:grid-cols-2 
                gap-6 
                justify-items-center">
                <ManagementButton
                    icon={User}
                    label="Usuarios"
                    to="/dashboard_admin/users"
                />

                <ManagementButton
                    icon="/ClickerIcon.png"
                    label="Clickers"
                    to="/dashboard_admin/clickers"
                />
            </div>
        </section>
    );
}

export default ManagementSection;
