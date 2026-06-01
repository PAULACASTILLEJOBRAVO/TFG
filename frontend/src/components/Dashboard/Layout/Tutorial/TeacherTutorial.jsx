import { useTranslation } from "react-i18next";
import { TutorialLayout } from ".";
import { pdfTutorials } from "@/utils/constants";

const TeacherTutorial = () => {
    const { t } = useTranslation();

    return (
        <TutorialLayout
            title={t("teacher.tutorial.title")}
            pdf={pdfTutorials.teacher}
        />
    );
}

export default TeacherTutorial;