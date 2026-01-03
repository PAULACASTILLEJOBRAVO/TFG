import DashboardHeader from '@/components/Dashboard/Layout/DashboardHeader';
import DashboardSidebar from '@/components/Dashboard/Layout/DashboardSidebard';

const DashboardTeacher = () => {
  return (
    <>
      <DashboardHeader userRole="teacher" />
      <DashboardSidebar userRole="teacher" />
    </>
  )
};

export default DashboardTeacher;