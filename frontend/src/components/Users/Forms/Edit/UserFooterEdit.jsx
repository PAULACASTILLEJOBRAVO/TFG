import { Button } from "@/components/ui/button";

const UserFooterEdit = ({onCancel, onSave }) => {
    return(
        <div className="flex justify-end gap-2 mt-4">
            <Button className="bg-green-500 hover:bg-green-500" onClick={onSave}>
                Actualizar usuario 
            </Button>

            <Button variant="outline" onClick={onCancel}>
                Cancelar
            </Button>
        </div>
    )
}

export default UserFooterEdit;