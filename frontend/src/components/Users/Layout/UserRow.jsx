import { TableRow, TableCell } from "@/components/ui/table";
import UserActionCell from "./UserActionCell";
import UserStatusChip from "./UserStatusChip";

const rolesType = {
  student: "Estudiante",
  teacher: "Profesor",
  admin: "Administrador"
};

const UserRow = ({user, onEdit, onDelete, onChangePassword, onRestore, onSelect}) => {
    return(
        <TableRow onClick={onSelect} className="cursor-pointer hover:bg-muted">
            <TableCell className="font-medium capitalize">{user.username}</TableCell>
            <TableCell className="hidden md:table-cell">{user.email}</TableCell>
            <TableCell className="capitalize">{rolesType[user.role]}</TableCell>
            <TableCell>
                <UserStatusChip 
                    isActive={user.isActive}
                    isDelete={user.isDelete}
                />
            </TableCell>
            <TableCell className="hidden md:table-cell">{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : "Nunca"}</TableCell>
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