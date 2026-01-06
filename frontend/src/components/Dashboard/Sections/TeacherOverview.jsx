import DashboardTitle from "../Layout/Content/DashboardTitle";
import { Separator } from "@/components/ui/separator";
import DashboardContentInformationCard from "../Layout/Content/DashboardContentInformationCard";
import DashboardInformationCard from "../Layout/Content/DashboardInformationCard";

const TeacherOverview = () => {
    return(
        <>
            <DashboardTitle/>

            <Separator/>

            <DashboardContentInformationCard cols="3">
                    <DashboardInformationCard title="estudiantes totales" value="20" />
                    <DashboardInformationCard title="estudiantes conectados" value="10" />
                    <DashboardInformationCard title="cursos activos" value="10" />
            </DashboardContentInformationCard>

            <Separator/>
        </>
    );
}

export default TeacherOverview;