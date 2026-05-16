import { 
    EditButton, 
    RestoreButton, 
    ArchiveButton
} from "@/components/Common/ActionButtons";
import { 
    StartSessionButton, 
    PublishButton 
} from "../Buttons";

const QuizActionCell = ({ label, onEdit, onDelete, onRestore, onPublish, onStartSession, deleted, isPublished }) => {
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

             {deleted ? (
                onRestore && (
                    <RestoreButton 
                        onClick={onRestore} 
                        label={label}
                    />
                )
            ) : (
                onDelete && (
                    <ArchiveButton
                        onClick={onDelete}
                        label={label}
                    />
                )
            )}
        </div>
    );
}

export default QuizActionCell;