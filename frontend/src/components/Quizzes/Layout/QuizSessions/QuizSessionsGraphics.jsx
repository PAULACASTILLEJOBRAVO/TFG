import { useTranslation } from "react-i18next";
import { LineGraphic } from "@/components/Common/Charts";

const QuizSessionsGraphics = ({data, lines, xKey}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
        <LineGraphic
            title={t("teacher.quizSessions.analytics.accuracy")}
            data={data}
            lines={lines}
            xKey={xKey}
        />
    </div>
  );    
}

export default QuizSessionsGraphics;