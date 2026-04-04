import { DashboardSubtitle } from "@/components/Dashboard/Layout/Content";
import { 
    DashboardContent, 
    DashboardLayout 
} from "@/components/Dashboard/Layout/";
import { useNavigate } from "react-router-dom";
import { useQuizzesForStudent } from "@/hooks/Quizzes/useQuizzesForStudent";
import { QuizDetailsCard } from "@/components/Quizzes/Content/";
import { Fragment } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { 
    matchesDifficulty, 
    matchesStatus, 
    normalizeWord 
} from "@/utils/search";

const QuizzesHistory = () => {
    const { quizzesForStudent, loading } = useQuizzesForStudent();
    console.log("Quizzes for student:", quizzesForStudent);

    const quizzesMap = new Map();

    quizzesForStudent.forEach(session => {
        const quizId = session.quiz._id;
        if (!quizzesMap.has(quizId)) {
            // Save the quiz and an array of associated sessions
            quizzesMap.set(quizId, {
            ...session.quiz,
            sessions: [session]  // Group by quiz, so we can show all sessions for the same quiz together
            });
        } else {
            // If the quiz already exists, we just push the session to the existing quiz's sessions array
            quizzesMap.get(quizId).sessions.push(session);
        }
    });

    // Final array of quizzes without duplicates
    const quizzesUnique = Array.from(quizzesMap.values());

    // NAVIGATION
    const navigate = useNavigate();

    // SEARCH
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search).get("search") || "";

    const words = searchParams.toLowerCase().split(" ").filter(word => word.trim() !== "");;
    const normalizedWords = words.map(normalizeWord);

    const filteredQuizzes = quizzesUnique.filter(q => {
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
                    <DashboardSubtitle label={t("teacher.quizzesManagement.title")} />
                </div>

                <div className="mb-4">
                    {loading ? (
                        <div className="flex justify-center">
                            <Spinner className="h-10 w-10" color="blue" />
                        </div>
                    ) : filteredQuizzes.length === 0 && (
                        <p className="text-gray-500">{t("teacher.quizzesManagement.detailsCard.noQuizzes")}</p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredQuizzes.map((quiz, index) => {
                            const prevStatus = filteredQuizzes[index - 1]?.difficulty;
                            const showDivider = index === 0 || prevStatus !== quiz.difficulty;

                            return (
                                <Fragment key={quiz._id}>
                                    {showDivider && (
                                        <div className="col-span-full flex items-center gap-2 my-2">
                                            <div className="flex-1 h-px bg-gray-300"></div>
                                            <span className="text-sm font-medium text-gray-500 capitalize">
                                            {t("teacher.quizzesManagement.detailsCard.difficulty." + quiz.difficulty)}
                                            </span>
                                            <div className="flex-1 h-px bg-gray-300"></div>
                                        </div>
                                    )}

                                    <QuizDetailsCard 
                                        key={quiz._id} 
                                        quiz={quiz} 
                                        isStudent={true}
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