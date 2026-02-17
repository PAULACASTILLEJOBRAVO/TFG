import {
  DashboardLayout, 
  DashboardContent
} from '@/components/Dashboard/Layout';
import { StudentOverview } from '@/components/Dashboard/Sections';

const DashboardStudent = () => {
  return (
    <DashboardLayout>
      <DashboardContent>
        <StudentOverview />
      </DashboardContent>
    </DashboardLayout>
  );
};

export default DashboardStudent;