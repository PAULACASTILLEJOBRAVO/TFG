import DashboardLayout from "@/components/Dashboard/Layout/DashboardLayout";
import DashboardContent from "@/components/Dashboard/Layout/DashboardContent";
import UserTable from "@/components/Users/Layout/UserTable";
import { useUsers } from "@/hooks/Users/useUsers";
import { useState } from "react";
import DeleteUserDialog from "@/components/Users/Dialogs/DeleteUserDialog";
import ChangePasswordUserDialog from "@/components/Users/Dialogs/ChangePasswordDialog";
import { useUserActions } from "@/hooks/Users/useUserActions";
import UserDetailDrawer from "@/components/Users/Drawers/UserDetailDrawer";    
import DashboardSubtitle from "@/components/Dashboard/Layout/Content/DashboardSubtitle";
import CreateButton from "@/components/Common/ActionButtons/CreateButton";
import { useNavigate } from "react-router-dom";

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
        }catch{
            console.log("Error updating user");
        }
    }

    // DIALOGS ACTIONS
    const handleConfirmDelete = async (reason) => {
        try{
            await remove(selectedUser._id, {reason: reason});
            closeDialogs();
            refetch();
        }catch{
            console.log("Error deleting user");
        }
    }

    const handleConfirmChangePassword = async (newPassword) => {
        try {
            await changePassword(selectedUser._id, newPassword);
            closeDialogs();
        }catch{
            console.log("Error changing password");
        }
    }

    const handleRestoreUser = async (user) => {
        try {
            await restore(user._id);
            refetch();
        }catch{
            console.log("Error restoring user");
        }
    }

    return(
        <>
            <DashboardLayout>
                <DashboardContent>
                    <div className="flex items-center mb-4 justify-between">
                        <DashboardSubtitle label="Gestión de usuarios" />
                        <div className="pr-6 md:pr-16">
                            <CreateButton label="usuario" onClick={() => navigate("/dashboard_admin/users/create")}/>
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
        </>
    );
}

export default UserManagement;