import { Separator } from "@/components/ui/separator";
import { EditInput } from "@/components/Common";
import { useRoles } from "@/hooks/Roles/useRoles";
import { UserRoleSelector } from ".";
import { Spinner } from "@/components/ui/spinner";

const UserFormEdit = ({data, onChange}) => {
    const { roles, loading } = useRoles();
    if (loading) return <div className="flex justify-center"><Spinner className="h-10 w-10" color="blue" /></div>;

    return(
        <div className="space-y-3 text-center sm:text-left">
            <Separator/>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">   
                <EditInput 
                    label="Nombre completo" 
                    value={data.fullname} 
                    onChange={e => onChange("fullname", e.target.value)}
                />                
                <EditInput 
                    label="Email" 
                    value={data.email} 
                    onChange={e => onChange("email", e.target.value)}
                />

                <UserRoleSelector
                    value={data.role}
                    onChange={value => onChange("role", value)}
                    roles={roles}
                />
            </div>
        </div>
    );
}

export default UserFormEdit;