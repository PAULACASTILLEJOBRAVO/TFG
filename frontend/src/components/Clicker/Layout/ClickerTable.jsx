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

const ClickerTable = ({clickers, loading, editClicker, editClickerId, onEdit, onDelete, onRestore, onSaveEdit, onCancelEdit, onEditChange, onToggleStudent}) => {
    if (loading) return <div className="flex justify-center"><Spinner className="h-10 w-10" color="blue" /></div>;

    return(
        <div className="w-full rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Código del dispositivo</TableHead>
                        <TableHead>Usuario asignado</TableHead>
                        <TableHead>Estado</TableHead>
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
                                No hay clickers registrados.
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