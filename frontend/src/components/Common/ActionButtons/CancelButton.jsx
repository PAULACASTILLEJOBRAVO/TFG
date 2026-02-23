import { Button } from "@/components/ui/button";
import { 
    Tooltip, 
    TooltipContent, 
    TooltipTrigger 
} from "@/components/ui/tooltip";

const CancelButton = ({ onClick }) => {
    return(
        <Tooltip>
            <TooltipTrigger asChild>
                <Button 
                    className="[&_svg]:size-4 text-red-500 hover:text-red-600 hover:bg-red-100"
                    variant="ghost"
                    size="icon"
                    onClick={onClick}
                >
                    X
                </Button>
            </TooltipTrigger>

            <TooltipContent>
                Cancelar
            </TooltipContent>
        </Tooltip>
    );
}

export default CancelButton;