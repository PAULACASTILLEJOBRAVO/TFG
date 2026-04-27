import { 
    DashboardTitle, 
    DashboardDetailCard, 
    DashboardContentDetailCard 
} from "../Layout/Content";
import { Separator } from "@/components/ui/separator";
import { useUsersStats } from "@/hooks/Users/useUsersStats";
import { useClickersStats } from "@/hooks/Clickers/useClickersStats";
import { Spinner } from "@/components/ui/spinner";
import { ManagementSection } from "../Layout/Content/Management";
import { useTranslation } from "react-i18next";
import { icons } from "@/utils/constants";

const AdminOverview = () => {
    const { Userstats: { total: usersStats, active: activeUsersStats, connected: connectedUsersStats, archived: archivedUsersStats },
        loading: usersStatsLoading } = useUsersStats();
    const { 
        clickersStats: { total: clickersStats, active: activeClickersStats, inUse: inUseClickersStats, available: availableClickersStats, inactive: inactiveClickersStats },
        loading: clickersStatsLoading } = useClickersStats();

    const { t } = useTranslation();

    return(
        <>
            <DashboardTitle/>

            <Separator/>

            <DashboardContentDetailCard cols="4">
                {/* // Users */}
                <DashboardDetailCard 
                    icon={icons.user} 
                    title={t("admin.overview.totalUsers")} 
                    value={ usersStatsLoading ? <Spinner/> : usersStats} 
                    className="bg-amber-100"
                />
                <DashboardDetailCard 
                    icon={icons.user} 
                    title={t("admin.overview.activeUsers")} 
                    value={usersStatsLoading ? <Spinner/> : activeUsersStats} 
                    className="bg-green-100" 
                />
                <DashboardDetailCard 
                    icon={icons.user} 
                    title={t("admin.overview.connectedUsers")} 
                    value={usersStatsLoading ? <Spinner/> : connectedUsersStats}
                    className="bg-green-400"
                    colorTextIcon="text-white"
                    colorTextTitle="text-white"
                    colorTextValue="text-white"
                />
                <DashboardDetailCard 
                    icon={icons.user} 
                    title={t("admin.overview.archivedUsers")} 
                    value={usersStatsLoading ? <Spinner/> : archivedUsersStats} 
                    className="bg-red-600" 
                    colorTextIcon="text-white" 
                    colorTextTitle="text-white" 
                    colorTextValue="text-white" 
                />
            </DashboardContentDetailCard>

            <DashboardContentDetailCard cols="5">
                {/* // Clickers */}
                <DashboardDetailCard 
                    icon={icons.clicker} 
                    title={t("admin.overview.totalClickers")} 
                    value={clickersStatsLoading ? <Spinner/> : clickersStats}
                    className="bg-amber-100"
                />
                <DashboardDetailCard 
                    icon={icons.clicker} 
                    title={t("admin.overview.activeClickers")} 
                    value={clickersStatsLoading ? <Spinner/> : activeClickersStats} 
                    className="bg-green-100" 
                />
                <DashboardDetailCard 
                    icon={icons.clicker} 
                    title={t("admin.overview.inUseClickers")} 
                    value={clickersStatsLoading ? <Spinner/> : inUseClickersStats} 
                    className="bg-blue-400" 
                    colorTextIcon="text-white" 
                    colorTextTitle="text-white" 
                    colorTextValue="text-white" 
                />
                <DashboardDetailCard 
                    icon={icons.clicker} 
                    title={t("admin.overview.availableClickers")} 
                    value={clickersStatsLoading ? <Spinner/> : availableClickersStats} 
                    className="bg-green-400" 
                    colorTextIcon="text-white" 
                    colorTextTitle="text-white" 
                    colorTextValue="text-white" 

                />
                <DashboardDetailCard 
                    icon={icons.clicker} 
                    title={t("admin.overview.inactiveClickers")} 
                    value={clickersStatsLoading ? <Spinner/> : inactiveClickersStats} 
                    className="bg-red-600" 
                    colorTextIcon="text-white" 
                    colorTextTitle="text-white" 
                    colorTextValue="text-white" 
                />
            </DashboardContentDetailCard>

            <Separator/>

            <ManagementSection />           
        </>
    );
}

export default AdminOverview;