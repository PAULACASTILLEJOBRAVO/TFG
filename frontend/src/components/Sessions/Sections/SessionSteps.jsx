import {
    ReceiverConnectionStep,
    OpenPresentationStep,
    StartSessionStep
} from "../Content/SessionSteps";

const SessionSteps = ({ presentationOpened, sessionStarted, connected, loadingSerial, onConnectReceiver, onOpenPresentation, onStartSession }) => {
    return (
        <div className="flex flex-col items-center gap-2 mt-4 max-w-xl mx-auto">
            <ReceiverConnectionStep 
                connected={connected}
                loading={loadingSerial}
                onConnectReceiver={onConnectReceiver} 
            />

            <OpenPresentationStep 
                presentationOpened={presentationOpened} 
                connected={connected}
                onOpenPresentation={onOpenPresentation} 
            />

            <StartSessionStep 
                sessionStarted={sessionStarted} 
                presentationOpened={presentationOpened}
                onStartSession={onStartSession} 
            />
        </div>
    );
}

export default SessionSteps;