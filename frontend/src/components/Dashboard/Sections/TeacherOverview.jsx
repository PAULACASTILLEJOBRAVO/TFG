import {
    DashboardTitle, 
    DashboardContentDetailCard, 
    DashboardDetailCard
} from "../Layout/Content";
import { Separator } from "@/components/ui/separator";
import { useStudentsStats } from "@/hooks/Users/useStudentsStats";
import { Spinner } from "@/components/ui/spinner";
import { useTranslation } from "react-i18next";

const TeacherOverview = () => {
    const { studentsStats, loading: loadingStudent  } = useStudentsStats();

    const { t } = useTranslation();

    return(
        <>
            <DashboardTitle/>

            <Separator/>

            <DashboardContentDetailCard cols="2">
                    <DashboardDetailCard title={t("teacher.overview.totalStudents")} value={loadingStudent ? <Spinner/> : studentsStats} />
                    <DashboardDetailCard title={t("teacher.overview.connectedStudents")} value="" />
            </DashboardContentDetailCard>

            <Separator/>
        </>
    );
}

export default TeacherOverview;