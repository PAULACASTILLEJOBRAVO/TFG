import DashboardTitle from "../Layout/Content/DashboardTitle";
import { Separator } from "@/components/ui/separator";
import DashboardInformationCard from "../Layout/Content/DashboardInformationCard";
import DashboardContentInformationCard from "../Layout/Content/DashboardContentInformationCard";

const AdminOverview = () => {
    return(
        <>
            <DashboardTitle/>

            <Separator/>

            <DashboardContentInformationCard cols="2">
                <DashboardInformationCard title="usuarios totales" value="40" />
                <DashboardInformationCard title="usuarios conectados" value="15" />
                <DashboardInformationCard title="clickers totales" value="30" />
                <DashboardInformationCard title="clickers activos" value="10" />
            </DashboardContentInformationCard>

            <Separator/>
           
        </>
    );
}

export default AdminOverview;