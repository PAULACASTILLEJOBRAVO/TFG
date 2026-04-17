import { DashboardLayout,DashboardContent } from "@/components/Dashboard/Layout";
import { useUserActions } from "@/hooks/Users/useUserActions";
import { Separator } from "@/components/ui/separator";
import { AppBreadcrumb, CreateHeader } from "@/components/Common";
import { UserFormCreate } from "@/components/Users/Forms/Create";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const UserCreate = () => {
    const { create } = useUserActions();
    
    const [createUser, setCreateUser] = useState({ fullname: "", username: "", email: "", password: "", role: "student", profilePicture: "" });
    
    const navigate = useNavigate();

    const { t } = useTranslation();

    const handleUpdate = (field, value) => {
        setCreateUser(prev => ({...prev, [field]: value}));
    }

    const handleCreateUser = async (newUser) => {
        try {
            await create(newUser);
            navigate("/dashboard_admin/users");
        } catch (error) {
            console.error("Error creating user:", error);
        }
    }

    return (
        <DashboardLayout>
            <DashboardContent>
                <AppBreadcrumb />

                <Separator />

                <CreateHeader onBack="/dashboard_admin/users" label={t("admin.usersManagement.labelButton")} title={t("admin.usersManagement.createForm.title")} />
                
                <UserFormCreate newUser={createUser} onSubmit={handleCreateUser} onChange={handleUpdate} />
                
            </DashboardContent>
        </DashboardLayout>
    );
}

export default UserCreate;