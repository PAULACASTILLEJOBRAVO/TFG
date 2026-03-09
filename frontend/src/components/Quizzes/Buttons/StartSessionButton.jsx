import { PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
    Tooltip, 
    TooltipContent, 
    TooltipTrigger 
} from "@/components/ui/tooltip";
import { useTranslation } from "react-i18next";

const StartSessionButton = ({ onClick, label }) => {
    const { t } = useTranslation();

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
                    {t("common.start")} {label}
                </TooltipContent>
            </Tooltip>
        )
    );
}

export default StartSessionButton;