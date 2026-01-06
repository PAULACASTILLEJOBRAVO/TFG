import DashboardLayout from '@/components/Dashboard/Layout/DashboardLayout';
import DashboardContent from '@/components/Dashboard/Layout/DashboardContent';
import AdminOverview from '@/components/Dashboard/Sections/AdminOverview';

const DashboardAdmin = () => {
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