import EditInput from "@/components/Common/EditInput";
import UserRoleSelector from "../Edit/UserRoleSelector";
import { useRoles } from "@/hooks/Roles/useRoles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import UserProfilePictureChange from "../View/UserProfilePictureChange";

const UserFormCreate = ({newUser, onChange, onSubmit}) => {
    const {roles} = useRoles();

    return (
        <Card className="max-w-xl mx-auto">
            <CardHeader>
                <CardTitle>User information</CardTitle>
            </CardHeader>

            <CardContent className="space-y-2">
                <div className="flex justify-center">
                    <UserProfilePictureChange avatar={newUser.profilePicture} username={newUser.username} onChange={onChange} />
                </div>
                
                <EditInput label="Nombre completo" value={newUser.fullname} onChange={e => onChange("fullname", e.target.value)} />
                <EditInput label="Nombre de usuario" value={newUser.username} onChange={e => onChange("username", e.target.value)} />
                <EditInput label="Email" type="email" value={newUser.email} onChange={e => onChange("email", e.target.value)} />
                <EditInput label="Contraseña" type="password" value={newUser.password} onChange={e => onChange("password", e.target.value)} />
                <UserRoleSelector roles={roles} onChange={value => onChange("role", value)} />

                <div className="pt-4">
                    <Button className="bg-green-500 hover:bg-green-500 w-full" onClick={() => onSubmit(newUser)}>
                        Crear usuario
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

export default UserFormCreate;