import { 
    TableRow, 
    TableCell 
} from "@/components/ui/table";
import { UserActionCell } from ".";
import { rolesType } from "@/utils/constants";
import { useTranslation } from "react-i18next";

const UserRow = ({user, onEdit, onDelete, onChangePassword, onRestore, onSelect}) => {
    const { t } = useTranslation();

    return(
        <TableRow onClick={onSelect} className={`cursor-pointer hover:bg-gray-200 ${user.status === 'inactive' ? "bg-red-50 hover:bg-red-100 text-gray-500" : ""}`}>
            <TableCell className="font-medium capitalize">{user.username}</TableCell>
            <TableCell className="hidden md:table-cell">{user.email}</TableCell>
            <TableCell className="capitalize">{t(rolesType[user.role])}</TableCell>
            <TableCell className="hidden md:table-cell">
            {
                user?.lastLogoutAt 
                    ? new Date(user.lastLogoutAt).toLocaleDateString() 
                    : user.lastLoginAt 
                        ? new Date(user.lastLoginAt).toLocaleDateString() 
                        : t("admin.usersManagement.table.neverAccessed")
            }
            </TableCell>
            <TableCell>
                <UserActionCell
                    onEdit={(event) => {
                        event.stopPropagation();
                        onEdit(user)
                    }}
                    onDelete={(event) => {
                        event.stopPropagation();
                        onDelete(user);
                    }}
                    onChangePassword={(event) => {
                        event.stopPropagation();
                        onChangePassword(user)
                    }}
                    onRestore={(event) => {
                        event.stopPropagation();
                        onRestore(user)
                    }}
                    label={t("admin.usersManagement.labelButton")}
                    deleted={user.status === 'inactive'}
                />
            </TableCell>
        </TableRow>
    );
}

export default UserRow;