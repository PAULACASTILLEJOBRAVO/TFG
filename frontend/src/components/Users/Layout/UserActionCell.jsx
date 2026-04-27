import { 
    EditButton, 
    DeleteButton, 
    RestoreButton,
    ArchiveButton
} from "@/components/Common/ActionButtons";
import { PasswordButton } from "../Buttons";

const UserActionCell = ({ label, onEdit, onDelete, onArchive, onChangePassword, onRestore, archived }) => {
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

             {archived ? (
                onRestore && (
                    <RestoreButton 
                        onClick={onRestore} 
                        label={label}
                    />
                )
            ) : (
                onArchive && (
                    <ArchiveButton
                        onClick={onArchive}
                        label={label}
                    />
                )
            )}

            {onDelete && (
                <DeleteButton 
                    onClick={onDelete}
                    label={label}
                />
            )}
        </div>
    );
}

export default UserActionCell;