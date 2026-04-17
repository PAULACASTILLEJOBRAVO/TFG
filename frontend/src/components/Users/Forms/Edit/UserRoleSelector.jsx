import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue, 
    SelectGroup 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useRoles } from "@/hooks/Roles/useRoles";
import { Spinner } from "@/components/ui/spinner";
import { useTranslation } from "react-i18next";

const UserRoleSelector = ({label, value, onChange}) => { 
    const {roles, loading} = useRoles();

    const { t } = useTranslation();

    if(loading) return <div className="flex justify-center"><Spinner color="blue" /></div>;

    return(
        <div className="w-full">
            <div className="px-3 bg-transparent text-black">
                <Label 
                    className={`
                        left-3 top-[0.9rem] 
                        z-10
                        origin-left
                        text-gray-500 text-xs 
                    `}>
                    {t("admin.usersManagement.drawer.edit.role")}
                </Label>
            </div>
            <Select value={ value } onValueChange={onChange}>
                <SelectTrigger>
                    <SelectValue placeholder={t("admin.usersManagement.drawer.edit.selectRole")} />
                </SelectTrigger>

                <SelectContent>
                    <SelectGroup>
                        {roles.map(role => (   
                            <SelectItem key={role._id} value={role.value}>
                                {t("admin.usersManagement.table.roles." + role.value)}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
}

export default UserRoleSelector;