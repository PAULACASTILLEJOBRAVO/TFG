import { 
    DashboardTitle, 
    DashboardDetailCard, 
    DashboardContentDetailCard 
} from "../Layout/Content";
import { Separator } from "@/components/ui/separator";
import { useUsersStats } from "@/hooks/Users/useUsersStats";
import { Spinner } from "@/components/ui/spinner";
import { ManagementSection } from "../Layout/Content/Management";

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