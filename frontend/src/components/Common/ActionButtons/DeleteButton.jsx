import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { 
    Tooltip, 
    TooltipContent, 
    TooltipTrigger 
} from "@/components/ui/tooltip";
import { useTranslation } from "react-i18next";

const DeleteButton = ({ onClick, label }) => {
    const { t } = useTranslation();

    return(
        <Tooltip>
            <TooltipTrigger asChild>
                <Button 
                    className="[&_svg]:size-4 text-red-500 hover:text-red-60 hover:bg-red-100"
                    variant="ghost"
                    size="icon"
                    onClick={onClick}
                >
                    <Trash2 />
                </Button>
            </TooltipTrigger>

            <TooltipContent>
                {t("common.delete")} {label}
            </TooltipContent>
        </Tooltip>
    );
}

export default DeleteButton;