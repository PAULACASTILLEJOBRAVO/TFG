import { Button } from "@/components/ui/button";
import { 
    Tooltip, 
    TooltipContent, 
    TooltipTrigger 
} from "@/components/ui/tooltip";
import { RotateCcw } from 'lucide-react';
import { useTranslation } from "react-i18next";  

const RestoreButton = ({onClick, label }) => {
    const { t } = useTranslation();

    return(
        onClick && (
            <Tooltip>   
                <TooltipTrigger asChild>
                    <Button
                        className="[&_svg]:size-4 text-green-500 hover:text-green-600 hover:bg-green-100 "
                        variant="ghost"
                        size="icon"
                        onClick={onClick}
                    >
                        <RotateCcw />
                    </Button>
                </TooltipTrigger>

                <TooltipContent>
                    {t("common.restore")} {label}
                </TooltipContent>
            </Tooltip>
        )
    );
}

export default RestoreButton;