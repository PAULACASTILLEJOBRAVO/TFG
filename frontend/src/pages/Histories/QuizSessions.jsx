import { AppBreadcrumb } from "@/components/Common";
import { BackButton } from "@/components/Common/ActionButtons";
import { 
  DashboardContent, 
  DashboardLayout 
} from "@/components/Dashboard/Layout";
import { DashboardSubtitle } from "@/components/Dashboard/Layout/Content";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { useTranslation } from "react-i18next";
import { 
  useLocation, 
  useParams 
} from "react-router-dom";
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
import { useQuizSessionsAnalytics } from "@/hooks/Quizzes/useQuizSessionsAnalytics";
import { 
  useEffect, 
  useState 
} from "react";
import { normalizeWord } from "@/utils/search";

const QuizSessions = () => {
  const { t } = useTranslation();

  const { id } = useParams();

  const { quizSessionsForTeacher, loading } = useQuizSessionsForTeacher(id);
  const { analytics } = useQuizSessionsAnalytics(id);

  const quiz = quizSessionsForTeacher?.quiz;
  const students = quizSessionsForTeacher?.students || [];
  const stats = quizSessionsForTeacher?.stats || {};
  const sessions = quizSessionsForTeacher?.sessions || [];

  // NAVIGATION
  const navigate = useNavigate();

  const handleViewSessionsForStudent = (student) => {
    navigate(`/dashboard_teacher/quizzes/${id}/students/${student._id}/history`);
  };

   // Search for students in the sessions of the quiz
    const location = useLocation();
    const params = new URLSearchParams(location.search);

    const searchParams = params.get("search") || "";
    const pageParam = parseInt(params.get("page")) || 1;
    const limitParam = parseInt(params.get("limit")) || 5;

    const words = searchParams.toLowerCase().split(" ").filter(word => word.trim() !== "");;
    const normalizedWords = words.map(normalizeWord);

    const filteredStudents = students.filter(s => {
        const name = s.name?.toLowerCase() || "";
        const email = s.email?.toLowerCase() || "";
        const accuracy = s.accuracy !== undefined ? `${s.accuracy}%` : "";

        return normalizedWords.every(word =>
            name.includes(word) ||
            email.includes(word) ||
            accuracy.includes(word)
        );
    });

    // Pagination for students in the sessions of the quiz
    const [currentPage, setCurrentPage] = useState(pageParam);
    const [rowsPerPage, setRowsPerPage] = useState(limitParam);

    const indexOfLastUser = currentPage * rowsPerPage;
    const indexOfFirstUser = indexOfLastUser - rowsPerPage;

    const currentStudents = filteredStudents.slice(indexOfFirstUser, indexOfLastUser);

    const totalPages = Math.ceil(filteredStudents.length / rowsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchParams]);

    useEffect(() => {
        const params = new URLSearchParams();

        if (searchParams) params.set("search", searchParams);
        params.set("page", currentPage);
        params.set("limit", rowsPerPage);

        navigate(`?${params.toString()}`, { replace: true });
    }, [currentPage, rowsPerPage, searchParams]);


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

                      <QuizQuestionsAnalytics analytics={analytics} />
                    </TabsContent>

                    {/** TAB 2 -  Students list */}
                    <TabsContent value="students">
                        <StudentsQuizTable 
                          students={currentStudents}  
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={setCurrentPage}
                          rowsPerPage={rowsPerPage}
                          onRowsPerPageChange={setRowsPerPage}
                          loading={loading} 
                          onSelect={handleViewSessionsForStudent} 
                        />
                    </TabsContent>
                  </Tabs>
                )}
            </DashboardContent>
        </DashboardLayout>
    </div>
  );
};

export default QuizSessions;