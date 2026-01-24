import { Button } from "@/components/ui/button";
import { Undo2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from "react-router-dom";

const BackButton = ({ href, label }) => {
    return(
        <Tooltip>
            <TooltipTrigger asChild>
                <Button 
                    className="[&_svg]:size-5"
                    variant="ghost"
                    size="icon"
                >
                    <Link to={href}>
                        <Undo2 />
                    </Link>
                </Button>
            </TooltipTrigger>

            <TooltipContent>
                Volver a {label}
            </TooltipContent>
        </Tooltip>
    );
}

export default BackButton;