import DashboardTitle from "../Layout/Content/DashboardTitle";
import { Separator } from "@/components/ui/separator";
import DashboardDetailCard from "../Layout/Content/DashboardDetailCard";
import DashboardContentDetailCard from "../Layout/Content/DashboardContentDetailCard";
import { useUsersStats } from "@/hooks/Users/useUsersStats";
import { Spinner } from "@/components/ui/spinner";
import ManagementSection from "../Layout/Content/Management/ManagementSection";

const AdminOverview = () => {
    const { usersStats, loading } = useUsersStats();

    return(
        <>
            <DashboardTitle/>

            <Separator/>

            <DashboardContentDetailCard cols="2">
                <DashboardDetailCard title={loading ? "" : "usuarios totales"} value={loading ? <Spinner/> : usersStats} />
                <DashboardDetailCard title="usuarios conectados" value="" />
                <DashboardDetailCard title="clickers totales" value="" />
                <DashboardDetailCard title="clickers activos" value="" />
            </DashboardContentDetailCard>

            <Separator/>

            <ManagementSection />           
        </>
    );
}

export default AdminOverview;