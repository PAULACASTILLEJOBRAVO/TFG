import { 
    DashboardLayout, 
    DashboardContent
} from "@/components/Dashboard/Layout/";
import { UserTable } from "@/components/Users/Layout";
import { useUsers } from "@/hooks/Users/useUsers";
import { 
    useState,
    useEffect
} from "react";
import { 
    DeleteUserDialog, 
    ChangePasswordUserDialog
} from "@/components/Users/Dialogs";
import { useUserActions } from "@/hooks/Users/useUserActions";
import { UserDetailDrawer } from "@/components/Users/Drawers";    
import { DashboardSubtitle } from "@/components/Dashboard/Layout/Content";
import { CreateButton } from "@/components/Common/ActionButtons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { 
    matchesRole, 
    normalizeWord 
} from "@/utils/search";

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

    // Search
    const location = useLocation();
    const params = new URLSearchParams(location.search);

    const searchParams = params.get("search") || "";
    const pageParam = parseInt(params.get("page")) || 1;
    const limitParam = parseInt(params.get("limit")) || 5;

    const words = searchParams.toLowerCase().split(" ").filter(word => word.trim() !== "");;
    const normalizedWords = words.map(normalizeWord);

    const filteredUsers = users.filter(u => {
        const username = u.username?.toLowerCase() || "";
        const fullname = u.fullname?.toLowerCase() || "";
        const email = u.email?.toLowerCase() || "";

        return normalizedWords.every(word =>
            username.includes(word) ||
            fullname.includes(word) ||
            email.includes(word) ||
            matchesRole(u.role, word)
        );
    });

    // Sorting table headers
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: "asc"
    });

    const handleSort = (key) => {
        setSortConfig(prev => {
            if (prev.key === key) {
                return {
                    key,
                    direction: prev.direction === "asc" ? "desc" : "asc"
                };
            }
            return { key, direction: "asc" };
        });
    };

    const sortedUsers = [...filteredUsers].sort((a, b) => {
        if (!sortConfig.key) return 0;

        const getLastAccess = (user) => user.lastLogoutAt || user.lastLoginAt || null;

        const getValue = (user) => {
            let value;

            switch (sortConfig.key) {
                case "lastAccess":
                    value = getLastAccess(user);
                    break;
                default:
                    value = user[sortConfig.key];
            }

            if (!value) return 0;

            if (
                sortConfig.key === "lastAccess" ||
                sortConfig.key === "lastLoginAt" ||
                sortConfig.key === "lastLogoutAt"
            ) {
                return new Date(value).getTime();
            }

            return value.toString().toLowerCase();
        };

        const aValue = getValue(a);
        const bValue = getValue(b);

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
    });

    // Pagination
    const [currentPage, setCurrentPage] = useState(pageParam);
    const [rowsPerPage, setRowsPerPage] = useState(limitParam);

    const indexOfLastUser = currentPage * rowsPerPage;
    const indexOfFirstUser = indexOfLastUser - rowsPerPage;

    const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);

    const totalPages = Math.ceil(sortedUsers.length / rowsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchParams]);

    useEffect(() => {
        const params = new URLSearchParams();

        if (searchParams) params.set("search", searchParams);
        params.set("page", currentPage);
        params.set("limit", rowsPerPage);

        navigate(`?${params.toString()}`, { replace: true });
    }, [currentPage, rowsPerPage, searchParams]);

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
                    users={currentUsers}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={setRowsPerPage}
                    sortConfig={sortConfig}
                    onSort={handleSort}
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