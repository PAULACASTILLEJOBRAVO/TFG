import DashboardLayout from '@/components/Dashboard/Layout/DashboardLayout';
import DashboardContent from '@/components/Dashboard/Layout/DashboardContent';
import TeacherOverview from '@/components/Dashboard/Sections/TeacherOverview';
import { useAuth } from '@/auth/AuthContext';

const DashboardTeacher = () => {
  const { user } = useAuth();

  if (!user) return null;

  if (user.role !== 'teacher') return null;

  return (
    <>
      <DashboardLayout>
        <DashboardContent>
          <TeacherOverview />
        </DashboardContent>
      </DashboardLayout>
    </>
  );
};

export default DashboardTeacher;