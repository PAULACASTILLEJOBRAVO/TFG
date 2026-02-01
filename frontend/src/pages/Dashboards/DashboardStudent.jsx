import DashboardLayout from '@/components/Dashboard/Layout/DashboardLayout';
import DashboardContent from '@/components/Dashboard/Layout/DashboardContent';
import StudentOverview from '@/components/Dashboard/Sections/StudentOverview';
import { useAuth } from '@/auth/AuthContext';

const DashboardStudent = () => {
  const { user } = useAuth();

  if (!user) return null;

  if (user.role !== 'student') return null;

  return (
    <>
      <DashboardLayout>
        <DashboardContent>
          <StudentOverview />
        </DashboardContent>
      </DashboardLayout>
    </>
  );
};

export default DashboardStudent;