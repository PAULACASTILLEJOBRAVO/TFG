import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const ReceiverConnectionStep = ({ connected, loading, onConnectReceiver }) => {
    const { t } = useTranslation();

    if(connected) {
        return (
            <div className="text-green-600 text-center">
                <p><strong>{t('teacher.sessionControl.steps.receiverConnection.connected')}</strong></p>
                <p><strong>{t('teacher.sessionControl.steps.receiverConnection.listened')}</strong></p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center">
            <div className="text-center text-red-600">
                <p><strong>{t('teacher.sessionControl.steps.receiverConnection.connectReceiverDescription')}</strong></p>
                <p>{t('teacher.sessionControl.steps.receiverConnection.clickersDetectedDescription')}</p>
            </div>
         
            <Button
                onClick={onConnectReceiver}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
                {loading ? t('teacher.sessionControl.steps.receiverConnection.connectingButton') : t('teacher.sessionControl.steps.receiverConnection.connectButton')}
            </Button>
        </div>
    );
}

export default ReceiverConnectionStep;