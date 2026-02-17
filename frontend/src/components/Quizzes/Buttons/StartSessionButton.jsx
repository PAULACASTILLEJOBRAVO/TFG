import { PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
    Tooltip, 
    TooltipContent, 
    TooltipTrigger 
} from "@/components/ui/tooltip";

const StartSessionButton = ({ onClick, label }) => {
    return (
        onClick && (
            <Tooltip>   
                <TooltipTrigger asChild>
                    <Button
                        className="[&_svg]:size-4 text-blue-500 hover:text-blue-600 hover:bg-blue-100 "
                        variant="ghost"
                        size="icon"
                        onClick={onClick}
                    >
                        <PlayCircle />
                    </Button>
                </TooltipTrigger>

                <TooltipContent>
                    Iniciar {label}
                </TooltipContent>
            </Tooltip>
        )
    );
}

export default StartSessionButton;