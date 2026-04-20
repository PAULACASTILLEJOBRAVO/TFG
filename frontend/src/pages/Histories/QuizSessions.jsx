import { AppBreadcrumb } from "@/components/Common";
import { BackButton } from "@/components/Common/ActionButtons";
import { 
  DashboardContent, 
  DashboardLayout 
} from "@/components/Dashboard/Layout";
import { DashboardSubtitle } from "@/components/Dashboard/Layout/Content";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { useQuizSessionsForTeacher } from "@/hooks/Quizzes/useQuizSessionsForTeacher";
import { Spinner } from "@/components/ui/spinner";
import { StudentsQuizTable } from "@/components/Users/Layout/Students";
import { useNavigate } from "react-router-dom";
import { 
  QuizSessionsCards, 
  QuizSessionsGraphics,
  QuizQuestionsAnalytics
} from "@/components/Quizzes/Layout/QuizSessions";
import { useQuizQuestionsAnalytics } from "@/hooks/Quizzes/useQuizQuestionsAnalytics";

const QuizSessions = () => {
  const { t } = useTranslation();

  const { id } = useParams();

  const { quizSessionsForTeacher, loading } = useQuizSessionsForTeacher(id);
  const { analytics } = useQuizQuestionsAnalytics(id);

  const quiz = quizSessionsForTeacher?.quiz;
  const students = quizSessionsForTeacher?.students || [];
  const stats = quizSessionsForTeacher?.stats || {};
  const sessions = quizSessionsForTeacher?.sessions || [];

  // NAVIGATION
  const navigate = useNavigate();

  const handleViewSessionsForStudent = (student) => {
    navigate(`/dashboard_teacher/quizzes/${id}/students/${student._id}/history`);
  };

  return (
    <div>
        <DashboardLayout>
            <DashboardContent>
            
                <AppBreadcrumb />
                
                <Separator />

                <div className="grid grid-cols-[1fr_8fr] items-center pb-2">
                    {/** Left */}
                    <div className="pr-6 md:pr-16">
                        <BackButton href="/dashboard_teacher/quizzes" label={t("common.sessionHistory.backToQuizzes")} />
                    </div>             

                    {/** Center */}
                    <div className="text-center">
                        <DashboardSubtitle label={t("common.sessionHistory.title", { quizTitle: quiz?.title || "" })} />
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center">
                        <Spinner className="h-10 w-10" color="blue" />
                    </div>
                ) : ( 
                  /** Tabs */
                  <Tabs defaultValue="analytics" className="w-full">
                    <TabsList className="w-full flex">
                      <TabsTrigger value="analytics" className="flex-1">{t("teacher.quizSessions.tab.analytics")}</TabsTrigger>
                      <TabsTrigger value="students" className="flex-1">{t("teacher.quizSessions.tab.students")}</TabsTrigger>
                    </TabsList>

                    {/** TAB 1 -  Analytics */}
                    <TabsContent value="analytics">
                      <QuizSessionsCards stats={stats} />

                      {stats.sessions > 1 && (
                        <QuizSessionsGraphics
                          data={sessions} 
                          lines={[
                            { dataKey: "accuracy", color: "#3b82f6" },
                            { dataKey: "avgTime", color: "#f59e0b" }
                          ]}  
                          xKey="label"
                        />
                      )}
                      {/* 
                        <SingleSessionInsight session={sessions[0]} stats={stats} />
                      */}
                      {analytics.map((question, index) => (
                        <QuizQuestionsAnalytics key={index} question={question} />
                      ))}

                    </TabsContent>

                    {/** TAB 2 -  Students list */}
                    <TabsContent value="students">
                        <StudentsQuizTable students={students} loading={loading} onSelect={handleViewSessionsForStudent} />
                    </TabsContent>
                  </Tabs>
                )}
            </DashboardContent>
        </DashboardLayout>
    </div>
  );
};

export default QuizSessions;