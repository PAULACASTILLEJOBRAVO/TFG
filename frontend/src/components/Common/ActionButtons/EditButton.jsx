import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { 
    Tooltip, 
    TooltipContent, 
    TooltipTrigger 
} from "@/components/ui/tooltip";
import { useTranslation } from "react-i18next";

const EditButton = ({ onClick, label }) => {
    const { t } = useTranslation();

    return(
        <Tooltip>
            <TooltipTrigger asChild>
                <Button 
                    className="[&_svg]:size-4 hover:text-blue-600 hover:bg-blue-100"
                    variant="ghost"
                    size="icon"
                    onClick={onClick}
                >
                    <Pencil />
                </Button>
            </TooltipTrigger>

            <TooltipContent>
                {t("common.edit")} {label}
            </TooltipContent>
        </Tooltip>
    );
}

export default EditButton;