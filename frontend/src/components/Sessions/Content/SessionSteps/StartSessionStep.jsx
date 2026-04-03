import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const StartSessionStep = ({ sessionStarted, presentationOpened, onStartSession }) => {
    const { t } = useTranslation();

    if(sessionStarted) {
        return (
            <div className="text-green-600 text-center">
                <p><strong>{t("teacher.sessionControl.steps.startSession.started")}</strong></p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center ">
            {presentationOpened && (
                <div className="text-red-600 text-center  mb-4">
                    <p><strong>{t("teacher.sessionControl.steps.startSession.startSessionDescription")}</strong></p>
                    <p>{t("teacher.sessionControl.steps.startSession.sessionDescription")}</p>
                </div>
            )}

            <Button
                onClick={onStartSession}
                disabled={!presentationOpened}
                className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
            >
                {t("teacher.sessionControl.steps.startSession.startButton")}
            </Button>
        </div>
    );
}

export default StartSessionStep;