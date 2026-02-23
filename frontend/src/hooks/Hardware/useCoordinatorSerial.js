import { useState } from "react";
import { 
    connectCoordinator, 
    attemptReconnect, 
    disconnectCoordinator,

    listenResponse,
    sendCommand
} from "@/services/hardware/serial.service";

export const useCoordinatorSerial = () => {
    const [connected, setConnected] = useState(false); 
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false); 

    const connect = async () => {
        setLoading(true);
        setError(null);

        try {
            await connectCoordinator(); 

            setConnected(true);
        } catch (err) {
            setError(err.message || "Error connecting to coordinator");
            setConnected(false); 
        } finally {
            setLoading(false); 
        }
    };  

    const reconnect = async () => {
        setLoading(true);
        setError(null);

        try {
            await attemptReconnect(); 

            setConnected(true);
        } catch (err) {
            setError(err.message || "Error reconnecting to coordinator");
            setConnected(false); 
        } finally {
            setLoading(false); 
        }
    };

    const disconnect = async () => {
        setLoading(true);
        setError(null);

        try {
            await disconnectCoordinator();

            setConnected(false);
        } catch (err) {
            setError(err.message || "Error disconnecting from coordinator");
        }finally {
            setLoading(false); 
        }
    };

    const send = async (command) => {
        try {
            await sendCommand(command);
        } catch (err) {
            setError(err.message || "Error sending command to coordinator");
        }
    };

    const listen = async (callback) => {
        try {
            await listenResponse(callback);
        } catch (err) {
            setError(err.message || "Error listening for responses from coordinator");
        }
    };

    const stopListening = async () => {
        try {
            await stopListening();
        } catch (err) {
            setError(err.message || "Error stopping listening for responses from coordinator");
        }
    };

    return { connected, error, loading, connect, reconnect, disconnect, send, listen, stopListening };
}

