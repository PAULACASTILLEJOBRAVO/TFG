import { ArrowUpFromLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
    Tooltip, 
    TooltipContent,
    TooltipTrigger 
} from "@/components/ui/tooltip";

const PublishButton = ({ onClick, label }) => {
    return (
        onClick && (
            <Tooltip>   
                <TooltipTrigger asChild>
                    <Button
                        className="[&_svg]:size-4 text-green-500 hover:text-green-600 hover:bg-green-100 "
                        variant="ghost"
                        size="icon"
                        onClick={onClick}
                    >
                        <ArrowUpFromLine />
                    </Button>
                </TooltipTrigger>

                <TooltipContent>
                    Publicar {label}
                </TooltipContent>
            </Tooltip>
        )
    );
}

export default PublishButton;