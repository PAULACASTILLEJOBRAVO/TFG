import { Sheet, SheetHeader, SheetContent, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import UserActionCell from "../Layout/UserActionCell";
import UserFormView from "../Forms/View/UserFormView";
import UserFormEdit from "../Forms/Edit/UserFormEdit";
import UserHeaderView from "../Forms/View/UserHeaderView";
import UserHeaderEdit from "../Forms/Edit/UserHeaderEdit";
import { useState, useEffect } from "react";
import UserFooterEdit from "../Forms/Edit/UserFooterEdit";

const UserDetailDrawer = ({open, user, drawerMode, onView, onClose, onEdit, onSave, onDelete, onChangePassword, onRestore }) => {
    const [editUser, setEditUser] = useState({ fullname: "", username: "", email: "", role: "", profilePicture: "" });

    useEffect(() => {
        if(drawerMode === "edit" && user) {
            setEditUser(prev => ({...prev, 
                username: user?.username || "",
                fullname: user?.fullname || "",
                email: user?.email || "",
                role: user?.role || "",
                profilePicture: user?.profilePicture || ""
            }));
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
                            <UserHeaderEdit data={editUser} onChange={handleUpdate}  />

                            <SheetDescription className="text-center text-base">
                                    Edición del usuario
                            </SheetDescription>
                        </>
                    )}

                </SheetHeader>

                {/** BODY */}
                {drawerMode === "view" && (<UserFormView user={user}/>)}

                {drawerMode === "edit" && (
                    <UserFormEdit data={editUser} onChange={handleUpdate}/> 
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
                            disabled={user.isDeleted}
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