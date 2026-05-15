import { BarGraphic } from "@/components/Common/Charts";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";

const QuizQuestionsAnalytics = ({ analytics }) => {
  const { t } = useTranslation();

  if(!analytics.length) return null;

  const getAccuracyColor = (accuracy) => {
    if (accuracy >= 80) return "text-green-600";
    if (accuracy >= 50) return "text-yellow-500";
    return "text-red-500";
  }

  return (
    <Tabs defaultValue={`session-${analytics[0].sessionId}`} className="w-full">

      {/* TOP TAB - One tab per session */}
      <TabsList className="w-full flex">
        {analytics.map((session, index) =>  (
          <TabsTrigger key={session.sessionId} value={`session-${session.sessionId}`} className="flex-1">{t('teacher.quizSessions.analytics.sessionNumber')}{" "}{index + 1}</TabsTrigger>
        ))}
      </TabsList>
      
      {/* CONTENT - For each session, show the questions analytics */}
      {analytics.map((session) => {
        if (!session.questions?.length) {
          return (
            <TabsContent
              key={session.sessionId}
              value={`session-${session.sessionId}`}
            >
              <div className="p-6 text-muted-foreground">
                {t("teacher.quizSessions.analytics.noQuestions")}
              </div>
            </TabsContent>
          );
        }
        
        return(
          <TabsContent
            key={session.sessionId}
            value={`session-${session.sessionId}`}
            className="mt-6"
          >
            <div className="flex gap-6">
              {/* LEFT TAB - Accuracy per question */}
              <Tabs
                defaultValue={`question-${session.questions[0]?.questionId}`}
                orientation="vertical"
                className="w-full flex gap-6"
              >

                <TabsList className="
                  flex flex-col
                  h-fit
                  w-64
                ">
                  {session.questions.map((question, questionIndex) => (
                    <TabsTrigger
                      key={question.questionId}
                      value={`question-${question.questionId}`}
                      className="justify-start w-full"
                    >
                      <div className="flex justify-between w-full">
                        <span>
                          {t("teacher.quizSessions.analytics.questionNumber")}{" "}{questionIndex + 1}
                        </span>

                        <span className={`text-xs font-medium ${getAccuracyColor(question.accuracy)}`}>
                          {question.accuracy}%
                        </span>
                      </div>
                    </TabsTrigger>
                  ))}
                </TabsList>

                {/* CONTENT - For each question, show the analytics */}
                <div className="flex-1">
                  {session.questions.map((question, questionIndex) => {
                    const wrongOptions = (question.options || []).filter(option => !option.isCorrect);

                    const wrongPercentages = wrongOptions.map(option => ({
                      letter: option.letter,
                      percentage: question.totalResponses ? Math.round((option.count / question.totalResponses) * 100) : 0
                    }));

                    const maxWrong = Math.max(...wrongPercentages.map(o => o.percentage), 0);

                    const strongDistractors = wrongPercentages.filter(o => o.percentage >= 25);

                    const expected = wrongOptions.length ? 100 / wrongOptions.length : 0;

                    const isDispersed = wrongOptions.length > 1 &&  wrongOptions.every(o => Math.abs(o.percentage - expected < 10));

                    const hasMultipleStrongDistractors = strongDistractors.length >= 2;

                    const hasDominantDistractor = maxWrong >= 30 && !isDispersed && !hasMultipleStrongDistractors;

                    const data =  (question.options || []).map(option => ({
                      name: option.letter,
                      value: option.count,
                      isCorrect: option.isCorrect,
                      percentage: question.totalResponses ? Math.round((option.count / question.totalResponses) * 100) : 0
                    }));

                    let insightMessage = null;

                    if (isDispersed) {
                      insightMessage = t("teacher.quizSessions.analytics.dispersedDistractors", {
                        options: wrongOptions.map(o => o.letter).join(", "),
                        percentage: Math.round(expected)
                      });
                   } else if (hasMultipleStrongDistractors) {
                      insightMessage = t("teacher.quizSessions.analytics.multipleStrongDistractors",{
                        options: strongDistractors.map(o => o.letter).join(", "),
                        percentage: strongDistractors[0].percentage
                      })
                   } else if (hasDominantDistractor) {
                      const dominant = wrongPercentages.reduce((max, o) =>
                        o.percentage > max.percentage ? o : max,
                        wrongPercentages[0]
                      );

                      insightMessage = t("teacher.quizSessions.analytics.distractorDetected", {
                        option: dominant.letter,
                        percentage: dominant.percentage
                      });
                    }

                    return (
                      <TabsContent
                        key={question.questionId}
                        value={`question-${question.questionId}`}
                      >
                        <div className="p-6 bg-white rounded-xl border space-y-6">

                          <div>
                            <div className="text-sm text-muted-foreground">
                              {t("teacher.quizSessions.analytics.questionNumber")}{" "}{questionIndex + 1}
                            </div>

                            <h3 className="text-lg font-semibold">
                              {question.text}
                            </h3>
                          </div>

                          <BarGraphic
                            data={data}
                            dataKey="name"
                            dataValue="value"
                          />

                          {insightMessage && (
                            <div
                              className="
                                rounded-lg
                                border
                                border-yellow-200
                                bg-yellow-50
                                p-4
                                text-sm
                                text-yellow-800
                              "
                            >
                              {insightMessage}
                            </div>
                          )}
                        </div>
                      </TabsContent>
                    );
                  })}
                </div>
              </Tabs>
            </div>
          </TabsContent>
        );
      })}
    </Tabs>
  );
};

export default QuizQuestionsAnalytics;