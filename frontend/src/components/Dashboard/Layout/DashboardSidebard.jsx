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

const DashboardSidebar = ({userRole}) => {
    const config = sidebarConfig[userRole];

    return(
        <SidebarProvider>            
            <Sidebar className="w-60">
                 {/** Logo */}
                 <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <div className="px-6 py-4">
                                <Logo size="10"/>
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

                <SidebarSeparator/>

                {/** Footer */}
                <SidebarUserFooter />
            </Sidebar>

            <SidebarTrigger/>
        </SidebarProvider>
    );
}

export default DashboardSidebar;