import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const EditButton = ({ onClick, disabled = false, label }) => {
    return(
        <Tooltip>
            <TooltipTrigger asChild>
                <Button 
                    className="[&_svg]:size-4"
                    variant="ghost"
                    size="icon"
                    onClick={onClick}
                    disabled={disabled}
                >
                    <Pencil />
                </Button>
            </TooltipTrigger>

            <TooltipContent>
                Editar {label}
            </TooltipContent>
        </Tooltip>
    );
}

export default EditButton;