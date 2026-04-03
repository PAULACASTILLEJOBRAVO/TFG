import { 
  DashboardLayout, 
  DashboardContent 
} from '@/components/Dashboard/Layout';
import { AdminOverview } from '@/components/Dashboard/Sections';

const DashboardAdmin = () => {
  return (
    <DashboardLayout>
      <DashboardContent>
        <AdminOverview />
      </DashboardContent>
    </DashboardLayout>
  );
};

export default DashboardAdmin;