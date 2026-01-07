import DashboardTitle from "../Layout/Content/DashboardTitle";
import { Separator } from "@/components/ui/separator";
import DashboardInformationCard from "../Layout/Content/DashboardInformationCard";
import DashboardContentInformationCard from "../Layout/Content/DashboardContentInformationCard";
import { useUsers } from "@/hooks/Users/useUsers";
import { Spinner } from "@/components/ui/spinner";

const AdminOverview = () => {
    const { usersStats, loading } = useUsers();

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
           
        </>
    );
}

export default AdminOverview;