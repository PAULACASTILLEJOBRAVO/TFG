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
import { 
    Calculator, 
    NotebookPen, 
    PlayCircle, 
    User, 
    Book, 
    MessageSquareWarning 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ActionMenu = ({icon}) => {
    const { user } = useAuth();

    const [open, setOpen] = useState(false);
    const timeoutRef = useRef();
    const Icon = icon;

    const navigate = useNavigate();

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
                        <DropdownMenuItem onClick={() => navigate("/dashboard_teacher/quizzes/create")}>
                            <NotebookPen />
                            Crear quiz
                        </DropdownMenuItem> 
                        
                        <DropdownMenuItem onClick={() => navigate("/dashboard_teacher/courses/create")}>
                            <Book />
                            Crear curso
                        </DropdownMenuItem>      
                    </>
                )}

                {user.role === "admin" && (
                    <>
                        <DropdownMenuItem onClick={() => navigate("/dashboard_admin/users")}>
                            <User />
                            Usuarios
                        </DropdownMenuItem>     

                        <DropdownMenuItem onClick={() => navigate("/dashboard_admin/clickers")}>
                            <Calculator />
                            Clickers
                        </DropdownMenuItem> 

                        <DropdownMenuItem onClick={() => navigate("/dashboard_admin/courses")}>
                            <Book />
                            Cursos
                        </DropdownMenuItem>     

                        <DropdownMenuItem onClick={() => navigate("/dashboard_admin/sessions")}>
                            <PlayCircle />
                            Sesiones
                        </DropdownMenuItem> 

                        <DropdownMenuSeparator/>

                        <DropdownMenuItem onClick={() => navigate("/dashboard_admin/reports")}>
                            <MessageSquareWarning />
                            Reportes
                        </DropdownMenuItem>     
                    </>
                )}

            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default ActionMenu;