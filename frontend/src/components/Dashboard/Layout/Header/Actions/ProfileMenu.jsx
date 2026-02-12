import { useState, useRef } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogOut, Settings, User, UserRoundPen } from "lucide-react";
import { useAuth } from "@/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { logoutRequest } from "@/services/auth.service";

const ProfileMenu = () => {
    const { logout } = useAuth();

    const [open, setOpen] = useState(false);
    const timeoutRef = useRef();

    const navigate = useNavigate();

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
        navigate("/");
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
                <DropdownMenuItem>
                    <UserRoundPen />
                    Profile
                </DropdownMenuItem>

                <DropdownMenuItem>
                    <Settings />
                    Settings
                </DropdownMenuItem>

                <DropdownMenuSeparator/>

                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                    <LogOut />
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default ProfileMenu;