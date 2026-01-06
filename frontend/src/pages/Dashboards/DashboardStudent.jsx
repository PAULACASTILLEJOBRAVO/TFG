import DashboardLayout from '@/components/Dashboard/Layout/DashboardLayout';
import DashboardContent from '@/components/Dashboard/Layout/DashboardContent';
import StudentOverview from '@/components/Dashboard/Sections/StudentOverview';

const DashboardStudent = () => {
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