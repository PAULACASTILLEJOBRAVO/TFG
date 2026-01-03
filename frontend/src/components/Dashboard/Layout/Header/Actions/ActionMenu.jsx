import { useState, useRef } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const ActionMenu = ({userRole, icon}) => {
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

                {userRole === "teacher" && (
                    <>
                        <DropdownMenuItem>
                            Crear curso
                        </DropdownMenuItem>     

                        <DropdownMenuItem>
                            Crear quiz
                        </DropdownMenuItem>               
                    </>
                )}

                {userRole === "admin" && (
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