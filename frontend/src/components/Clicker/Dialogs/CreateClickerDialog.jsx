import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription, 
    DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EditInput } from "@/components/Common";
import { ClickerStatusSelector } from "../Content/";
import { StudentSearch } from "@/components/Users/Layout/Students";

const CreateClickerDialog = ({ open, clicker, onClose, onSave, onChange, onToggleStudent }) => {
    return(
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Registrar clicker
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Esta opción registrará un nuevo clicker en el sistema. 
                </DialogDescription>

                    <EditInput 
                        type="number" 
                        min="0"
                        step="1"
                        label="Código del dispositivo" 
                        placeholder="Introduce el código del clicker" 
                        value={clicker.deviceCode}
                        onChange={e => onChange("deviceCode", Number(e.target.value))}
                        isRequired={true}
                    />

                    <ClickerStatusSelector 
                        value={clicker.status}
                        onChange={(value) => onChange("status", value)}
                    />

                    <div className="pt-2">
                        {clicker.status === "assigned" && (
                        <StudentSearch
                            label="Asignar estudiante"
                            placeholder="Introduce el nombre del estudiante que usará este clicker"
                            selectedIdStudent={clicker.assignedToUserId ? clicker.assignedToUserId : null}
                            onSelect={onToggleStudent}
                            showStatus="forAdmin"
                        />
                    )}
                    </div>
              

                <DialogFooter className="gap-2">
                    <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={onSave}>
                        Registrar
                    </Button>

                    <Button variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CreateClickerDialog;