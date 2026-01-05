import Logo from "@/components/Common/Logo";
import { sidebarConfig } from "../config/sidebar.config";
import { 
    SidebarProvider,
    Sidebar, 
    SidebarTrigger, 
    SidebarHeader, 
    SidebarMenu, 
    SidebarMenuItem,  
    SidebarMenuButton, 
    SidebarContent, 
    SidebarGroup,
    SidebarGroupContent,
    SidebarSeparator 
} from "@/components/ui/sidebar";
import SidebarUserFooter from "@/components/Dashboard/Layout/Sidebar/SidebarUserFooter"
import { useAuth } from "@/auth/AuthContext";

const DashboardSidebar = () => {
    const {user} = useAuth();

    if(!user) return null;

    const config = sidebarConfig[user.role];

    return(
        <SidebarProvider>            
            <Sidebar className="w-60">
                 {/** Logo */}
                 <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <div className="flex flex-col items-center justify-center py-6 gap-2">
                                <Logo/>
                            </div>
                        </SidebarMenuItem>
                    </SidebarMenu>
                 </SidebarHeader>
                
                <SidebarSeparator/>

                {/** Items */}
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {config.map((item, index) => (
                                    <SidebarMenuItem key={index}>
                                        <SidebarMenuButton className="justify-start">
                                            {item.label}
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

                {/** Footer */}
                <SidebarUserFooter />
            </Sidebar>

            <SidebarTrigger/>
        </SidebarProvider>
    );
}

export default DashboardSidebar;