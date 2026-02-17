import {
  DashboardLayout,
  DashboardContent
} from '@/components/Dashboard/Layout';
import { TeacherOverview } from '@/components/Dashboard/Sections';

const DashboardTeacher = () => {
  return (
    <DashboardLayout>
      <DashboardContent>
        <TeacherOverview />
      </DashboardContent>
    </DashboardLayout>
  );
};

export default DashboardTeacher;