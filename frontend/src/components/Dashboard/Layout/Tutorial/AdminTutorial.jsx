import { useTranslation } from "react-i18next";
import { TutorialLayout } from ".";
import { pdfTutorials } from "@/utils/constants";

const AdminTutorial = () => {
    const { t } = useTranslation();

    return (
        <TutorialLayout
            title={t("admin.tutorial.title")}
            pdf={pdfTutorials.admin}
        />
    );
}

export default AdminTutorial;