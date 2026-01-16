import EditButton from "@/components/Common/ActionButtons/EditButton";
import DeleteButton from "@/components/Common/ActionButtons/DeleteButton";
import PasswordButton from "@/components/Users/Management/Buttons/PasswordButton";
import RestoreButton from "./Buttons/RestoreButton";

const UserActionCell = ({ label, onEdit, onDelete, onChangePassword, onRestore, isDeleted, disabled = false }) => {
    return(
        <div className="flex justify-center items-center gap-2">
            {onEdit && (
                <EditButton
                    onClick={onEdit}
                    disabled={disabled}
                    label={label}
                />
            )}

            {onChangePassword && (
                <PasswordButton
                    onClick={onChangePassword}
                    disabled={disabled}
                />
            )}

             {isDeleted ? (
                onRestore && (
                    <RestoreButton 
                        onClick={onRestore} 
                        label="usuario"
                        disabled={!disabled}
                    />
                )
            ) : (
                onDelete && (
                    <DeleteButton
                        onClick={onDelete}
                        disabled={disabled}
                        label={label}
                    />
                )
            )}
        </div>
    );
}

export default UserActionCell;