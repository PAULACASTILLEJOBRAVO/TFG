import { 
    Card, 
    CardContent 
} from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { 
    DashboardContentDetailCard,
    DashboardDetailCard
} from "@/components/Dashboard/Layout/Content";
import { icons } from "@/utils/constants";

const SingleSessionInsight = ({ session, stats }) => {
  const { t } = useTranslation();

  if (!session) return null;

  const accuracy = stats.accuracy;
  const avgTime = stats.avgTime;

  const getInsight = () => {
    if (accuracy >= 80) return "teacher.quizSessions.analytics.insightMessages.excellent";
    if (accuracy >= 60) return "teacher.quizSessions.analytics.insightMessages.good";
    return "teacher.quizSessions.analytics.insightMessages.poor";
  };

  return (
    <>
        <DashboardContentDetailCard cols={2}>
            {/* Accuracy */}
            <DashboardDetailCard 
                icon={icons.accuracy}
                title={t("teacher.quizSessions.analytics.accuracy")}
                value={`${accuracy}%`}
            />

            {/* Average Time */}
                <DashboardDetailCard 
                icon={icons.averageTime}
                title={t("teacher.quizSessions.analytics.averageTime")}
                value={`${avgTime}s`}
            />
            
            </DashboardContentDetailCard>

            {/* Insight */}
            <DashboardDetailCard
                value={t(getInsight())}
            />

    </>
  );
};

export default SingleSessionInsight;