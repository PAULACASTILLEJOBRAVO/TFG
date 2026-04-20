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
import { useAuth } from "@/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { headerActionMenuConfig } from "@/config/headerActionMenu.config";
import { icons } from "@/utils/constants";
import { useTranslation } from "react-i18next";

const ActionMenu = ({icon}) => {
    const { user } = useAuth();

    const config = headerActionMenuConfig[user.role];

    const [open, setOpen] = useState(false);
    const timeoutRef = useRef();
    const Icon = icon;

    const navigate = useNavigate();

    const { t } = useTranslation();

    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setOpen(true);
    }

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => setOpen(false), 200);
    }

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger 
                asChild 
                onMouseEnter={handleMouseEnter} 
                onMouseLeave={handleMouseLeave}
            >
                <Button variant="ghost" size="icon">
                    <Icon />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent 
                align="end" 
                className="w-30" 
                onMouseEnter={handleMouseEnter} 
                onMouseLeave={handleMouseLeave} 
                onClick={() => setOpen(false)}
            >
                {config.map((item, index) => {
                    if(item.separator) return <DropdownMenuSeparator key={index} className="my-1" />;

                    const ItemIcon = item?.icon ? icons[item.icon] : null;
                    
                    return(
                        <DropdownMenuItem 
                            key={index} 
                            onClick={() => navigate(item.path)}
                        >
                            {ItemIcon && <ItemIcon className="me-2" />}
                            {t(item.labelKey)}
                        </DropdownMenuItem>
                    )
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default ActionMenu;