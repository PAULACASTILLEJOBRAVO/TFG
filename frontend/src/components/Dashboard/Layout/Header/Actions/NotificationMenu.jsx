import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const NotificationMenu = ({unreadCount = 0}) => {
    return(
        <div className="relative inline-block">
            <Button variant="ghost" size="icon">
                <Bell/>

                {unreadCount > 0 && (
                    <Badge 
                        className="absolute -top-0.5 -right-0.5 rounded-lg px-1 py-0"
                        variant="destructive"
                        size="sm"
                    >
                        {unreadCount}
                    </Badge>
                )}
            </Button>
        </div>
    );
}

export default NotificationMenu;