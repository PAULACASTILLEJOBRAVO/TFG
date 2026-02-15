import EditButton from "@/components/Common/ActionButtons/EditButton";
import DeleteButton from "@/components/Common/ActionButtons/DeleteButton";
import RestoreButton from "@/components/Common/ActionButtons/RestoreButton";
import StartSessionButton from "../Buttons/StartSessionButton";
import PublishButton from "../Buttons/PublishButton";

const QuizActionCell = ({ label, onEdit, onDelete, onRestore, onPublish, onStartSession, isDeleted, isPublished }) => {
    return(
        <div className="flex justify-center items-center gap-2">
            {onEdit && (
                <EditButton
                    onClick={onEdit}
                    label={label}
                />
            )}

            {isPublished === "published" && onStartSession && (
                <StartSessionButton
                    onClick={onStartSession}
                    label={label}
                />
            )}


            {isPublished === "draft" && onPublish && (
                <PublishButton
                    onClick={onPublish}
                    label={label}
                />
            )}

             {isDeleted ? (
                onRestore && (
                    <RestoreButton 
                        onClick={onRestore} 
                        label={label}
                    />
                )
            ) : (
                onDelete && (
                    <DeleteButton
                        onClick={onDelete}
                        label={label}
                    />
                )
            )}
        </div>
    );
}

export default QuizActionCell;