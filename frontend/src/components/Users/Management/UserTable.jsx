import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import UserRow from "./UserRow";
import { Button } from "@/components/ui/button";

const UserTable = ({users, onEdit, onDelete, onChangePassword, onRestore, loading, onSelect}) => {
    return(
        <div className="w-full rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead className="hidden md:table-cell">Email</TableHead>
                        <TableHead>Rol</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="hidden md:table-cell">Último acceso</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                    
                </TableHeader>

                <TableBody>
                    {users.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={6}
                                className="text-center py-6 text-muted-foreground"
                            >
                                No hay usuarios registrados.
                            </TableCell>
                        </TableRow>
                    ) : (
                        users.map(user => (
                            <UserRow
                                user={user}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onChangePassword={onChangePassword}
                                onRestore={onRestore}
                            />
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

export default UserTable;