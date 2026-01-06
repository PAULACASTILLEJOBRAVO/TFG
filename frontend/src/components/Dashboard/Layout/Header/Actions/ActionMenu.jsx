import { useState, useRef } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/auth/AuthContext";

const ActionMenu = ({icon}) => {
    const { user } = useAuth();

    if(!user) return null;

    const [open, setOpen] = useState(false);
    const timeoutRef = useRef();
    const Icon = icon;

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

                {user.role === "teacher" && (
                    <>
                        <DropdownMenuItem>
                            Crear curso
                        </DropdownMenuItem>     

                        <DropdownMenuItem>
                            Crear quiz
                        </DropdownMenuItem>               
                    </>
                )}

                {user.role === "admin" && (
                    <>
                        <DropdownMenuItem>
                            Usuarios
                        </DropdownMenuItem>     

                        <DropdownMenuItem>
                            Clickers
                        </DropdownMenuItem> 

                        <DropdownMenuItem>
                            Cursos
                        </DropdownMenuItem>     

                        <DropdownMenuItem>
                            Sesiones
                        </DropdownMenuItem> 

                        <DropdownMenuSeparator/>

                        <DropdownMenuItem>
                            Reportes
                        </DropdownMenuItem>     
                    </>
                )}

            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default ActionMenu;