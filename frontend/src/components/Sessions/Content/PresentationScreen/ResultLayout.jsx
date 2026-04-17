import { 
    useEffect, 
    useState 
} from "react";
import { 
    bgColorCard,
    barColorCard
 } from "@/utils/constants";

const ResultLayout = ({ currentQuestion, results }) => {
    const [animatedCounts, setAnimatedCounts] = useState([]);
    const [animatedWidths, setAnimatedWidths] = useState([]);

    if (!currentQuestion || !results) return null;

    const maxVotes = Math.max(...results.map(result => result.count), 1);

    useEffect(() => {
        setAnimatedCounts(results.map(() => 0)); // Start counts at 0 for animation
        setAnimatedWidths(results.map(() => 2)); // Start widths at 2% for animation because of the min width

        results.forEach((result, index) => {
            const increment = Math.max(Math.floor(result.count / 20), 1); // Animate count and width over 400ms (20 intervals of 20ms)
            let current = 0;

            const interval = setInterval(() => {
                current += increment;

                if (current >= result.count) {
                    current = result.count;
                    clearInterval(interval);
                }

                // Update the animated counts and widths
                setAnimatedCounts(prev => {
                    const updated = [...prev];
                    updated[index] = current;
                    return updated;
                });

                setAnimatedWidths(prev => {
                    const updated = [...prev];
                    const pct = maxVotes > 0 ? (result.count / maxVotes) * 100 : 0;
                    updated[index] = Math.max(pct, 2);
                    return updated;
                });
            }, 20); // Update every 20ms for smooth animation
        });
    }, [results, maxVotes]);

    return (
        <div className="h-full w-full">
            {currentQuestion && (
                <div className="flex flex-col gap-3 xl:gap-12 w-full h-full p-2 xl:px-12 xl:py-8">

                    <h1 className="text-xl xl:text-5xl font-bold text-center">
                        {currentQuestion.text}
                    </h1>

                    <div className="grid grid-cols-1 gap-2 xl:gap-8 flex-1">
                        {currentQuestion.options.map((option, index) => {
                            const optionLetter = String.fromCharCode(65 + index);

                            const result = results.find(result => result.letter === optionLetter) || { count: 0 };

                            const count = animatedCounts[index] !== undefined ? animatedCounts[index] : result.count ?? 0;

                            const isCorrect = option.isCorrect;

                            const baseColor = isCorrect ? bgColorCard[index].normal : bgColorCard[index].dim;

                            const barColor = isCorrect ? (count > 0 ? bgColorCard[index].normal : barColorCard[index].normal) : barColorCard[index].dim;

                            return (
                                <div
                                    key={option._id}
                                    className={`${baseColor} relative rounded-md overflow-hidden h-16 xl:h-20 ${isCorrect ? "" : "scale-95"}`}
                                >
                                    <div
                                        className={`${barColor} absolute left-0 top-0 h-full transition-[width] duration-700 ease-out`}
                                        style={{ width: `${animatedWidths[index]}%`  }}
                                    />
                                   
                                    <div className="relative z-10 flex items-center justify-between p-4">
                                        <div className="flex items-center gap-4">
                                            <span className="text-white font-semibold text-lg xl:text-2xl">
                                                {option.letter || String.fromCharCode(65 + index)}
                                            </span>

                                            <span className="text-white font-semibold text-xs xl:text-lg">
                                                {option.text}
                                            </span>
                                        </div>
                                        
                                        <div className={`text-white  ${isCorrect ? "text-lg xl:text-xl" : "text-sm xl:text-lg" } font-bold ml-1`}>
                                            {count}
                                        </div>
                                    </div>
                                    
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResultLayout;