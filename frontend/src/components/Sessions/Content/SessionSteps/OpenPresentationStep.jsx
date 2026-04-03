import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const OpenPresentationStep = ({ presentationOpened, connected, onOpenPresentation }) => {
    const { t } = useTranslation();

    if(presentationOpened) {
        return (
            <div className="text-green-600 text-center">
                <p><strong>{t("teacher.sessionControl.steps.openPresentation.opened")}</strong></p>
            </div>
        );
    }

    return (
        <div className="flex flex-col  items-center ">
            {connected && (
                <div className="text-red-600 text-center mb-4">
                    <p><strong>{t("teacher.sessionControl.steps.openPresentation.openPresentationDescription")}</strong></p>
                    <p>{t("teacher.sessionControl.steps.openPresentation.presentationDescription")}</p>
                </div>
            )}

            <Button
                onClick={onOpenPresentation}
                disabled={!connected}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                {t("teacher.sessionControl.steps.openPresentation.openButton")}
            </Button>
        </div>
    );
}

export default OpenPresentationStep;