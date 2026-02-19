import { 
    Sheet, 
    SheetHeader, 
    SheetContent, 
    SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { UserActionCell } from "../Layout";
import { 
    UserFormView, 
    UserHeaderView 
} from "../Forms/View";
import {
    UserFormEdit, 
    UserHeaderEdit,
    UserFooterEdit
} from "../Forms/Edit";
import { 
    useState, 
    useEffect 
} from "react";
import { validateEmail, validateUsername } from "@/utils/validators";

const UserDetailDrawer = ({open, user, drawerMode, onView, onClose, onEdit, onSave, onDelete, onChangePassword, onRestore }) => {
    const [editUser, setEditUser] = useState({ fullname: "", username: "", email: "", role: "", profilePicture: "" });

    const [submitted, setSubmitted] = useState(false);
    const [touched, setTouched] = useState({ username: false, email: false });

    const emailError = validateEmail(editUser.email);
    const usernameError = validateUsername(editUser.username);

    const handleBlur = (field) => {
        setTouched(prev => ({...prev, [field]: true}));
    }

    useEffect(() => {
        if(drawerMode === "edit" && user) {
            setEditUser(prev => ({...prev, 
                username: user?.username || "",
                fullname: user?.fullname || "",
                email: user?.email || "",
                role: user?.role || "",
                profilePicture: user?.profilePicture || ""
            }));

            setTouched({ username: !!user?.username, email: !!user?.email });
        }
    }, [drawerMode]);

    if (!user) return null;

    const handleUpdate = (field, value) => {
        setEditUser(prev => ({...prev, [field]: value}));
    }

    return(
        <Sheet open={open} onOpenChange={drawerMode === "view" ? onClose : () => {}}>
            <SheetContent side="right" className="sm:min-w-[30rem]">
                {/** HEADER */}
                <SheetHeader className="flex flex-col items-center">
                    {drawerMode === "view" && (
                        <>
                            <UserHeaderView user={user} />

                            <SheetDescription className="text-center text-base">
                                Gestión del usuario
                            </SheetDescription>
                        </>
                    )}

                    {drawerMode === "edit" && (
                        <>
                            <UserHeaderEdit data={editUser} touched={touched} submitted={submitted} usernameError={usernameError} onChange={handleUpdate} onBlur={handleBlur} />

                            <SheetDescription className="text-center text-base">
                                    Edición del usuario
                            </SheetDescription>
                        </>
                    )}

                </SheetHeader>

                {/** BODY */}
                {drawerMode === "view" && (<UserFormView user={user}/>)}

                {drawerMode === "edit" && (
                    <UserFormEdit data={editUser} touched={touched} submitted={submitted} emailError={emailError} onChange={handleUpdate}  onBlur={handleBlur}/> 
                )} 

                {/** FOOTER */}
                <SheetFooter className="absolute bottom-6 left-6 right-6 flex gap-2">
                    {drawerMode === "view" && (
                        <UserActionCell
                            onEdit={() => onEdit(user)}
                            onDelete={() => onDelete(user)}
                            onChangePassword={() => onChangePassword(user)}
                            onRestore={() => onRestore(user)}
                            label="usuario"
                            isDeleted={user.isDeleted}
                        />
                    )}

                    {drawerMode === "edit" && (                   
                        <UserFooterEdit onCancel={onView} onSave={() => onSave(editUser)} /> 
                    )} 
                </SheetFooter> 
            </SheetContent>
        </Sheet>
    );
}

export default UserDetailDrawer;