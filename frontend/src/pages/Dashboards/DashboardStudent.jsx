import DashboardHeader from '@/components/Dashboard/Layout/DashboardHeader';
import DashboardSidebar from '@/components/Dashboard/Layout/DashboardSidebard';

const DashboardStudent = () => {
  return (
    <>
      <DashboardHeader userRole="student" />
      <DashboardSidebar userRole="student" />
    </>
  );
};

export default DashboardStudent;