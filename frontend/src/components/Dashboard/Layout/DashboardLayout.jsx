import DashboardHeader from '@/components/Dashboard/Layout/DashboardHeader';
import DashboardSidebar from '@/components/Dashboard/Layout/DashboardSidebard';
import { 
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";

const DashboardLayout = ({children}) => {
  return(
    <div>
        <DashboardHeader />
        
        <SidebarProvider> 
          <DashboardSidebar />
          <SidebarTrigger/>
          
          
          {/** Main content */}
              {children}
        </SidebarProvider> 
    </div>
  );
};

export default DashboardLayout;