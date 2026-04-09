import { 
    cleanAnsi, 
    parseCoordinatorMessage,
    parseResultBlock
} from "../../utils/serial";

// Variables to manage the serial port connection and data parsing
let port = null; // Variable to hold the serial port instance
let writer = null; // Variable to hold the writer instance for sending data to the serial port
let writeQueue = Promise.resolve(); // Queue to ensure that write operations to the serial port are executed sequentially
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
    }); // Open the selected serial port with the specified baud rate

    // Write the command to the serial port, appending a newline character to indicate the end of the command
    writer = port.writable.getWriter();

    return true;
}

// Service to attempt reconnection to the coordinator device in case of connection loss
export const attemptReconnect = async () => {
    if (!port) {
        const ports = await navigator.serial.getPorts();

        if (ports.length === 0) throw new Error("Coordinator port not initialized");

        port = ports[0];
    }

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
        // Cancel any ongoing listening operations and release locks on the reader and writer
        listening = false;

        if (writer) {
            try {
                writer.releaseLock();
            } catch {
                console.warn("Writer was already released or canceled");
            }
            writer = null;
        }

        if (reader) {
            try {
                await reader.cancel();
                reader.releaseLock();
            } catch {
                console.warn("Reader was already released or canceled");
            }
            reader = null;
        }

        // Close the serial port if it's open
        if (port.readable || port.writable) {
            await port.close();
        }

        console.warn("Coordinator port disconnected successfully");
    }catch(error){
        console.error("Error closing coordinator port", error);
    }

    port = null; // Reset the port variable
}

// Service to send a command to the coordinator device
export const sendCommand = async (command) => {
    if (!port) throw new Error("Coordinator not connected");
    if( !writer) throw new Error("Writer not actived");

    writeQueue = writeQueue.then(() =>
        writer.write(new TextEncoder().encode(command + "\r\n")) // Encode the command as a Uint8Array and write it to the serial port
    );

    return writeQueue.catch(err => {
        console.error("Serial write failed", err);
        throw err;
    });
}

// Service to listen for incoming data from the coordinator device
export const listenResponse = async (callback) => {
    if (!port) throw new Error("Coordinator not connected");
    if (reader) return; // If a reader is already active, return to avoid multiple listeners

    listening = true; 

    reader = port.readable.getReader(); // Get a reader instance to read data from the serial port

    const decoder = new TextDecoder(); // Create a TextDecoder instance to decode incoming data from the serial port

    let blockTimer = null; // Timer to detect the end of a multi-line block of data

    while (listening) {
        const { value, done } = await reader.read();
        if (done) break;
        if(!value) continue;

        buffer += decoder.decode(value, { stream: true }); // Decode the incoming data and append it to the buffer
       
        while (buffer.includes("\n")) { // Check if the buffer contains a complete line of data (indicated by a newline character)
            let index = buffer.indexOf("\n"); // Find the index of the first newline character in the buffer
            let line = buffer.slice(0, index).trim(); // Extract the line of data from the buffer and trim any whitespace
            buffer = buffer.slice(index + 1); // Remove the processed line from the buffer
            
            line = cleanAnsi(line);
            if (!line) continue;
            line = line.replace(/^qa:~\$\s*/, "");

            // Start of multi-line result message, wait for complete response
            if (line.startsWith("Respuestas para pregunta")) {
                processingMultiLine = true;
                accumulatedLines = [line]; // reinicia bloque
                continue;
            }

            // If we are processing a multi-line block, accumulate lines until we reach the end of the block (indicated by a line that does not start with "Opción ")
            if (processingMultiLine) {
                if (line.startsWith("Opción ")) {
                    accumulatedLines.push(line);
                    
                    clearTimeout(blockTimer);

                    blockTimer = setTimeout(() => {
                        // End of multi-line block, parse only if there are at least 2 options
                        if (processingMultiLine && accumulatedLines.length > 1) {
                            const event = parseResultBlock(accumulatedLines);
                            callback(event);  

                            accumulatedLines = [];
                            processingMultiLine = false;
                        }
                    }, 500); // Wait for half a second after the last option line to ensure we have received the complete block before parsing
                }
                continue;
            }

            // Normal line outside of block
            const parsed = parseCoordinatorMessage(line);
            if (parsed) callback(parsed);
        }
    }
}

// Service to stop listening for incoming data from the coordinator device
export const stopListening = async () => {
    listening = false;

    if (reader) {
        await reader.cancel?.();
        reader.releaseLock?.();
        reader = null;
    }
}