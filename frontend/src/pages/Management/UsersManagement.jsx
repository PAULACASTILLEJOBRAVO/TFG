import DashboardLayout from "@/components/Dashboard/Layout/DashboardLayout";
import DashboardContent from "@/components/Dashboard/Layout/DashboardContent";
import UserTable from "@/components/Users/Management/UserTable";
import { useUsersManagement } from "@/hooks/Users/useUsers";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import DeleteUserDialog from "@/components/Users/Management/Dialogs/DeleteUserDialog";
import ChangePasswordUserDialog from "@/components/Users/Management/Dialogs/ChangePasswordDialog";
import { useUserActions } from "@/hooks/Users/useUserActions";

const UserManagement = () => {
    // DATA
    const { users, loading: loadingManagement, refetch  } = useUsersManagement();
    const { remove, changePassword, restore, loading: loadingActions } = useUserActions();

    // SELECTIONATED ROW
    const [selectedUser, setSelectedUser] = useState(null);
    
    // DRAWER
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    //DIALOGS
    const [dialogs, setDialogs] = useState({
        delete: false,
        changePassword: false
    });


    if(loadingManagement) return <Spinner/>

    // DRAWER STATUS
    const handleSelectUser = (user) => {
        setSelectedUser(user);
        setIsDrawerOpen(true);
    }

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false); // Do not clear selectUser here. Allows drawer to be reopened without charged user again.
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
    const handleUpdateUser = (updateUser) => {

    }

    // DIALOGS ACTIONS
    const handleConfirmDelete = async (reason) => {
        try{
            await remove(selectedUser._id, {reason: reason});
            closeDialogs();
            refetch();
        }catch{}
    }

    const handleConfirmChangePassword = async (newPassword) => {
        try {
            await changePassword(selectedUser._id, newPassword);
            closeDialogs();
        }catch{}
    }

    const handleRestoreUser = async (user) => {
        try {
            await restore(user._id);
            refetch();
        }catch{}
    }

    return(
        <>
            <DashboardLayout>
                <DashboardContent>
                    <UserTable
                        users={users}
                        loading={loadingManagement}
                        onSelect={handleSelectUser}
                        onEdit={handleSelectUser}
                        onDelete={openDeleteDialog}
                        onChangePassword={openChangePasswordDialog}
                        onRestore={handleRestoreUser}
                    />

                    {/* <UserDrawer 
                        open={isDrawerOpen}
                        user={selectedUser}
                        onClose={handleCloseDrawer}
                        onSave={handleUpdateUser}
                        onDelete={() => openDeleteDialog}
                        onChangePassword={() => openChangePasswordDialog}
                    /> */}

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