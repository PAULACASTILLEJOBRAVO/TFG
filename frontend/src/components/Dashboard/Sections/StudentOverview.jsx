import { 
    DashboardTitle,
    DashboardSubtitle
} from "../Layout/Content/";
import { Separator } from "@/components/ui/separator";
import { CardCarousel } from "@/components/Common";
import { useQuizzesForStudent } from "@/hooks/Quizzes/useQuizzesForStudent";
import { QuizDetailsCard } from "@/components/Quizzes/Content";
import { useTranslation } from "react-i18next";

const StudentOverview = () => {
    const { t } = useTranslation();

    const { quizzesForStudent, loading: loadingQuizzes } = useQuizzesForStudent({ limit: 6 });

    return(
        <>
            <DashboardTitle/>

            <Separator/>

            <DashboardSubtitle label={t("teacher.recent_sessions")}/>

            <CardCarousel loading={loadingQuizzes} basePath="/dashboard_student/quizzes/:id/history">
                {quizzesForStudent.map(q => (
                    <QuizDetailsCard key={q._id} quiz={q} isStudent={true} />
                ))}
            </CardCarousel>

            <Separator/>            
        </>
    );
}

export default StudentOverview;