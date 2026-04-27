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
                letter: parts[3],
                raw: line
            };
        }

        if (content.startsWith("TIMEOUT")) {
            return { type: "TIMEOUT", raw: line };
        }

        if(content.startsWith("STOP_QUESTION")) {
            const parts = content.split(",");
            return { 
                type: "STOP_QUESTION", 
                questionId: parts[1],
                raw: line 
            }
        }
    }

    return null; 
};

// Function to clean ANSI escape codes from incoming data lines
export const parseResultBlock = (lines) => {
    if (!lines || lines.length === 0) return null;
    
    const questionLine = lines[0];
    const questionIdMatch = questionLine.match(/pregunta (\d+)/);
    const questionId = questionIdMatch ? questionIdMatch[1] : null;

    const options = lines
        .slice(1) // Todas las líneas después de "Respuestas para pregunta..."
        .filter(l => l.startsWith("Opción "))
        .map(l => {
            const [optionPart, countPart] = l.split(":");
            return {
                letter: optionPart.replace("Opción ", "").trim(),
                count: parseInt(countPart.replace("respuestas", "").trim())
            };
        });

    return { type: "RESULT", questionId, options, raw: lines.join("\n") };
};