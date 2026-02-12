import DashboardTitle from "../Layout/Content/DashboardTitle";
import { Separator } from "@/components/ui/separator";
import DashboardContentDetailCard from "../Layout/Content/DashboardContentDetailCard";
import DashboardDetailCard from "../Layout/Content/DashboardDetailCard";
import { useStudentsStats } from "@/hooks/Users/useStudentsStats";
import { Spinner } from "@/components/ui/spinner";
import { useTeacherActiveCourses } from "@/hooks/Courses/useTeacherActiveCourses";

const TeacherOverview = () => {
    const { studentsStats, loading: loadingStudent  } = useStudentsStats();
    const { activeCoursesForTeacher, loading: loadingActiveCourses} = useTeacherActiveCourses();

    return(
        <>
            <DashboardTitle/>

            <Separator/>

            <DashboardContentDetailCard cols="3">
                    <DashboardDetailCard title={loadingStudent ? "" : "estudiantes totales"} value={ loadingStudent ? <Spinner/> : studentsStats} />
                    <DashboardDetailCard title="estudiantes conectados" value="" />
                    <DashboardDetailCard title={loadingActiveCourses ? "" : "cursos activos"} value={loadingActiveCourses ? <Spinner/> : activeCoursesForTeacher} />
            </DashboardContentDetailCard>

            <Separator/>
        </>
    );
}

export default TeacherOverview;