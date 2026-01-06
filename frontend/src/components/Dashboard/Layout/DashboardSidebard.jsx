import { useState } from "react";
import Logo from "@/components/Common/Logo";
import { sidebarConfig } from "../config/sidebar.config";
import { 
    Sidebar, 
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
import { useNavigate } from "react-router-dom";

const DashboardSidebar = () => {
    const {user, logout} = useAuth();

    if(!user) return null;
    
    const [activeItem, setActiveItem] = useState("Inicio");

    const config = sidebarConfig[user.role];

    const navigate = useNavigate();


    const baseClasses = "justify-start hover:bg-gray-300";
    const activeClasses = "bg-black text-white";
    const logoutClasses = "text-red-500 hover:bg-red-50 hover:text-red-500";


    const handleLogout = () => {
        logout();
        navigate("/")
    }

    return(
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
                                {config.map((item, index) => {
                                    const isActive = activeItem === item.label;

                                    return(
                                        <SidebarMenuItem key={index}>
                                            <SidebarMenuButton 
                                                className={`
                                                    ${baseClasses}
                                                    ${isActive ? activeClasses : ""}
                                                    ${item.action === "logout" ? logoutClasses : ""}
                                                `}
                                                onClick={item.action === "logout" ? handleLogout : () => setActiveItem(item.label)}
                                            >
                                                {item.label}
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    )
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

                {/** Footer */}
                <SidebarUserFooter />
            </Sidebar>
    );
}

export default DashboardSidebar;