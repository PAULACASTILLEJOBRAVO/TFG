import { cleanAnsi, parseCoordinatorMessage } from "../../utils/serial";

// Variables to manage the serial port connection and data parsing
let port = null; // Variable to hold the serial port instance
let parser = null; // Variable to hold the parser instance for reading data from the serial port
let writer = null; // Variable to hold the writer instance for sending data to the serial port
let reader = null; // Variable to hold the reader instance for reading data from the serial port

// Variables to control reconnection attempts in case of connection loss
let reconnectAttempts = 0; // Variable to track the number of reconnection attempts
const MAX_RECONNECT_ATTEMPTS = 3; // Maximum number of reconnection attempts before giving up

// Variable to control whether the service is currently listening for incoming data from the coordinator device
let listening = false; // Variable to indicate whether the service is currently listening for incoming data
let buffer = ""; // Buffer to accumulate incoming data until a complete message is received
let accumulatedLines = []; // Variable to accumulate lines of data until a complete message is received
let processingMultiLine = false; // Variable to indicate whether we are currently processing multiple lines of data

// Serial services
// Service to connect to the coordinator device
export const connectCoordinator = async () => {
    if (!navigator.serial) throw new Error("Web Serial API not supported in this browser");

    if (port?.readable || port?.writable) return true; // If the port is already open, return true
   
    port = await navigator.serial.requestPort(); // Request the user to select a serial port
    await port.open({ 
        baudRate: 115200, 
        timeout: 0.1000,
    }); // Open the selected serial port with the specified baud rate

    return true;
}

// Service to attempt reconnection to the coordinator device in case of connection loss
export const attemptReconnect = async () => {
    if(!port) throw new Error("Coordinator port not initialized"); // If the port is not initialized, do not attempt to reconnect

    reconnectAttempts = 0; // Reset the reconnection attempts counter

    // Attempt to reconnect with a delay between attempts, up to the maximum number of attempts
    while (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        try {
            if (!port.readable && !port.writable) {
                await port.open({ baudRate: 115200 }); // Attempt to reopen the serial port if it's not readable or writable
            }

            return true; // Return the port instance if reconnection is successful
        } catch (error) {
            reconnectAttempts++;

            await new Promise(r => setTimeout(r, 2000)); // Wait for 2 seconds before the next reconnection attempt
        }
    }

    throw new Error("Coordinator reconnection failed");
}

// Service to disconnect from the coordinator device
export const disconnectCoordinator = async () => {
    if(!port)  throw new Error("No active serial port to disconnect"); // Close the serial port connection

    try {
        // Cancel any ongoing read or write operations and release locks on the reader and writer
        if (reader) {
            await reader.cancel();
            reader.releaseLock?.();
            reader = null;
        }

        // Release the lock on the writer and set it to null
        if (writer) {
            writer.releaseLock?.();
            writer = null;
        }

        // Close the serial port if it's open
        if (port.readable || port.writable) {
            await port.close();
        }
    }catch(error){
        console.error("Error closing coordinator port", error);
    }

    port = null; // Reset the port variable
    writer = null; // Reset the writer variable
    parser = null; // Reset the parser variable
}

// Service to send a command to the coordinator device
export const sendCommand = async (command) => {
    if (!port) throw new Error("Coordinator not connected");

    // Write the command to the serial port, appending a newline character to indicate the end of the command
    writer = port.writable.getWriter();

    await writer.write(
        new TextEncoder().encode(command + "\r\n")
    ); // Encode the command as a Uint8Array and write it to the serial port

    writer.releaseLock(); 
}

// Service to listen for incoming data from the coordinator device
export const listenResponse = async (callback) => {
    if (!port) throw new Error("Coordinator not connected");

    listening = true; 

    const decoder = new TextDecoderStream(); 
    port.readable.pipeTo(decoder.writable).catch(err => {
        console.error("Pipe error:", err);
    }); 
    parser = decoder.readable.getReader();

    while (listening) {
        const { value, done } = await parser.read();
        if (done) break;

        buffer += value;

        if (buffer.includes("\n")) { // Wait until we have a complete line of data before processing
            let lines = buffer.split("\n"); // Split the buffer into lines based on the newline character
            buffer = lines.pop(); 

            for (let line of lines) {
                line = cleanAnsi(line.trim());
                if (!line) continue;
                line = line.replace(/^qa:~\$\s*/, "");

                accumulatedLines.push(line);

                // Detect the start of a multi-line message based on specific patterns in the incoming data
                if (
                    line.startsWith("Respuestas para pregunta") ||
                    line.endsWith("respuestas:")
                ) {
                    processingMultiLine = true;
                }
            }

            let hasCompleteResponse = false;

            if (processingMultiLine) {
                let optionsCount = accumulatedLines.filter(l =>
                    l.startsWith("Opción ")
                ).length;

                if (optionsCount >= 2) {
                    hasCompleteResponse = true;
                }
            } else {
                hasCompleteResponse = true;
            }

            if (hasCompleteResponse) {
                const parsedEvents = accumulatedLines
                    .map(parseCoordinatorMessage)
                    .filter(Boolean);

                parsedEvents.forEach(event => callback(event));

                accumulatedLines = [];
                processingMultiLine = false;
            }
        }
    }
}



// Service to stop listening for incoming data from the coordinator device
export const stopListening = async () => {
    listening = false;

    if (parser) {
       await parser.cancel?.();
        parser.releaseLock?.();
        parser = null;
    }
}