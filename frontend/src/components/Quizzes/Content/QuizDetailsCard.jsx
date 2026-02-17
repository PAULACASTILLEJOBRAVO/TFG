import { QuizStatusChip } from ".";
import { QuizActionCell } from "../Layout";

const QuizDetailsCard = ({ quiz, onEdit, onDelete, onRestore, onPublish, onStartSession }) => {
    if (!quiz) return null;

    const emptyPlayer = () => {
        return quiz.playerIds.length === 0;
    }

    return (
        <div className="border rounded-xl p-5 shadow-sm hover:shadow-md transition-all bg-white">
            <div className="flex items-center justify-between mb-3">
                <div className="text-lg font-semibold">{quiz.title}</div>

               <QuizStatusChip status={quiz.status}/>
            </div>

            <div className="text-sm text-gray-600 mb-3">
                <div>{quiz.questionIds.length} preguntas · {quiz.playerIds.length} jugadores</div>
            </div>

            <div className="flex justify-between items-center text-xs text-gray-500">
                
                <span>Última edición: {quiz.lastUpdateAt ? new Date(quiz.lastUpdatedAt).toLocaleDateString() : new Date(quiz.createdAt).toLocaleDateString()}</span>
            </div>

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
        </div>
    );
};

export default QuizDetailsCard;