import EditButton from "@/components/Common/ActionButtons/EditButton";
import DeleteButton from "@/components/Common/ActionButtons/DeleteButton";
import PasswordButton from "@/components/Users/Buttons/PasswordButton";
import RestoreButton from "../Buttons/RestoreButton";

const UserActionCell = ({ label, onEdit, onDelete, onChangePassword, onRestore, isDeleted }) => {
    return(
        <div className="flex justify-center items-center gap-2">
            {onEdit && (
                <EditButton
                    onClick={onEdit}
                    label={label}
                />
            )}

            {onChangePassword && (
                <PasswordButton
                    onClick={onChangePassword}
                />
            )}

             {isDeleted ? (
                onRestore && (
                    <RestoreButton 
                        onClick={onRestore} 
                        label="usuario"
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

export default UserActionCell;