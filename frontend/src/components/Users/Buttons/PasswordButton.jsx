import { Button } from "@/components/ui/button";
import { KeyRound } from "lucide-react";
import { 
    Tooltip, 
    TooltipContent, 
    TooltipTrigger 
} from "@/components/ui/tooltip";

const PasswordButton = ({ onClick }) => {
    return(
        <div className="flex justify-center items-center gap-2">
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button 
                        className="[&_svg]:size-4"
                        variant="ghost"
                        size="icon"
                        onClick={onClick}
                    >
                        <KeyRound />
                    </Button>
                </TooltipTrigger>

                <TooltipContent>
                    Cambiar contraseña
                </TooltipContent>
            </Tooltip>
        </div>
    );
}

export default PasswordButton;