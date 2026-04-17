import { 
    TableRow, 
    TableCell 
} from "@/components/ui/table";
import {
    ClickerActionCell, 
    ClickerStatusChip
} from ".";
import { HexadecimalToDecimal } from "@/utils/clickers";
import { StudentSearch } from "@/components/Users/Layout/Students";
import { ClickerStatusSelector } from "../Content";
import { useTranslation } from "react-i18next";

const ClickerRow = ({clicker, editClicker, editClickerId,  onEdit, onDelete, onRestore, onSaveEdit, onCancelEdit, onEditChange, onToggle}) => {
    const isEditing = editClickerId === clicker._id;

    const { t } = useTranslation();

    return(
        <TableRow className={`hover:bg-muted ${clicker.status === "damaged" || clicker.status === "retired" ? "bg-red-50 hover:bg-red-100 text-gray-500" : isEditing ? "bg-blue-50 hover:bg-blue-100" : ""}`}>
            <TableCell className="font-medium">{HexadecimalToDecimal(clicker.deviceCode)}</TableCell>
            {isEditing 
                ? editClicker?.status === "assigned" 
                    ? <TableCell>
                        <StudentSearch 
                            label={t("admin.clickersManagement.dialogs.create.studentLabel")}
                            placeholder={t("admin.clickersManagement.dialogs.create.studentPlaceholder")}
                            selectedIdStudent={editClicker?.assignedToUserId ? editClicker.assignedToUserId : null}
                            onSelect={onToggle} 
                            showStatus="forAdmin"
                        />
                        </TableCell>
                    : <TableCell></TableCell>
                : <TableCell>{clicker?.assignedToUserId?.username}</TableCell> }
            <TableCell>
                {isEditing 
                    ? <ClickerStatusSelector
                        value={editClicker?.status}
                        onChange={(newStatus) => onEditChange("status", newStatus)}
                        isEditing={isEditing}
                    /> 
                    : <ClickerStatusChip 
                        status={clicker?.status}
                    />}
            </TableCell>
            <TableCell>
                <ClickerActionCell
                    onEdit={(event) => {
                        event.stopPropagation();
                        onEdit(clicker)
                    }}
                    onDelete={(event) => {
                        event.stopPropagation();
                        onDelete(clicker);
                    }}
                    onRestore={(event) => {
                        event.stopPropagation();
                        onRestore(clicker)
                    }}
                    onSaveEdit={(event) => {
                        event.stopPropagation();
                        onSaveEdit(clicker._id);
                    }}
                    onCancelEdit={(event) => {
                        event.stopPropagation();
                        onCancelEdit();
                    }}
                    isEditing={isEditing}
                    label="clicker"
                    status={clicker.status}
                />
            </TableCell>
        </TableRow>
    );
}

export default ClickerRow;