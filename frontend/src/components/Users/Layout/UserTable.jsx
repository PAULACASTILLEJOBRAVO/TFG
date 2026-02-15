import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import UserRow from "./UserRow";
import { Spinner } from "@/components/ui/spinner";

const UserTable = ({users, onEdit, onDelete, onChangePassword, onRestore, loading, onSelect}) => {
    if(loading) return <div className="flex justify-center"><Spinner className="h-10 w-10" color="blue" /></div>;

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
                                key={user._id}
                                user={user}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onChangePassword={onChangePassword}
                                onRestore={onRestore}
                                onSelect={() => onSelect(user)}
                            />
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

export default UserTable;