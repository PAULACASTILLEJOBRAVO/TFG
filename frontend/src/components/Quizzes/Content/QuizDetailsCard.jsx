import { 
    QuizDifficultyChip, 
    QuizStatusChip 
} from ".";
import { QuizActionCell } from "../Layout";
import { useTranslation } from "react-i18next";

const QuizDetailsCard = ({ quiz, isStudent = false, onClick, onEdit, onDelete, onRestore, onPublish, onStartSession }) => {
    if (!quiz) return null;

    const { t } = useTranslation();

    const emptyPlayer = () => {
        if(!isStudent) return quiz?.playerIds.length === 0;
    }

    const sessions = quiz?.sessions || [];

    const totalQuestions = sessions.map(session => session.results?.totalQuestions).find(question => question != null) || 0;

    const totalAttempts = sessions.length;

    const lastSession = sessions
        .filter(s => s.endTime)
        .reduce((latest, s) => {
            if (!latest) return s;
            return new Date(s.endTime) > new Date(latest.endTime) ? s : latest;
        }, null);

    return (
        <div 
            className="border rounded-xl p-5 shadow-sm hover:bg-muted hover:shadow-md cursor-pointer transition-all bg-white"
            onClick={onClick}
        >
            <div className="flex items-center justify-between mb-3">
                <div className="text-lg font-semibold">{quiz.title}</div>

               {!isStudent && <QuizStatusChip status={quiz.status}/>}
               {isStudent && (<QuizDifficultyChip difficulty={quiz.difficulty}/>)}
            </div>
            
            <div className="text-sm text-gray-600 mb-3">
                <div>
                    {totalQuestions || quiz?.questionIds.length} {t("teacher.quizzesManagement.detailsCard.questions")} 
                    {!isStudent && (` · ${quiz?.playerIds.length} ${t("teacher.quizzesManagement.detailsCard.players")}`)}
                    {isStudent && (` · ${totalAttempts} ${t("teacher.quizzesManagement.detailsCard.sessions")}`)}
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
                    deleted={quiz.status === 'archived'}
                    isPublished={!emptyPlayer() && quiz.status}
                />
            )}
        </div>
    );
};

export default QuizDetailsCard;