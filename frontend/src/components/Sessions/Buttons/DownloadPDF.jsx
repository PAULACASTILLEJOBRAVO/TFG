import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { 
    Tooltip, 
    TooltipContent, 
    TooltipTrigger 
} from "@/components/ui/tooltip";
import { generatePDFReview } from "@/utils/sessions";

const DownloadPDF = ({ session, quiz }) => {
    const { t } = useTranslation();

    return (
        <div className="self-start">
            <Tooltip>   
                <TooltipTrigger asChild>
                <Button 
                    size="sm"
                    className="text-blue-500 hover:text-blue-600 hover:bg-blue-100 flex items-center gap-1"
                    variant="ghost"
                    onClick={() => generatePDFReview({ session, quiz, t })}
                >
                    {t("common.sessionHistory.sessionReview.downloadPDF")}
                </Button>
                </TooltipTrigger>

                <TooltipContent>
                    {t("common.sessionHistory.sessionReview.description")}
                </TooltipContent>
            </Tooltip>
        </div>
    );
}

export default DownloadPDF;