import { 
    Table, 
    TableHeader, 
    TableHead, 
    TableBody, 
    TableRow, 
    TableCell 
} from "@/components/ui/table";
import { UserRow } from ".";
import { Spinner } from "@/components/ui/spinner";
import { useTranslation } from "react-i18next";

const UserTable = ({users, onEdit, onDelete, onChangePassword, onRestore, loading, onSelect}) => {
    if (loading) return <div className="flex justify-center"><Spinner className="h-10 w-10" color="blue" /></div>;

    const { t } = useTranslation();

    return(
        <div className="w-full rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>{t("admin.usersManagement.table.name")}</TableHead>
                        <TableHead className="hidden md:table-cell">{t("admin.usersManagement.table.email")}</TableHead>
                        <TableHead>{t("admin.usersManagement.table.role")}</TableHead>
                        <TableHead className="hidden md:table-cell">{t("admin.usersManagement.table.status")}</TableHead>
                        <TableHead className="hidden md:table-cell">{t("admin.usersManagement.table.lastAccess")}</TableHead>
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
                                {t("admin.usersManagement.table.noUsers")}
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