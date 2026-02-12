import { useRef, useLayoutEffect , useState, cloneElement, Children, isValidElement } from "react";

const QuizCreateEditorLayout = ({ children }) => {
    const editorRef = useRef(null);
    const [editorHeight, setEditorHeight] = useState(0);
    
    useLayoutEffect(() => {
        if (!editorRef.current) return;
        
        const measure = () => setEditorHeight(editorRef.current.offsetHeight);

        measure(); // Size at beginning

        const resizeObserver = new ResizeObserver(measure);
        resizeObserver.observe(editorRef.current);

        return () => resizeObserver.disconnect();
    }, [children]);  // Re-size if the children change, as they might affect the height of the editor panel

    const childrenArray = Children.toArray(children);

    const childrenWithProps = childrenArray.map(child => {
        if (!isValidElement(child)) return child;

        if (child.type.__TYPE === "LIST") {
            return cloneElement(child, { maxHeight: editorHeight });
        }
        
        if (child.type.__TYPE === "EDITOR") {
            return cloneElement(child, { ref: editorRef });
        }

        if (child.type.__TYPE === "SETTINGS") {
            return cloneElement(child, { maxHeight: editorHeight });
        }

        return child;
    });

    return (
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2.5fr_1fr] gap-2 p-2">
            {childrenWithProps}
        </div>
    )
};

export default QuizCreateEditorLayout;