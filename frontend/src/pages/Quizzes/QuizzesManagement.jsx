import DashboardSubtitle from "@/components/Dashboard/Layout/Content/DashboardSubtitle";
import DashboardContent from "@/components/Dashboard/Layout/DashboardContent";
import DashboardLayout from "@/components/Dashboard/Layout/DashboardLayout";
import { useAuth } from "@/auth/AuthContext";

const QuizzesManagement = () => {
    // DATA
    const { user, loading } = useAuth();

    return (
        <DashboardLayout>
            <DashboardContent>
                <DashboardSubtitle label="Todos mis cuestionarios" />

                
            </DashboardContent>
        </DashboardLayout>
    );
}

export default QuizzesManagement;