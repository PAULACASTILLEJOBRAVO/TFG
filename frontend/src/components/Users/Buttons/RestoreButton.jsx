import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { RotateCcw } from 'lucide-react'  

const RestoreButton = ({onClick, label, disabled}) => {
    return(
        onClick && (
            <Tooltip>   
                <TooltipTrigger asChild>
                    <Button
                        className="[&_svg]:size-4 text-green-500 hover:text-green-600 hover:bg-green-100 "
                        variant="ghost"
                        size="icon"
                        onClick={onClick}
                        disabled={disabled}
                    >
                        <RotateCcw />
                    </Button>
                </TooltipTrigger>

                <TooltipContent>
                    Restaurar {label}
                </TooltipContent>
            </Tooltip>
        )
    );
}

export default RestoreButton;