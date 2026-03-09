import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

const QuizStatusChip = ({ status }) => {
    const { t } = useTranslation();

    if(status === 'archived') {
        return (
            <Badge variant="destructive">
                {t('teacher.quizzesManagement.detailsCard.archived')}
            </Badge>
        );
    }

    if(status === 'draft') {
        return (
            <Badge variant="secondary">
                {t('teacher.quizzesManagement.detailsCard.draft')}
            </Badge>
        );
    }

    if(status === 'published') {
        return (
            <Badge className="bg-green-500 hover:bg-green-500">
                {t('teacher.quizzesManagement.detailsCard.published')}
            </Badge>
        );
    }

    return(
        <Badge variant="outline">
            {t('teacher.quizzesManagement.detailsCard.unknown')}
        </Badge>
    );
}

export default QuizStatusChip;