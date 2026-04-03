import { 
    useState, 
    useEffect 
} from "react";
import { Clock } from "lucide-react";

const CountdownTimer = ({ timeLimit, questionActive, onTimeEnd }) => {
    const [timer, setTimer] = useState(timeLimit ?? 0);

    useEffect(() => {
        setTimer(timeLimit); // Reset timer when timeLimit changes
    }, [timeLimit]);

    useEffect(() => {
        if (!questionActive || timer <= 0) return; // If question is not active or timer is already at 0, do nothing
        
        const interval = setInterval(() => {
            setTimer(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }

                return prev - 1;
            });
        }, 1000); // Decrease timer every second

        return () => clearInterval(interval); // Clean up the interval on unmount or when question changes
    }, [questionActive]);

    useEffect(() => {
        if(timer === 0 && questionActive) {
            onTimeEnd(); // Call the onTimeEnd callback when timer reaches 0
        }
    }, [timer, questionActive, onTimeEnd]);

    // Convert seconds to minutes and seconds format
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;

    // Determine color based on remaining time
    let colorClass = "text-green-600"; // Default color
    if (timer <= timeLimit * 0.5 && timer > 5) colorClass = "text-yellow-500"; // Half time
    if (timer <= 5) colorClass = "text-red-600 animate-pulse"; // Last 5 seconds

    return (
        <div className={`flex flex-cols items-center text-lg font-medium ${colorClass}`}>
            <Clock className="w-5 h-5" />
            <span>{minutes.toString().padStart(2,"0")}:{seconds.toString().padStart(2,"0")}</span>
        </div>
    );
}

export default CountdownTimer;