import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue, 
    SelectGroup 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { statusClicker } from "@/utils/constants";
import { useTranslation } from "react-i18next";

const ClickerStatusSelector = ({ value, onChange, isEditing }) => { 
    const { t } = useTranslation();

    return(
        <div className="w-full">
            <div className="px-3 bg-transparent text-black">
                {!isEditing && (
                <Label 
                    className={`
                        left-3 top-[0.9rem] 
                        z-10
                        origin-left
                        text-gray-500 text-xs
                    `}>
                    {/* Estado */}
                    {t("admin.clickersManagement.row.edit.status")}
                </Label>)}
            </div>
            <Select value={value ? value : statusClicker[0].value} onValueChange={onChange}>
                <SelectTrigger>
                    <SelectValue placeholder={t("admin.clickersManagement.row.edit.selectStatus")} />
                </SelectTrigger>

                <SelectContent>
                    <SelectGroup>
                        {statusClicker.map(status => (  
                            <SelectItem key={status._id} value={status.value}>
                                {t(status.labelKey)}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
}

export default ClickerStatusSelector;