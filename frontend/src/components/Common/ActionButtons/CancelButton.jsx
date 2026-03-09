import { Button } from "@/components/ui/button";
import { 
    Tooltip, 
    TooltipContent, 
    TooltipTrigger 
} from "@/components/ui/tooltip";
import { useTranslation } from "react-i18next";

const CancelButton = ({ onClick }) => {
    const { t } = useTranslation();

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
                {t("common.cancel")}
            </TooltipContent>
        </Tooltip>
    );
}

export default CancelButton;