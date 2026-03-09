import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { 
    Tooltip, 
    TooltipContent, 
    TooltipTrigger 
} from "@/components/ui/tooltip";
import { useTranslation } from "react-i18next";

const CreateButton = ({ onClick, label }) => {
    const { t } = useTranslation();

    return(
        <Tooltip>
            <TooltipTrigger asChild>
                <Button 
                    className="[&_svg]:size-8"
                    variant="ghost"
                    size="icon"
                    onClick={onClick}
                >
                    <PlusCircle />
                </Button>
            </TooltipTrigger>

            <TooltipContent>
                {t("common.create")} {label}
            </TooltipContent>
        </Tooltip>
    );
}

export default CreateButton;