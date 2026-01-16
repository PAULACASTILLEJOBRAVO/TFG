import DashboardTitle from "../Layout/Content/DashboardTitle";
import { Separator } from "@/components/ui/separator";
import DashboardInformationCard from "../Layout/Content/DashboardInformationCard";
import DashboardContentInformationCard from "../Layout/Content/DashboardContentInformationCard";
import { useUsersStats } from "@/hooks/Users/useUsersStats";
import { Spinner } from "@/components/ui/spinner";
import ManagementSection from "../Layout/Content/Management/ManagementSection";

const AdminOverview = () => {
    const { usersStats, loading } = useUsersStats();

    return(
        <>
            <DashboardTitle/>

            <Separator/>

            <DashboardContentInformationCard cols="2">
                <DashboardInformationCard title={loading ? "" : "usuarios totales"} value={loading ? <Spinner/> : usersStats} />
                <DashboardInformationCard title="usuarios conectados" value="" />
                <DashboardInformationCard title="clickers totales" value="" />
                <DashboardInformationCard title="clickers activos" value="" />
            </DashboardContentInformationCard>

            <Separator/>

            <ManagementSection />           
        </>
    );
}

export default AdminOverview;