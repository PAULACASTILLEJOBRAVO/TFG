import { AppBreadcrumb } from "@/components/Common";
import { BackButton } from "@/components/Common/ActionButtons";
import { 
    DashboardContent, 
    DashboardLayout 
} from "@/components/Dashboard/Layout";
import { DashboardSubtitle } from "@/components/Dashboard/Layout/Content";
import SessionDetailsAccordion from "@/components/Sessions/Content/SessionHistory/SessionDetailsAccordion";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { useQuizForStudent } from "@/hooks/Quizzes/useQuizForStudent";
import { 
    CircleStar, 
    Goal, 
    Zap
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { 
    useLocation, 
    useParams 
} from "react-router-dom";
import { formatTime } from "@/utils/sessions";
import { useAuth } from "@/auth/AuthContext";

const SessionHistory = () => {
    const { t } = useTranslation();
    const { id, studentId } = useParams();
    const { user } = useAuth();

    // Quizz data
    const {quizForStudent, loading} = useQuizForStudent(id, studentId);
    const location = useLocation();
    const quizFromState = location.state?.quiz;
    const finalQuiz = quizFromState || quizForStudent;

    // Session data
    const sessions = finalQuiz?.sessions?.slice().sort((a, b) => new Date(b.startTime) - new Date(a.startTime)) || [];
    const validSessions = sessions.filter(s => s.totalTime);

    // Stats
    const averageTime = validSessions.length
        ? validSessions.reduce((acc, s) => acc + s.totalTime, 0) / validSessions.length
        : 0;

    const bestTime = validSessions.length
        ? Math.min(...validSessions.map(s => s.totalTime))
        : 0;

    const totalAttempts = sessions.length;

    // Show best time only if there are at least 2 valid sessions to compare
    const showBest = validSessions.length > 1;

    return (
        <DashboardLayout>
            <DashboardContent>
                <AppBreadcrumb />
                
                <Separator />

                <div className="grid grid-cols-[1fr_8fr] items-center pb-2">
                    {/** Left */}
                    <div className="pr-6 md:pr-16">
                        <BackButton href={`/dashboard_${user.role}/quizzes`} label={t("common.sessionHistory.backToQuizzes")} />
                    </div>             

                    {/** Center */}
                    <div className="text-center">
                        <DashboardSubtitle label={t("common.sessionHistory.my-title", { quizTitle: finalQuiz?.title || "" })} />
                    </div>
                </div>

                {loading || !finalQuiz ? (
                    <div className="flex justify-center">
                        <Spinner className="h-10 w-10" color="blue" />
                    </div>
                ) : !sessions || sessions.length === 0 ? (
                    <p className="text-gray-500">{t("common.sessionHistory.noSessions")}</p>
                ) : (
                    <div className="space-y-4">
                        <div className="flex justify-end gap-6 text-sm text-gray-500 border-b pb-2">
                            <div className="flex items-center gap-2">
                                <Zap className="h-4 w-4 text-amber-400 shrink-0" /> {t("common.sessionHistory.averageTime")}{" "}
                                <span className="font-semibold text-gray-600">
                                    {averageTime ? formatTime(averageTime) : "-"}
                                </span>
                            </div>

                            {showBest && (
                                <div className="flex items-center gap-2">
                                    <CircleStar className="h-4 w-4 text-yellow-500 shrink-0" /> {t("common.sessionHistory.bestTime")}{" "}
                                    <span className="font-semibold text-gray-600">
                                        {bestTime ? formatTime(bestTime) : "-"}
                                    </span>
                                </div>
                            )}

                            <div className="flex items-center gap-2">
                                <Goal className="h-4 w-4 text-green-500 shrink-0" /> {t("common.sessionHistory.attempts")}{" "}
                                <span className="font-semibold text-gray-600">
                                    {totalAttempts}
                                </span>
                            </div>
                        </div>

                        <SessionDetailsAccordion sessions={sessions} quiz={finalQuiz} />
                    </div>
                )}

            </DashboardContent>
        </DashboardLayout>
    )
}

export default SessionHistory;