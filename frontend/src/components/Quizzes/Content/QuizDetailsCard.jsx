import { Info } from "lucide-react";
import { 
    QuizDifficultyChip, 
    QuizStatusChip 
} from ".";
import { QuizActionCell } from "../Layout";
import { useTranslation } from "react-i18next";
import { 
    useState,
    useRef 
} from "react";

const QuizDetailsCard = ({ quiz, isStudent = false, forceClickable = false, onClick, onEdit, onDelete, onRestore, onPublish, onStartSession }) => {
    if (!quiz) return null;

    const { t } = useTranslation();

    const [hovered, setHovered] = useState(false);
    const timeoutRef = useRef(null);

    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setHovered(true);
    };

    const handleMouseLeave = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
            setHovered(false);
        }, 300); 
    };

    // Quiz from student perspective includes sessions data.
    const sessions = quiz?.sessions || []; // For student view, quiz data might not include sessionsCount, so we rely on sessions array directly

    const totalQuestions = sessions.map(session => session.results?.totalQuestions).find(question => question != null) || 0;

    const totalAttempts = sessions.length;

    const lastSession = sessions
        .filter(s => s.endTime)
        .reduce((latest, s) => {
            if (!latest) return s;
            return new Date(s.endTime) > new Date(latest.endTime) ? s : latest;
        }, null);

    const hasStudentSessions = sessions.length > 0;

    // Quiz form teacher perspective includes only sessionsCount, so we can directly use it without needing to check for sessions array.
    const hasTeacherSessions = quiz.sessionsCount > 0;

    const isClickable = forceClickable || (!isStudent ? (hasTeacherSessions) : hasStudentSessions);

    const emptyPlayer = () => {
        if(!isStudent) return quiz?.playerIds.length === 0;
    }

    // For both, student and teacher view, we want to show the number of sessions/attempts.
    const sessionsCount = isStudent ? totalAttempts : quiz.sessionsCount || 0;

    return (
        <div 
            className={`border rounded-xl p-5 transition-all bg-white 
                ${isClickable
                    ? "hover:bg-muted hover:shadow-md cursor-pointer" 
                    : "cursor-not-allowed"}
            `}
            onClick={isClickable ? () => onClick(quiz) : undefined}
            onPointerEnter={handleMouseEnter}
            onPointerLeave={handleMouseLeave}
        >
            <div className="flex items-center justify-between mb-3 gap-2">
                <div className="text-lg font-semibold">{quiz.title}</div>

               {!isStudent && <QuizStatusChip status={quiz.status}/>}
               {isStudent && <QuizDifficultyChip difficulty={quiz.difficulty}/>}
            </div>
            
            <div className="text-sm text-gray-600 mb-4">
                <div>
                    {totalQuestions || quiz?.questionIds.length}{" "}
                    {t("teacher.quizzesManagement.detailsCard.questions")} 

                    {!isStudent && (
                        <> · {quiz?.playerIds.length} {t("teacher.quizzesManagement.detailsCard.players")}</>
                    )}

                    {sessionsCount > 0 && (
                        <> · {sessionsCount} {t("teacher.quizzesManagement.detailsCard.sessions")}</>
                    )}
                </div>
            </div>
            
            <div className="flex justify-between items-center text-xs text-gray-500">
                {!isStudent && (<span className="truncate">{t("teacher.quizzesManagement.detailsCard.lastUpdated")}: {quiz?.updatedAt ? new Date(quiz?.updatedAt).toLocaleDateString() : new Date(quiz?.createdAt).toLocaleDateString()}</span>)}
                
                {isStudent && (
                    <span>
                        {t("teacher.quizzesManagement.detailsCard.lastAttempt")}: {lastSession?.endTime ? new Date(lastSession.endTime).toLocaleDateString() : "-"}
                    </span>
                )}
            </div>

            {!isStudent && !hasTeacherSessions && (
                <div className={`text-xs text-blue-500/80 mt-2 flex items-center gap-1 transition-all duration-200
                        ${hovered
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-1 pointer-events-none"
                        }
                    `}
                >
                    <Info className="h-3 w-3 shrink-0" />
                    <span className="leading-none">
                        {t("common.quizzesManagement.detailsCard.noSessions")}
                    </span>
                </div>
            )}

            {!isStudent && onDelete && onEdit && onPublish && onRestore && (
                <QuizActionCell
                    onEdit={(event) => {
                        event.stopPropagation();
                        onEdit(quiz)
                    }}
                    onDelete={(event) => {
                        event.stopPropagation();
                        onDelete(quiz);
                    }}
                    onRestore={(event) => {
                        event.stopPropagation();
                        onRestore(quiz);
                    }}
                    onPublish={(event) => {
                        event.stopPropagation();
                        onPublish(quiz);
                    }}
                    onStartSession={(event) => {
                        event.stopPropagation();
                        onStartSession(quiz);
                    }}
                    label="quiz"
                    deleted={quiz.status === 'archived'}
                    isPublished={!emptyPlayer() && quiz.status}
                />
            )}
        </div>
    );
};

export default QuizDetailsCard;