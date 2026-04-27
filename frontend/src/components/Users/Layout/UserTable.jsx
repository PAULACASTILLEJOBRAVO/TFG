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
import { TablePaginationFooter } from "@/components/Common";
import { icons } from "@/utils/constants";

const UserTable = ({users, currentPage, totalPages, onPageChange, rowsPerPage, onRowsPerPageChange, sortConfig, onSort, onEdit, onDelete, onChangePassword, onRestore, loading, onSelect}) => {
    if (loading) return <div className="flex justify-center"><Spinner className="h-10 w-10" color="blue" /></div>;

    const { t } = useTranslation();

    const getHeaderClass = (key) => `
        flex items-center w-full h-full px-3 py-2 transition-colors justify-between rounded-tl-md rounded-tr-md
        ${
            sortConfig.key === key
                ? "bg-black text-white font-medium"
                : "text-muted-foreground hover:bg-gray-300 bg-white"
        }
    `;

    return(
        <div className="w-full rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead
                            onClick={() => onSort("username")}
                            className="cursor-pointer select-none align-middle p-0"
                        >
                            <div className={getHeaderClass("username")}>
                                {t("admin.usersManagement.table.name")}

                                {sortConfig.key === "username" && (
                                    <span className="ml-1">
                                        {sortConfig.direction === "asc"
                                            ? <icons.arrowUp className="h-4 w-4" />
                                            : <icons.arrowDown className="h-4 w-4" />
                                        }
                                    </span>
                                )}
                            </div>
                        </TableHead>
                        <TableHead className="hidden md:table-cell cursor-pointer select-none align-middle p-0"
                            onClick={() => onSort("email")}
                        >
                            <div className={getHeaderClass("email")}>
                                {t("admin.usersManagement.table.email")}

                                {sortConfig.key === "email" && (
                                    <span className="ml-1">
                                        {sortConfig.direction === "asc"
                                            ? <icons.arrowUp className="h-4 w-4" />
                                            : <icons.arrowDown className="h-4 w-4" />
                                        }
                                    </span>
                                )}
                            </div>
                        </TableHead>
                        <TableHead
                            onClick={() => onSort("role")}
                            className="cursor-pointer select-none align-middle p-0"
                        >
                            <div className={getHeaderClass("role")}>
                                {t("admin.usersManagement.table.role")}

                                {sortConfig.key === "role" && (
                                    <span className="ml-1">
                                        {sortConfig.direction === "asc"
                                            ? <icons.arrowUp className="h-4 w-4" />
                                            : <icons.arrowDown className="h-4 w-4" />
                                        }
                                    </span>
                                )}
                            </div>
                        </TableHead>
                        <TableHead className="hidden md:table-cell cursor-pointer select-none align-middle p-0"
                            onClick={() => onSort("lastAccess")}
                        >
                            <div className={getHeaderClass("lastAccess")}>
                                {t("admin.usersManagement.table.lastAccess")}

                                {sortConfig.key === "lastAccess" && (
                                    <span className="ml-1">
                                        {sortConfig.direction === "asc"
                                            ? <icons.arrowUp className="h-4 w-4" />
                                            : <icons.arrowDown className="h-4 w-4" />
                                        }
                                    </span>
                                )}
                            </div>
                        </TableHead>
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

            <TablePaginationFooter
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={onRowsPerPageChange}
            />
        </div>
    );
}

export default UserTable;