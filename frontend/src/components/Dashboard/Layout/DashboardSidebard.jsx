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
import { useNavigate, useLocation } from "react-router-dom";
import { logoutRequest } from "@/services/auth.service";

const DashboardSidebar = () => {
    const {user, logout} = useAuth();

    if(!user) return null;

    const config = sidebarConfig[user.role];

    const location = useLocation();
    const navigate = useNavigate();

    const baseItems = "justify-start hover:bg-gray-300";
    const activeItem = "bg-black text-white";
    const logoutItem = "text-red-500 hover:bg-red-50 hover:text-red-500";


    const handleLogout = async () => {
        await logoutRequest();
        logout();
        navigate("/");
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
                                    // const isActive = location.pathname.startsWith(item.href); // Subroutes?
                                    const isActive = location.pathname === item.href;

                                    return(
                                        <SidebarMenuItem key={index}>
                                            <SidebarMenuButton 
                                                className={`
                                                    ${baseItems}
                                                    ${isActive ? activeItem : ""}
                                                    ${item.action === "logout" ? logoutItem : ""}
                                                `}
                                                onClick={item.action === "logout" ? handleLogout : () => navigate(item.href)}
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