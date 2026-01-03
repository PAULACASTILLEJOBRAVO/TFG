import DashboardHeader from '@/components/Dashboard/Layout/DashboardHeader';
import DashboardSidebar from '@/components/Dashboard/Layout/DashboardSidebard';

const DashboardAdmin = () => {
  return(
    <>
      <DashboardHeader userRole="admin" />
      <DashboardSidebar userRole="admin" />
    </>
  );
};

export default DashboardAdmin;