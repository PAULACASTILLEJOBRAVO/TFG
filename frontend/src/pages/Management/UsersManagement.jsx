import { 
    DashboardLayout, 
    DashboardContent
} from "@/components/Dashboard/Layout/";
import { UserTable } from "@/components/Users/Layout";
import { useUsers } from "@/hooks/Users/useUsers";
import { useState } from "react";
import { 
    DeleteUserDialog, ChangePasswordUserDialog
} from "@/components/Users/Dialogs";
import { useUserActions } from "@/hooks/Users/useUserActions";
import { UserDetailDrawer } from "@/components/Users/Drawers";    
import { DashboardSubtitle } from "@/components/Dashboard/Layout/Content";
import { CreateButton } from "@/components/Common/ActionButtons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const UserManagement = () => {
    // DATA
    const { users, loading: loadingManagement, refetch  } = useUsers();
    const { remove, changePassword, restore, update } = useUserActions();

    // SELECTIONATED ROW
    const [selectedUser, setSelectedUser] = useState(null);
    
    // DRAWER
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [drawerMode, setDrawerMode] = useState("view"); // view || edit

    //DIALOGS
    const [dialogs, setDialogs] = useState({
        delete: false,
        changePassword: false
    });

    // Navigation
    const navigate = useNavigate();

    // Translation
    const { t } = useTranslation();

    // DRAWER STATUS
    const handleSelectUser = (user) => {
        setSelectedUser(user);
        setDrawerMode("view");
        setIsDrawerOpen(true);
    }

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setDrawerMode("edit");
        setIsDrawerOpen(true);
    }

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false); // Do not clear selectUser here. Allows drawer to be reopened without charged user again.
        setDrawerMode("view");
    }

    const handleCloseEditForm = () => {
        setDrawerMode("view");
    }

    // DIALOGS STATUS
    const openDeleteDialog = (user) => {
        setSelectedUser(user);
        setDialogs(prev => ({...prev, delete: true}));
    }

    const openChangePasswordDialog = (user) => {
        setSelectedUser(user);
        setDialogs(prev => ({...prev, changePassword: true}));
    }

    const closeDialogs = () => {
        setDialogs({
            delete: false,
            changePassword: false
        });
    }

    // DRAWER ACTIONS
    const handleUpdateUser = async (updateUser) => {
        try {
            await update(selectedUser._id, updateUser);
            handleCloseDrawer();
            refetch();
        }catch(error){
            console.error("Error updating user:", error);
        }
    }

    // DIALOGS ACTIONS
    const handleConfirmDelete = async (reason) => {
        try{
            await remove(selectedUser._id, {reason: reason});
            closeDialogs();
            refetch();
        }catch(error){
            console.error("Error deleting user:", error);
        }
    }

    const handleConfirmChangePassword = async (newPassword) => {
        try {
            await changePassword(selectedUser._id, newPassword);
            closeDialogs();
        }catch(error){
            console.error("Error changing password:", error);
        }
    }

    const handleRestoreUser = async (user) => {
        try {
            await restore(user._id);
            refetch();
        }catch(error){
            console.error("Error restoring user:", error);
        }
    }

    return(
        <DashboardLayout>
            <DashboardContent>
                <div className="flex items-center mb-4 justify-between">
                    <DashboardSubtitle label={t("admin.usersManagement.title")} />
                    <div className="pr-6 md:pr-16">
                        <CreateButton label={t("admin.usersManagement.labelButton")} onClick={() => navigate("/dashboard_admin/users/create")}/>
                    </div>
                </div>

                <UserTable
                    users={users}
                    loading={loadingManagement}
                    onSelect={handleSelectUser}
                    onEdit={handleEditUser}
                    onDelete={openDeleteDialog}
                    onChangePassword={openChangePasswordDialog}
                    onRestore={handleRestoreUser}
                />

                <UserDetailDrawer 
                    open={isDrawerOpen}
                    user={selectedUser}
                    drawerMode={drawerMode}
                    onView={handleCloseEditForm}
                    onClose={handleCloseDrawer}
                    onEdit={handleEditUser}
                    onSave={handleUpdateUser}
                    onDelete={openDeleteDialog}
                    onChangePassword={openChangePasswordDialog}
                    onRestore={handleRestoreUser}
                />

                {selectedUser && <DeleteUserDialog
                    open={dialogs.delete}
                    user={selectedUser}
                    onConfirm={handleConfirmDelete}
                    onClose={closeDialogs}
                />}

                {selectedUser && <ChangePasswordUserDialog
                    open={dialogs.changePassword}
                    user={selectedUser}
                    onConfirm={handleConfirmChangePassword}
                    onClose={closeDialogs}
                />}
            </DashboardContent>
        </DashboardLayout>   
    );
}

export default UserManagement;