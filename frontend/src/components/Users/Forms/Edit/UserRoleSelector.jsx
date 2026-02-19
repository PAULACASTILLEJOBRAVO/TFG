import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue, 
    SelectLabel, 
    SelectGroup 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useRoles } from "@/hooks/Roles/useRoles";
import { Spinner } from "@/components/ui/spinner";

const UserRoleSelector = ({value, onChange}) => { 
    const {roles, loading} = useRoles();

    if(loading) return <div className="flex justify-center"><Spinner color="blue" /></div>;

    const safeValue = value ?? (roles.length > 0 ? roles[1].value : "");

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
                    Rol
                </Label>
            </div>
            <Select value={ safeValue } onValueChange={onChange}>
                <SelectTrigger>
                    <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>

                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Roles</SelectLabel>
                        {roles.map(role => (   
                            <SelectItem key={role._id} value={role.value}>
                                {role.label}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
}

export default UserRoleSelector;