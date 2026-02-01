import DashboardContent from "@/components/Dashboard/Layout/DashboardContent";
import DashboardLayout from "@/components/Dashboard/Layout/DashboardLayout";
import { useUserActions } from "@/hooks/Users/useUserActions";
import { Separator } from "@/components/ui/separator";
import AppBreadcrumb from "@/components/Common/AppBreadcrumb";
import UserFormCreate from "@/components/Users/Forms/Create/UserFormCreate";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateHeader from "@/components/Common/CreateHeader";

const UserCreate = () => {
    const { create } = useUserActions();
    
    const [createUser, setCreateUser] = useState({ fullname: "", username: "", email: "", password: "", role: "", profilePicture: "" });
    
    const navigate = useNavigate();

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

                <CreateHeader onBack="/dashboard_admin/users" label="usuarios" title="Crear nuevo usuario" />
                
                <UserFormCreate newUser={createUser} onSubmit={handleCreateUser} onChange={handleUpdate} />
                
            </DashboardContent>
        </DashboardLayout>
    );
}

export default UserCreate;