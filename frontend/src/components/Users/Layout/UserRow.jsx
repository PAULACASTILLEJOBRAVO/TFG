import { 
    TableRow, 
    TableCell 
} from "@/components/ui/table";
import {
    UserActionCell, 
    UserStatusChip
} from ".";
import { rolesType } from "@/utils/constants";

const UserRow = ({user, onEdit, onDelete, onChangePassword, onRestore, onSelect}) => {
    return(
        <TableRow onClick={onSelect} className={`cursor-pointer hover:bg-muted ${user.isDeleted ? "bg-red-50 hover:bg-red-100 text-gray-500" : ""}`}>
            <TableCell className="font-medium capitalize">{user.username}</TableCell>
            <TableCell className="hidden md:table-cell">{user.email}</TableCell>
            <TableCell className="capitalize">{rolesType[user.role]}</TableCell>
            <TableCell className="hidden md:table-cell">
                <UserStatusChip 
                    isActive={user.isActive}
                    isDelete={user.isDelete}
                />
            </TableCell>
            <TableCell className="hidden md:table-cell">{
                user?.lastLogoutAt 
                    ? new Date(user.lastLogoutAt).toLocaleDateString() 
                    : user.lastLoginAt 
                        ? new Date(user.lastLoginAt).toLocaleDateString() 
                        : "Nunca"
            }</TableCell>
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
                    label="usuario"
                    isDeleted={user.isDeleted}
                />
            </TableCell>
        </TableRow>
    );
}

export default UserRow;