import { DashboardSubtitle } from "@/components/Dashboard/Layout/Content";
import { 
    DashboardContent, 
    DashboardLayout 
} from "@/components/Dashboard/Layout/";
import { useNavigate } from "react-router-dom";
import { useQuizzesForStudent } from "@/hooks/Quizzes/useQuizzesForStudent";
import { QuizDetailsCard } from "@/components/Quizzes/Content/";
import { 
    Fragment,
    useMemo
 } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { 
    matchesDifficulty, 
    matchesStatus, 
    normalizeWord 
} from "@/utils/search";

const QuizzesHistory = () => {
    const { quizzesForStudent, loading } = useQuizzesForStudent({ limit: 0 });

    // Sort quizzes by difficulty (easy, medium, hard)
    const sortedQuizzes = useMemo(() => {
        const order = { easy: 1, medium: 2, hard: 3 };
        return [...quizzesForStudent].sort((a, b) => order[a.difficulty] - order[b.difficulty]);
    }, [quizzesForStudent]);

    // NAVIGATION
    const navigate = useNavigate();

    // SEARCH
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search).get("search") || "";

    const words = searchParams.toLowerCase().split(" ").filter(word => word.trim() !== "");;
    const normalizedWords = words.map(normalizeWord);

    const filteredQuizzes = sortedQuizzes.filter(q => {
        const title = q.title?.toLowerCase() || "";

        return normalizedWords.every(word =>
            title.includes(word) ||
            matchesStatus(q.status, word) ||
            matchesDifficulty(q.difficulty, word)
        );
    });

    // TRANSLATION
    const { t } = useTranslation();

    return (
        <DashboardLayout>
            <DashboardContent>
                <div className="flex items-center mb-4 justify-between">
                    <DashboardSubtitle label={t("common.quizzesManagement.title")} />
                </div>

                <div className="mb-4">
                    {loading ? (
                        <div className="flex justify-center">
                            <Spinner className="h-10 w-10" color="blue" />
                        </div>
                    ) : filteredQuizzes.length === 0 && (
                        <p className="text-gray-500">{t("common.quizzesManagement.detailsCard.noQuizzes")}</p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredQuizzes.map((quiz, index) => {
                            const prevStatus = filteredQuizzes[index - 1]?.difficulty;
                            const showDivider = index === 0 || prevStatus !== quiz.difficulty;

                            return (
                                <Fragment key={quiz._id}>
                                    {showDivider && (
                                        <div className="col-span-full flex items-center gap-2 my-2">
                                            <div className="flex-1 h-px bg-gray-300" />
                                                <span className="text-sm font-medium text-gray-500 capitalize">
                                                    {t("common.quizzesManagement.detailsCard.difficulty." + quiz.difficulty)}
                                                </span>
                                            <div className="flex-1 h-px bg-gray-300" />
                                        </div>
                                    )}

                                    <QuizDetailsCard 
                                        key={quiz._id} 
                                        quiz={quiz} 
                                        isStudent={true}
                                        onClick={() => navigate(`/dashboard_student/quizzes/${quiz._id}/history`, { state: { quiz } })}
                                    />
                                </Fragment>
                            )
                        })}
                    </div>                  
                </div>
            </DashboardContent>
        </DashboardLayout>
    );
}

export default QuizzesHistory;