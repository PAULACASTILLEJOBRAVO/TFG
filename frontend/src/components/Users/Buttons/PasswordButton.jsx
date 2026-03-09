import { Button } from "@/components/ui/button";
import { KeyRound } from "lucide-react";
import { 
    Tooltip, 
    TooltipContent, 
    TooltipTrigger 
} from "@/components/ui/tooltip";
import { useTranslation } from "react-i18next";

const PasswordButton = ({ onClick }) => {
    const { t } = useTranslation();

    return(
        <div className="flex justify-center items-center gap-2">
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button 
                        className="[&_svg]:size-4 hover:text-yellow-500 hover:bg-yellow-100"
                        variant="ghost"
                        size="icon"
                        onClick={onClick}
                    >
                        <KeyRound />
                    </Button>
                </TooltipTrigger>

                <TooltipContent>
                    {t("common.changePassword")}
                </TooltipContent>
            </Tooltip>
        </div>
    );
}

export default PasswordButton;