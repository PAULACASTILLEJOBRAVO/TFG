import { Button } from "@/components/ui/button";
import { 
    Plus,
    Trophy,
    FileText
} from "lucide-react";

import { headerConfig } from "../../config/header.config";

import LanguageMenu from "./Actions/LanguageMenu";
import ProfileMenu from "./Actions/ProfileMenu";
import ActionMenu from "./Actions/ActionMenu";
import NotificationMenu from "./Actions/NotificationMenu";
import { useAuth } from "@/auth/AuthContext";

const icons = {
    trophy: Trophy,
    plus: Plus,
    file: FileText,
}

const HeaderActions = () => {
    const { user } = useAuth();

    if(!user) return null;

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