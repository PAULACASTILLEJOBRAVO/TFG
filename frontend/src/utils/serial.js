// Utility function to clean ANSI escape codes from the incoming data
export const cleanAnsi = (text) => {
    return text.replace(/\x1B\[[0-9;]*[A-Za-z]/g, '');
};

// Function to parse coordinator messages and extract relevant information
export const parseCoordinatorMessage = (line) => {
    if (line.startsWith("SUCCESS")) {
        return { type: "SUCCESS", raw: line };
    }

    if (line.startsWith("ERROR")) {
        return { type: "ERROR", raw: line };
    }

    if (line.startsWith("EVENT")) {
        const content = line.replace("EVENT:", "").trim();

        if (content.startsWith("QUESTION_ACK")) {
            return { type: "QUESTION_ACK", raw: line };
        }

        if (content.startsWith("ANSWER")) {
            const parts = content.split(",");
            return {
                type: "ANSWER",
                questionId: parts[1],
                deviceId: parts[2],
                option: parts[3],
                raw: line
            };
        }

        if (content.startsWith("TIMEOUT")) {
            return { type: "TIMEOUT", raw: line };
        }
    }

    return null; 
};