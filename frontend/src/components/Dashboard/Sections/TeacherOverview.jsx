import {
    DashboardTitle, 
    DashboardSubtitle, 
} from "../Layout/Content";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";
import { CardCarousel } from "@/components/Common";
import { useQuizzesForTeacher } from "@/hooks/Quizzes/useQuizzesForTeacher";
import { QuizDetailsCard } from "@/components/Quizzes/Content";

const TeacherOverview = () => {
    const { t } = useTranslation();
    
    const { quizzesForTeacher, loading: loadingQuizzes } = useQuizzesForTeacher({ limit: 4 });

    return(
        <>
            <DashboardTitle/>

            <Separator/>

            <DashboardSubtitle label={t("teacher.recent_quizzes")}/>

            <CardCarousel loading={loadingQuizzes} basePath="/dashboard_teacher/quizzes/:id/sessions">
                {quizzesForTeacher.map(q => (
                    <QuizDetailsCard key={q._id} quiz={q} />
                ))}
            </CardCarousel>

            <Separator/>
        </>
    );
}

export default TeacherOverview;