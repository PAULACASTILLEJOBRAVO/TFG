import {
  DashboardLayout,
  DashboardContent
} from '@/components/Dashboard/Layout';
import { TeacherOverview } from '@/components/Dashboard/Sections';
import SerialDebugPanel from '@/components/Hardware/SerialDebugPanel';

const DashboardTeacher = () => {
  return (
    <DashboardLayout>
      <DashboardContent>
        <TeacherOverview />

        <SerialDebugPanel />
      </DashboardContent>
    </DashboardLayout>
  );
};

export default DashboardTeacher;