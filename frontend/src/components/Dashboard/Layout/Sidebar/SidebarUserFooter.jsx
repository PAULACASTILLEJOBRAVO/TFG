import { 
    SidebarFooter, 
    SidebarMenu, 
    SidebarMenuItem 
} from "@/components/ui/sidebar";
import { useAuth } from "@/auth/AuthContext";
import { UserAvatar } from ".";

const SidebarUserFooter = () => {
    const {user} = useAuth();

    return(
        <SidebarFooter className="border-t">
            <SidebarMenu>
                <SidebarMenuItem>
                    <div className="flex items-center gap-3 px-4 py-3">
                        {/** Avatar */}
                        <UserAvatar
                            name={user.username}
                            avatar={user.profilePicture}
                            size="md"
                        />

                        {/** Name + Status */}
                        <div className="flex-1 leading-tight">
                            <p className="text-sm font-medium">
                                {user?.username ?? "Usuario"}
                            </p>
                            <p className="text-xs text-green-500">
                                ● Conectado
                            </p>
                        </div>
                    </div>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
    );
}

export default SidebarUserFooter;