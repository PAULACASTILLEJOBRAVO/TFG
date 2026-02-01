import DashboardSubtitle from "@/components/Dashboard/Layout/Content/DashboardSubtitle";
import DashboardContent from "@/components/Dashboard/Layout/DashboardContent";
import DashboardLayout from "@/components/Dashboard/Layout/DashboardLayout";
import { useAuth } from "@/auth/AuthContext";
import CreateButton from "@/components/Common/ActionButtons/CreateButton";
import { useNavigate } from "react-router-dom";

const QuizzesManagement = () => {
    const { user } = useAuth();

    const navigate = useNavigate();

    return (
        <DashboardLayout>
            <DashboardContent>
                
                <div className="flex items-center mb-4 justify-between">
                    <DashboardSubtitle label="Mis cuestionarios" />
                       
                    <div className="pr-6 md:pr-16">
                        <CreateButton label="cuestionario" onClick={() => navigate("/dashboard_teacher/quizzes/create")}/>
                    </div>
                </div>


                
            </DashboardContent>
        </DashboardLayout>
    );
}

export default QuizzesManagement;