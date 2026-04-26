import { 
    useState, 
    useRef 
} from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useAuth } from "@/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { logoutRequest } from "@/services/auth.service";
import { headerProfileMenuConfig } from "@/config/headerProfileMenu";
import { icons } from "@/utils/constants";
import { useTranslation } from "react-i18next";

const ProfileMenu = () => {
    const { user, logout } = useAuth();

    const [open, setOpen] = useState(false);
    const timeoutRef = useRef();

    const navigate = useNavigate();

    const { t } = useTranslation();

    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setOpen(true);
    }

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => setOpen(false), 200);
    }

    const handleLogout = async () => {
        await logoutRequest();
        logout();
        navigate("/", { replace: true });
    }

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <Button variant="ghost" size="icon">
                    <User />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent 
                align="end" 
                className="w-30" 
                onMouseEnter={handleMouseEnter} 
                onMouseLeave={handleMouseLeave}
                onClick={() => setOpen(false)}
            >

            {headerProfileMenuConfig.map((item, index) => {
                if(item.separator) return <DropdownMenuSeparator key={index} className="my-1" />;

                const Icon = item?.icon ? icons[item.icon] : null;

                return(
                    <DropdownMenuItem 
                        key={index}
                        className={`
                            ${item.action === "logout" ? "text-red-500 hover:!bg-red-50 hover:!text-red-500" : ""}
                        `}
                        onClick={item.action === "logout" ? handleLogout : () =>  navigate(item.path(user))}
                    >
                        {Icon && <Icon />}
                        {t(item.labelKey)}
                    </DropdownMenuItem>
                );
            })}    
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default ProfileMenu;