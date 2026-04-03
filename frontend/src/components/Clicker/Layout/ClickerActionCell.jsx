import { 
    EditButton, 
    DeleteButton, 
    RestoreButton,
    SaveButton,
    CancelButton
} from "@/components/Common/ActionButtons";

const ClickerActionCell = ({ label, status, isEditing, onEdit, onDelete, onRestore, onSaveEdit, onCancelEdit }) => {
    if(isEditing) {
        return(
            <div className="flex justify-center items-center gap-2">
                <SaveButton
                    onClick={onSaveEdit}
                />
                <CancelButton
                    onClick={onCancelEdit}
                />
            </div>
        );
    }

    return(
        <div className="flex justify-center items-center gap-2">
            {onEdit && (
                <EditButton
                    onClick={onEdit}
                    label={label}
                />
            )}

            {status === "damaged" || status === "retired" ? (
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

export default ClickerActionCell;