import { 
    DashboardContentDetailCard,
    DashboardDetailCard
 } from "@/components/Dashboard/Layout/Content";
import { useTranslation } from "react-i18next";
import { icons } from "@/utils/constants";

const QuizSessionsCards = ({ stats }) => {
    const { t } = useTranslation();
    
    return (
        <DashboardContentDetailCard cols={4}>
            <DashboardDetailCard
                icon={icons.participants}
                title={t("teacher.quizSessions.analytics.participants")}
                value={stats.participants}
                className="bg-blue-100"
            />
            <DashboardDetailCard
                icon={icons.accuracy}
                title={t("teacher.quizSessions.analytics.accuracy")}
                value={`${stats.accuracy}%`}
                className="bg-green-100"
            />
            <DashboardDetailCard
                icon={icons.averageTime}
                title={t("teacher.quizSessions.analytics.averageTime")}
                value={`${stats.avgTime}s`}
                className="bg-yellow-100"
            />
            <DashboardDetailCard
                icon={icons.sessions}
                title={t("teacher.quizSessions.analytics.totalSessions")}
                value={stats.sessions}
                className="bg-purple-100"
            />
        </DashboardContentDetailCard>
    );
}

export default QuizSessionsCards;