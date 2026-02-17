import { 
    EditButton, 
    DeleteButton, 
    RestoreButton
} from "@/components/Common/ActionButtons";
import { PasswordButton } from "../Buttons";

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

export default UserActionCell;