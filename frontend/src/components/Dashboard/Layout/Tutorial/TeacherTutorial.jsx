import { useTranslation } from "react-i18next";
import { TutorialLayout } from ".";

const TeacherTutorial = () => {
    const { t } = useTranslation();

    return (
        <TutorialLayout
            title={t("teacher.tutorial.title")}
        />
    );
}

export default TeacherTutorial;