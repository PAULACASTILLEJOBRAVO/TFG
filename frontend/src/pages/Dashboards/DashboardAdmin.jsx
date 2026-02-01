import DashboardLayout from '@/components/Dashboard/Layout/DashboardLayout';
import DashboardContent from '@/components/Dashboard/Layout/DashboardContent';
import AdminOverview from '@/components/Dashboard/Sections/AdminOverview';
import { useAuth } from '@/auth/AuthContext';

const DashboardAdmin = () => {
  const { user } = useAuth();

  if (!user) return null;

  if (user.role !== 'admin') return null;

  return (
    <>
      <DashboardLayout>
        <DashboardContent>
          <AdminOverview />
        </DashboardContent>
      </DashboardLayout>
    </>
  );
};

export default DashboardAdmin;