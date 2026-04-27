import { 
    Table, 
    TableHeader, 
    TableHead, 
    TableBody, 
    TableRow, 
    TableCell 
} from "@/components/ui/table";
import { ClickerRow } from ".";
import { Spinner } from "@/components/ui/spinner";
import { useTranslation } from "react-i18next";
import { TablePaginationFooter } from "@/components/Common";
import { icons } from "@/utils/constants";

const ClickerTable = ({clickers, currentPage, totalPages, onPageChange, rowsPerPage, onRowsPerPageChange, sortConfig, onSort, loading, editClicker, editClickerId, onEdit, onDelete, onRestore, onSaveEdit, onCancelEdit, onEditChange, onToggleStudent}) => {
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
                            onClick={() => onSort("deviceCode")}
                            className="cursor-pointer select-none align-middle p-0"
                        >
                            <div className={getHeaderClass("deviceCode")}>
                                {t("admin.clickersManagement.table.code")}

                                {sortConfig.key === "deviceCode" && (
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
                            onClick={() => onSort("assignedToUser")}
                            className="cursor-pointer select-none align-middle p-0"
                        >
                            <div className={getHeaderClass("assignedToUser")}>
                                {t("admin.clickersManagement.table.assignedUser")}

                                {sortConfig.key === "assignedToUser" && (
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
                            onClick={() => onSort("status")}
                            className="cursor-pointer select-none align-middle p-0"
                        >
                            <div className={getHeaderClass("status")}>
                                {t("admin.clickersManagement.table.status")}

                                {sortConfig.key === "status" && (
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
                    {clickers.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={6}
                                className="text-center py-6 text-muted-foreground"
                            >
                                {t("admin.clickersManagement.table.noClickers")}
                            </TableCell>
                        </TableRow>
                    ) : (
                        clickers.map(clicker => (
                            <ClickerRow
                                key={clicker._id}
                                clicker={clicker}
                                editClicker={editClicker}
                                editClickerId={editClickerId}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onRestore={onRestore}
                                onSaveEdit={onSaveEdit}
                                onCancelEdit={onCancelEdit}
                                onEditChange={onEditChange}
                                onToggle={onToggleStudent}
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

export default ClickerTable;