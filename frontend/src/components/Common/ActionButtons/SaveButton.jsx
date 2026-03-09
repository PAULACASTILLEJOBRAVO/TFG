import { Button } from "@/components/ui/button";
import { 
    Tooltip, 
    TooltipContent, 
    TooltipTrigger 
} from "@/components/ui/tooltip";
import { Save } from 'lucide-react';
import { useTranslation } from "react-i18next"; 

const SaveButton = ({ onClick }) => {
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
                        <Save />
                    </Button>
                </TooltipTrigger>

                <TooltipContent>
                    {t("common.save")}
                </TooltipContent>
            </Tooltip>
        )
    );
}

export default SaveButton;