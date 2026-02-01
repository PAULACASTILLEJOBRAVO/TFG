import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";

const QuizzCreateFooter = ({ onPublish, onDraft }) => {
    return (
        <CardFooter className="flex items-end justify-end gap-3 pt-3">
            <Button className="bg-green-500 hover:bg-green-500" onClick={onPublish}>
                Publicar cuestionario 
            </Button>

            <Button variant="outline" onClick={onDraft}>
                Guardar borrador
            </Button>
        </CardFooter>
    );
};

export default QuizzCreateFooter;