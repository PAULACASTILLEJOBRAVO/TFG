import { Button } from "@/components/ui/button";
import { 
    useEffect, 
    useState 
} from "react";

const InfoToast = ({message, mode = false, duration = 5000}) => {

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!message) return;

        setIsVisible(true);

        const timer = setTimeout(() => {
            setIsVisible(false);
        }, duration);

        return () => clearTimeout(timer);
    }, [message, duration]);

    if (!isVisible || !message) return null;

    return (
        <div className={`fixed top-4 right-4 left-4 z-50  bg-blue-600 text-white px-4 py-2 rounded-sm shadow-lg flex items-center justify-between gap-2 ${isVisible ? 'opacity-100' : 'opacity-0 transition-opacity duration-300'}`}>
            <span>{message}</span>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                    setIsVisible(false);
                }}
            >
                X
            </Button>
        </div>
    );
}

export default InfoToast;