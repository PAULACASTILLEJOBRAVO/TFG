import DashboardSubtitle from "@/components/Dashboard/Layout/Content/DashboardSubtitle";
import DashboardContent from "@/components/Dashboard/Layout/DashboardContent";
import DashboardLayout from "@/components/Dashboard/Layout/DashboardLayout";
import { useAuth } from "@/auth/AuthContext";
import { useUserActions } from "@/hooks/Users/useUserActions";
import { Separator } from "@/components/ui/separator";
import AppBreadcrumb from "@/components/Common/AppBreadcrumb";
import BackButton from "@/components/Common/ActionButtons/BackButton";
import UserFormCreate from "@/components/Users/Management/Forms/Create/UserFormCreate";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const UserCreate = () => {
    const { create } = useUserActions();
    
    const [createUser, setCreateUser] = useState({ fullname: "", username: "", email: "", password: "", role: "", profilePicture: "" });
    
    const navigate = useNavigate();

    const handleUpdate = (field, value) => {
        setCreateUser(prev => ({...prev, [field]: value}));
    }

    const handleCreateUser = async (newUser) => {
        console.log("Create user", newUser);
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

                <div className="grid grid-cols-3 items-center pb-4">
                    {/** Leftc */}
                    <div className="pr-6 md:pr-16">
                        <BackButton href="/dashboard_admin/users" label="usuarios" />
                        
                    </div>             

                    {/** Center */}
                    <div className="text-center">
                        <DashboardSubtitle label="Crear nuevo usuario" />
                    </div>

                    {/** Right (empty) */}
                </div>
                
                <UserFormCreate newUser={createUser} onSubmit={handleCreateUser} onChange={handleUpdate} />
                
            </DashboardContent>
        </DashboardLayout>
    );
}

export default UserCreate;