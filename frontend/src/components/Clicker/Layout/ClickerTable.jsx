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

const ClickerTable = ({clickers, loading, editClicker, editClickerId, onEdit, onDelete, onRestore, onSaveEdit, onCancelEdit, onEditChange, onToggleStudent}) => {
    if (loading) return <div className="flex justify-center"><Spinner className="h-10 w-10" color="blue" /></div>;

    const { t } = useTranslation();

    return(
        <div className="w-full rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>{t("admin.clickersManagement.table.code")}</TableHead>
                        <TableHead>{t("admin.clickersManagement.table.assignedUser")}</TableHead>
                        <TableHead>{t("admin.clickersManagement.table.status")}</TableHead>
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
        </div>
    );
}

export default ClickerTable;