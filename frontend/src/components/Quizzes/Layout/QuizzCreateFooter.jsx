import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";

const QuizzCreateFooter = ({ onPublish, onDraft, onEdit }) => {
    return (
        <CardFooter className="flex items-end justify-end gap-3 pt-3">
            {onPublish && (<Button className="bg-green-500 hover:bg-green-500" onClick={onPublish}>
                Publicar cuestionario 
            </Button>)}

            {onDraft && (<Button variant="outline" onClick={onDraft}>
                Guardar borrador
            </Button>)}

            {onEdit && (
                <Button className="bg-green-500 hover:bg-green-500" onClick={onEdit}>
                    Guardar cuestionario editado
                </Button>
            )}

            {onEdit && (
                <Button variant="outline" onClick={() => window.history.back()}>
                    Cancelar edición
                </Button>
            )}
        </CardFooter>
    );
};

export default QuizzCreateFooter;