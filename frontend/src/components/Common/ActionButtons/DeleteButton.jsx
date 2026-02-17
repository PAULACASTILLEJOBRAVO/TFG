import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { 
    Tooltip, 
    TooltipContent, 
    TooltipTrigger 
} from "@/components/ui/tooltip";

const DeleteButton = ({ onClick, label }) => {
    return(
        <Tooltip>
            <TooltipTrigger asChild>
                <Button 
                    className="[&_svg]:size-4 text-red-500 hover:text-red-60 hover:bg-red-100"
                    variant="ghost"
                    size="icon"
                    onClick={onClick}
                >
                    <Trash2 />
                </Button>
            </TooltipTrigger>

            <TooltipContent>
                Eliminar {label}
            </TooltipContent>
        </Tooltip>
    );
}

export default DeleteButton;