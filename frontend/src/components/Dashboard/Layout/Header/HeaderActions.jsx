import { Button } from "@/components/ui/button";

import { headerConfig } from "@/config/header.config";

import { 
    LanguageMenu, 
    ProfileMenu, 
    ActionMenu, 
    NotificationMenu
} from "./Actions";

import { useAuth } from "@/auth/AuthContext";
import { icons } from "@/utils/constants";

const HeaderActions = () => {
    const { user } = useAuth();

    const config = headerConfig[user.role];
    const ActionIcon = config?.actionIcon ? icons[config.actionIcon] : null;

    return (
        <div className="flex items-center gap-3">            
            {ActionIcon && config?.actionType === "button" && (
                <Button variant="ghost" size="icon">
                    <ActionIcon />
                </Button>
            )}

            {ActionIcon && config?.actionType === "menu" && (
                <ActionMenu icon={ActionIcon} />
            )}

            <NotificationMenu unreadCount="2"/>

            <LanguageMenu/>

            <ProfileMenu/>
        </div>
    )
}

export default HeaderActions;