// import { useState } from "react";
// import Logo from "@/components/Common/Logo";
import { sidebarConfig } from "../../../config/sidebar.config";
import { 
    Sidebar, 
    // SidebarHeader, 
    SidebarMenu, 
    SidebarMenuItem,  
    SidebarMenuButton, 
    SidebarContent, 
    SidebarGroup,
    SidebarGroupContent,
    SidebarSeparator 
} from "@/components/ui/sidebar";
import { SidebarUserFooter } from "@/components/Dashboard/Layout/Sidebar"
import { useAuth } from "@/auth/AuthContext";
import { 
    useNavigate, 
    useLocation 
} from "react-router-dom";
import { logoutRequest } from "@/services/auth.service";
import { icons } from "@/utils/constants";

const DashboardSidebar = () => {
    const {user, logout } = useAuth();

    const config = sidebarConfig[user.role];

    const { pathname } = useLocation();
    const navigate = useNavigate();

    const baseItems = "justify-start hover:bg-gray-300";
    const activeItem = "bg-black text-white";
    const logoutItem = "text-red-500 hover:bg-red-50 hover:text-red-500";

    const isSidebarItemActive = (pathname, href) => {
        if(pathname === href) return true;

        return pathname.startsWith(href + "/");
    }

    const handleLogout = async () => {
        await logoutRequest();
        logout();
        navigate("/", { replace: true });
    }

    return(
        <Sidebar className="w-60 fixed top-16 left-0 h-[calc(100vh-4rem)]">
                 {/** Logo */}
                 {/* <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <div className="flex flex-col items-center justify-center py-6 gap-2">
                                <Logo/>
                            </div>
                        </SidebarMenuItem>
                    </SidebarMenu>
                 </SidebarHeader> */}
                
                <SidebarSeparator/>

                {/** Items */}
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {config.map((item, index) => {
                                    const isActive = isSidebarItemActive(pathname, item.href); // Subroutes
                                    const ActionIcon = item?.icon ? icons[item.icon] : null;

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
                                                {ActionIcon && <ActionIcon />}
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