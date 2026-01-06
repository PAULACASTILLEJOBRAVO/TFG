import DashboardLayout from '@/components/Dashboard/Layout/DashboardLayout';
import DashboardContent from '@/components/Dashboard/Layout/DashboardContent';
import TeacherOverview from '@/components/Dashboard/Sections/TeacherOverview';

const DashboardTeacher = () => {
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