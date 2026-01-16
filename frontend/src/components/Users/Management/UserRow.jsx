import { TableRow, TableCell } from "@/components/ui/table";
import UserActionCell from "./UserActionCell";
import UserStatusChip from "./UserStatusChip";

const UserRow = ({user, onEdit, onDelete, onChangePassword, onRestore}) => {
    return(
        <TableRow key={user._id}>
            <TableCell className="font-medium">{user.username}</TableCell>
            <TableCell className="hidden md:table-cell">{user.email}</TableCell>
            <TableCell className="capitalize">{user.role}</TableCell>
            <TableCell>
                <UserStatusChip 
                    isActive={user.isActive}
                    isDelete={user.isDelete}
                />
            </TableCell>
            <TableCell className="hidden md:table-cell">{user.lastLogoutAt ? new Date(user.lastLogoutAt).toLocaleDateString() : "Nunca"}</TableCell>
            <TableCell>
                <UserActionCell
                    onEdit={() => onEdit(user)}
                    onDelete={() => onDelete(user)}
                    onChangePassword={() => onChangePassword(user)}
                    onRestore={() => onRestore(user)}
                    label="usuario"
                    disabled={!user.isActive ? true : false}
                    isDeleted={user.isDeleted}
                />
            </TableCell>
        </TableRow>
    );
}

export default UserRow;