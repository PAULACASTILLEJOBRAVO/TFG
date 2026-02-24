import { useCoordinatorSerial } from "@/hooks/Hardware/useCoordinatorSerial";
import { useState } from "react";
import { Button } from "@/components/ui/button";

                {/* <button onClick={() => send("qa send_question 1 1 2 -1")}>
                    Test coordinator send command question with id 1, difficulty 1, and options 2, with no time limit
                </button>

                <button onClick={() => send("qa stop_question")}>
                    Test coordinator send command to stop current question
                </button>

                 <button onClick={() => send("qa send_question 2 2 4 30")}>
                    Test coordinator send command with question id 2, difficulty 2, and options 4, with a time limit of 30 seconds
                </button>

                <button onClick={() => send("qa status")}>
                    Test coordinator send command to get status
                </button> */}

                 {/* <button onClick={() => send("qa get_answers")}>
                    Test coordinator send command to get answers
                </button>

                 <button onClick={() => send("qa get_answers_csv")}>
                    Test coordinator send command to get answers in CSV format
                </button>
                
                await connect(); 

            listen((event) => {
                switch(event.type) {
                    case "SUCCESS":
                        console.log(event.raw);
                        break;

                    case "QUESTION_ACK":
                        console.log(event.raw);
                        break;

                    case "ANSWER":
                        console.log(event.raw);
                        break;

                    case "TIMEOUT":
                        console.log(event.raw);
                        break;

                    case "ERROR":
                        console.error(event.raw);
                        break;
                }
            });

            console.log("Listening started...");

                */}
                  

const SerialDebugPanel = () => {
    const {
        connect,
        disconnect,
        reconnect,
        send,
        listen,
        connected,
        loading,
        error
    } = useCoordinatorSerial();

    const [command, setCommand] = useState("");

    const startListening = () => {
        listen((event) => {
            switch(event.type) {
                case "SUCCESS":
                    console.log(event.raw);
                    break;

                case "QUESTION_ACK":
                    console.log(event.raw);
                    break;

                case "ANSWER":
                    console.log(event.raw);
                    break;

                case "TIMEOUT":
                    console.log(event.raw);
                    break;

                case "ERROR":
                    console.error(event.raw);
                    break;
            }
        });

        console.log("Listening started...");

    };

    return (
        <div style={{ border: "1px solid gray", padding: 16 }}>
            <h3>Serial Debug Panel</h3>

            <p>Status: {connected ? "Connected" : "Disconnected"}</p>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <Button className="mr-2 bg-yellow-500" onClick={startListening}>Listen</Button>
            <Button className="mr-2 bg-green-500" onClick={connect}>Connect</Button>
            <Button className="mr-2 bg-red-500" onClick={disconnect}>Disconnect</Button>
            <Button className="mr-2 bg-gray-500" onClick={reconnect}>Reconnect</Button>

            <div style={{ marginTop: 10 }}>
                <input
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    placeholder="Enter command"
                /> 
                <Button className="ml-2 bg-blue-500" onClick={() => send(command)}>
                    Send
                </Button>
            </div>
        </div>
    );
}

export default SerialDebugPanel; 