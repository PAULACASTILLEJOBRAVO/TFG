import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { 
    Tooltip, 
    TooltipContent, 
    TooltipTrigger 
} from "@/components/ui/tooltip";
import { useTranslation } from "react-i18next";

const ChangePhotoButton = ({ onClick }) => {
    const { t } = useTranslation();

    return(
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    className="absolute bottom-0 right-0 h-8 w-8 rounded-full shadow-md"
                    onClick={onClick}
                >
                    <Pencil />
                </Button>
            </TooltipTrigger>

            <TooltipContent>
                {t("common.changePhoto")}
            </TooltipContent>
        </Tooltip>
    );
}

export default ChangePhotoButton;