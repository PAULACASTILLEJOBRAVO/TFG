import { 
  DashboardHeader, 
  DashboardSidebar 
} from '@/components/Dashboard/Layout';
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