import {
    DashboardTitle, 
    DashboardContentDetailCard, 
    DashboardDetailCard
} from "../Layout/Content";
import { Separator } from "@/components/ui/separator";
import { useStudentsStats } from "@/hooks/Users/useStudentsStats";
import { Spinner } from "@/components/ui/spinner";

const TeacherOverview = () => {
    const { studentsStats, loading: loadingStudent  } = useStudentsStats();

    return(
        <>
            <DashboardTitle/>

            <Separator/>

            <DashboardContentDetailCard cols="3">
                    <DashboardDetailCard title={loadingStudent ? "" : "estudiantes totales"} value={ loadingStudent ? <Spinner/> : studentsStats} />
                    <DashboardDetailCard title="estudiantes conectados" value="" />
            </DashboardContentDetailCard>

            <Separator/>
        </>
    );
}

export default TeacherOverview;