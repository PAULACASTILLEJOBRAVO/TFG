import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

const QuizzCreateFooter = ({ onPublish, onDraft, onEdit }) => {
    const { t } = useTranslation();

    return (
        <CardFooter className="flex items-end justify-end gap-3 pt-3">
            {onPublish && (<Button className="bg-green-500 hover:bg-green-500" onClick={onPublish}>
                {t("common.publish")} {t("teacher.quizzesManagement.labelButton")}
            </Button>)}

            {onDraft && (<Button variant="outline" onClick={onDraft}>
                {t("common.saveDraft")}
            </Button>)}

            {onEdit && (
                <Button className="bg-green-500 hover:bg-green-500" onClick={onEdit}>
                    {t("common.save")} {t("teacher.quizzesManagement.labelButton")} 
                </Button>
            )}

            {onEdit && (
                <Button variant="outline" onClick={() => window.history.back()}>
                    {t("common.cancelEdit")}
                </Button>
            )}
        </CardFooter>
    );
};

export default QuizzCreateFooter;