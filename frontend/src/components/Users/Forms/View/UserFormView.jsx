import { InfoBlock } from "@/components/Common";
import { Separator } from "@/components/ui/separator";
import { UserStatusChip } from "../../Layout";
import { Label } from "@/components/ui/label";
import { rolesType } from "@/utils/constants";

const UserFormView = ({user}) => {
    return (
            <div className="space-y-3 text-center sm:text-left">
                <Separator/>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">                   
                    <InfoBlock label="Nombre completo" value={user?.fullname || "-"}/>
                    <InfoBlock label="Email" value={user.email} />
                </div>

                <InfoBlock label="Rol" value={rolesType[user.role]} />

                <Separator/>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 justify-items-center items-center">     
                    <UserStatusChip 
                        isActive={user.isActive}
                        isDelete={user.isDelete}
                    />

                    <InfoBlock label="Último login" value={user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : "Nunca"} />
                    <InfoBlock label="Último logout" value={user.lastLogoutAt ? new Date(user.lastLogoutAt).toLocaleDateString() : "Nunca"} />
                </div>
                    
                {user.isDeleted && (
                    <div className="grid grid-rows-2 rounded-md border bg-red-50 p-3 space-y-3">    
                        <Label className="text-sm font-medium text-red-700 text-center">Usuario eliminado</Label>
                        <Separator/>
                        <div className="grid grid-cols-1 md:grid-cols-2">
                            <InfoBlock label="Fecha" value={new Date(user.deletedAt).toLocaleDateString()} />
                            <InfoBlock label="Motivo" value={user.deleteReason || "—"} />
                        </div>
                    </div>
                )}
            </div>
    );
}

export default UserFormView;