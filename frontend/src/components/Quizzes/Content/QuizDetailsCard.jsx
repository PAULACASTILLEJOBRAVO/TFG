import { Clock } from "lucide-react";
import { QuizDifficultyChip, QuizStatusChip } from ".";
import { QuizActionCell } from "../Layout";
import { useTranslation } from "react-i18next";

const QuizDetailsCard = ({ quiz, isStudent = false, onEdit, onDelete, onRestore, onPublish, onStartSession }) => {
    if (!quiz) return null;

    const { t } = useTranslation();

    const emptyPlayer = () => {
        return quiz.playerIds.length === 0;
    }

    const sessions = quiz.sessions || [];

    const totalAttempts = sessions.length;

    const totalTime = sessions.reduce(
        (acc, s) => acc + (s.totalTime || 0),
        0
    );
    const averageTime = totalAttempts > 0 ? totalTime / totalAttempts : 0;
    const averageTotalSeconds = Math.floor(averageTime / 1000);
    const averageHours = Math.floor(averageTotalSeconds / 3600);
    const averageMinutes = Math.floor((averageTotalSeconds % 3600) / 60);
    const averageSeconds = averageTotalSeconds % 60;

    const totalSeconds = Math.floor(totalTime / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const lastSession = sessions
        .filter(s => s.endTime)
        .reduce((latest, s) => {
            if (!latest) return s;
            return new Date(s.endTime) > new Date(latest.endTime) ? s : latest;
        }, null);

    return (
        <div className="border rounded-xl p-5 shadow-sm hover:shadow-md transition-all bg-white">
            <div className="flex items-center justify-between mb-3">
                <div className="text-lg font-semibold">{quiz.title}</div>

               {!isStudent && <QuizStatusChip status={quiz.status}/>}
               {isStudent && (
                    <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
                        <div className="flex items-center gap-1 text-md font-medium text-gray-700">
                            <Clock className="w-3 h-5" />
                            {totalTime 
                                ? `${hours > 0 
                                    ? `${hours.toString().padStart(2,"0")}:` 
                                    : ""}${minutes.toString().padStart(2,"0")}:${seconds.toString().padStart(2,"0")} total ` 
                                : `-`
                            }
                             · 
                            {averageTime > 0 
                                ? `${averageHours > 0 
                                    ? `${averageHours.toString().padStart(2,"0")}:` 
                                    : ""}  ${averageMinutes.toString().padStart(2,"0")}:${averageSeconds.toString().padStart(2,"0")} ${t("teacher.quizzesManagement.detailsCard.average")}` 
                                : `-`
                            }
                        </div>
                    </div>
                )}
            </div>
            
            <div className="text-sm text-gray-600 mb-3">
                <div>
                    {quiz.questionIds.length} {t("teacher.quizzesManagement.detailsCard.questions")} 
                    {!isStudent && (` · ${quiz.playerIds.length} ${t("teacher.quizzesManagement.detailsCard.players")}`)}
                    {isStudent && (` · ${totalAttempts} ${t("teacher.quizzesManagement.detailsCard.sessions")}`)}
                </div>
            </div>
            
            <div className="flex justify-between items-center text-xs text-gray-500">
                {!isStudent && (<span className="truncate">{t("teacher.quizzesManagement.detailsCard.lastUpdated")}: {quiz.updatedAt ? new Date(quiz.updatedAt).toLocaleDateString() : new Date(quiz.createdAt).toLocaleDateString()}</span>)}
                
                {isStudent && (
                    <>
                        <span>
                            {t("teacher.quizzesManagement.detailsCard.lastAttempt")}:  
                            {lastSession?.endTime 
                                ? new Date(lastSession.endTime).toLocaleDateString() 
                                : "-"}
                        </span>
                        <QuizDifficultyChip difficulty={quiz.difficulty}/>
                    </>
                )}
            </div>

            {!isStudent && (
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
                    isDeleted={quiz.isDeleted}
                    isPublished={!emptyPlayer() && quiz.status}
                />
            )}
        </div>
    );
};

export default QuizDetailsCard;