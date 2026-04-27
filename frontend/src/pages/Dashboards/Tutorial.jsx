import { 
    AdminTutorial, 
    StudentTutorial, 
    TeacherTutorial 
} from '@/components/Dashboard/Layout/Tutorial';
import { 
    DashboardLayout,
    DashboardContent,
 } from '@/components/Dashboard/Layout';
import { useAuth } from '@/auth/AuthContext';
import { useTranslation } from 'react-i18next';

const Tutorial = () => {
    const { t } = useTranslation();

    const { user } = useAuth();
    const role = user?.role;

    const renderTutorial = () => {
        switch (role) {
            case "admin":
                return <AdminTutorial />;
            case "teacher":
                return <TeacherTutorial />;
            case "student":
                return <StudentTutorial />;
            default:
                return <p className="text-gray-500">{t("common.noTutorial")}</p>
        }
    };

    return (
        <DashboardLayout>
            <DashboardContent>
                {renderTutorial()}
            </DashboardContent>
        </DashboardLayout>
    );
}
export default Tutorial;