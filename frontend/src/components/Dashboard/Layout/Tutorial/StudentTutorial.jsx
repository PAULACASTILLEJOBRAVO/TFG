import { useTranslation } from "react-i18next";
import { TutorialLayout } from ".";

const StudentTutorial = () => {
    const { t } = useTranslation();

    return (
        <TutorialLayout
            title={t("student.tutorial.title")}
        />
    );
}

export default StudentTutorial;