import { Button } from "@/components/ui/button";
import { Archive } from "lucide-react";
import { 
    Tooltip, 
    TooltipContent, 
    TooltipTrigger 
} from "@/components/ui/tooltip";
import { useTranslation } from "react-i18next";

const ArchiveButton = ({ onClick, label }) => {
    const { t } = useTranslation();

    return(
        <Tooltip>
            <TooltipTrigger asChild>
                <Button 
                    className="[&_svg]:size-4 text-red-500 bg-transparent hover:bg-white hover:text-red-600"
                    variant="ghost"
                    size="icon"
                    onClick={onClick}
                >
                    <Archive />
                </Button>
            </TooltipTrigger>

            <TooltipContent>
                {t("common.archive")} {label}
            </TooltipContent>
        </Tooltip>
    );
}

export default ArchiveButton;