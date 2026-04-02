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
import { useTranslation } from "react-i18next";
import { HexadecimalToDecimal } from "@/utils/clickers";

const CreateClickerDialog = ({ open, clicker, touched, submitted, clickerError, onClose, onSave, onChange, onToggleStudent }) => {
    const { t } = useTranslation();

    return(
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {t("admin.clickersManagement.dialogs.create.title")}
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    {t("admin.clickersManagement.dialogs.create.description")}
                </DialogDescription>

                    <EditInput 
                        type="number" 
                        min={1}
                        step={1}
                        label={t("admin.clickersManagement.dialogs.create.nameLabel")} 
                        placeholder={t("admin.clickersManagement.dialogs.create.namePlaceholder")} 
                        value={HexadecimalToDecimal(clicker.deviceCode)}
                        onChange={e => onChange("deviceCode", e.target.value)}
                        isRequired={true}
                        error={(touched || submitted) && clickerError?.deviceCode}
                        errorMessage={clickerError?.deviceCode}
                    />

                    <ClickerStatusSelector 
                        value={clicker.status}
                        onChange={(value) => onChange("status", value)}
                    />

                    <div className="pt-2">
                        {clicker.status === "assigned" && (
                        <StudentSearch
                            label={t("admin.clickersManagement.dialogs.create.studentLabel")}
                            placeholder={t("admin.clickersManagement.dialogs.create.studentPlaceholder")}
                            selectedIdStudent={clicker.assignedToUserId ? clicker.assignedToUserId : null}
                            onSelect={onToggleStudent}
                            showStatus="forAdmin"
                        />
                    )}
                    </div>


                <DialogFooter className="gap-2">
                    <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={onSave}>
                        {t("common.register")}
                    </Button>

                    <Button variant="outline" onClick={onClose}>
                        {t("common.cancel")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CreateClickerDialog;