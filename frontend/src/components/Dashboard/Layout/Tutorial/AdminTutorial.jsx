import { useTranslation } from "react-i18next";
import { TutorialLayout } from ".";

const AdminTutorial = () => {
    const { t } = useTranslation();

    return (
        <TutorialLayout
            title={t("admin.tutorial.title")}
        />
    );
}

export default AdminTutorial;