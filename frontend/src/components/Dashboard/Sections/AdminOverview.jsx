import { 
    DashboardTitle, 
    DashboardDetailCard, 
    DashboardContentDetailCard 
} from "../Layout/Content";
import { Separator } from "@/components/ui/separator";
import { useUsersStats } from "@/hooks/Users/useUsersStats";
import { Spinner } from "@/components/ui/spinner";
import { ManagementSection } from "../Layout/Content/Management";
import { useTranslation } from "react-i18next";

const AdminOverview = () => {
    const { usersStats, loading: usersStatsLoading } = useUsersStats();

    const { t } = useTranslation();

    return(
        <>
            <DashboardTitle/>

            <Separator/>

            <DashboardContentDetailCard cols="3">
                <DashboardDetailCard title={t("admin.overview.totalUsers")} value={usersStatsLoading ? <Spinner/> : usersStats} />
                {/* <DashboardDetailCard title={t("admin.overview.connectedUsers")} value="" /> */}
                <DashboardDetailCard title={t("admin.overview.totalClickers")} value="" />
            </DashboardContentDetailCard>

            <Separator/>

            <ManagementSection />           
        </>
    );
}

export default AdminOverview;