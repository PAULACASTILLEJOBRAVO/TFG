import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const CreateButton = ({ onClick, label }) => {
    return(
        <Tooltip>
            <TooltipTrigger asChild>
                <Button 
                    className="[&_svg]:size-8"
                    variant="ghost"
                    size="icon"
                    onClick={onClick}
                >
                    <PlusCircle />
                </Button>
            </TooltipTrigger>

            <TooltipContent>
                Crear {label}
            </TooltipContent>
        </Tooltip>
    );
}

export default CreateButton;