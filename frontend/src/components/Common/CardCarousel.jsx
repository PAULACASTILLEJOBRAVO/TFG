import { 
    useRef, 
    useState, 
    useEffect, 
    cloneElement 
} from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { TOLERANCE } from "@/utils/constants";

const CardCarousel = ({ children, loading, basePath }) => {
    const scrollRef = useRef(null);
    const navigate = useNavigate();
    const [, forceUpdate] = useState(0);

    const scroll = (direction) => {
        const el = scrollRef.current;
        if (!el) return;

        const amount = 500; 

        el.scrollBy({
            left: direction === "left" ? -amount : amount,
            behavior: "smooth",
        });

        requestAnimationFrame(() => {
            el.dispatchEvent(new Event("scroll"));
        });
    };

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const handleScroll = () => forceUpdate(x => x + 1);

        el.addEventListener("scroll", handleScroll);
        return () => el.removeEventListener("scroll", handleScroll);
    }, []);

    const getScrollState = () => {
        const el = scrollRef.current;
        if (!el) return { left: false, right: false };

        const max = el.scrollWidth - el.clientWidth;

        return {
            left: el.scrollLeft > TOLERANCE,
            right: max - el.scrollLeft > TOLERANCE,
        };
    };

    const { left: canLeft, right: canRight } = getScrollState();

    const handleClick = (child) => {
        if (!basePath || !child?.props?.quiz?._id) return;

        const id = child.props.quiz._id;

        navigate(`${basePath}`.replace(":id", id));
    };

    return (
        <div className="flex items-center gap-2 w-full">
            {/* LEFT */}
            <Button
                variant="outline"
                size="icon"
                onClick={() => scroll("left")}
                className={`shrink-0 bg-white/90 shadow rounded-full transition
                    ${canLeft ? "opacity-100" : "opacity-30 pointer-events-none"}
                `}
            >
                <ArrowLeft className="h-4 w-4" />
            </Button>

            {/* CAROUSEL */}
            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar px-4 py-2 snap-x snap-mandatory flex-1"
            >
                {loading ? (
                    <div className="flex items-center justify-center w-full h-48" />
                ) : (
                    children &&
                    Array.isArray(children)
                        ? children.map((child, idx) =>
                            cloneElement(child, {
                                key: child.props?.quiz?._id || idx,
                                onClick: () => handleClick(child),
                                className:
                                    "min-w-[450px] snap-start transition-transform duration-300 hover:scale-105 cursor-pointer"
                            })
                        )
                        : children
                )}
            </div>

            {/* RIGHT */}
            <Button
                variant="outline"
                size="icon"
                onClick={() => scroll("right")}
                className={`shrink-0 bg-white/90 shadow rounded-full transition
                    ${canRight ? "opacity-100" : "opacity-30 pointer-events-none"}
                `}
            >
                <ArrowRight className="h-4 w-4" />
            </Button>

        </div>
    );
};

export default CardCarousel;