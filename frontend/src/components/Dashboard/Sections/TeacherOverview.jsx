import DashboardTitle from "../Layout/Content/DashboardTitle";
import { Separator } from "@/components/ui/separator";
import DashboardContentInformationCard from "../Layout/Content/DashboardContentInformationCard";
import DashboardInformationCard from "../Layout/Content/DashboardInformationCard";
import { useStudents } from "@/hooks/Users/useStudents";
import { Spinner } from "@/components/ui/spinner";
import { useTeacherActiveCourses } from "@/hooks/Courses/useTeacherActiveCourses";

const TeacherOverview = () => {
    const { studentsStats, loading: loadingStudent  } = useStudents();
    const { activeCoursesForTeacher, loading: loadingActiveCourses} = useTeacherActiveCourses();

    return(
        <>
            <DashboardTitle/>

            <Separator/>

            <DashboardContentInformationCard cols="3">
                    <DashboardInformationCard title={loadingStudent ? "" : "estudiantes totales"} value={ loadingStudent ? <Spinner/> : studentsStats} />
                    <DashboardInformationCard title="estudiantes conectados" value="" />
                    <DashboardInformationCard title={loadingActiveCourses ? "" : "cursos activos"} value={loadingActiveCourses ? <Spinner/> : activeCoursesForTeacher} />
            </DashboardContentInformationCard>

            <Separator/>
        </>
    );
}

export default TeacherOverview;