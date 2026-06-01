import { useTranslation } from "react-i18next";
import { TutorialLayout } from ".";
import { pdfTutorials } from "@/utils/constants";

const StudentTutorial = () => {
    const { t } = useTranslation();

    return (
        <TutorialLayout
            title={t("student.tutorial.title")}
            pdf={pdfTutorials.student}
        />
    );
}

export default StudentTutorial;