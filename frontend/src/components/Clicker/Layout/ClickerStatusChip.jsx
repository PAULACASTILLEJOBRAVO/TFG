import { Badge } from "@/components/ui/badge";

const ClickerStatusChip = ({ status }) => {
    if(status === "damaged") {
        return (
            <Badge variant="destructive">
                Dañado
            </Badge>
        );
    }

    if(status === "assigned") {
        return (
            <Badge variant="outline" className="bg-blue-500 text-white hover:bg-blue-400">
                En uso
            </Badge>
        );
    }

    if(status === "available") {
        return (
            <Badge variant="outline" className="bg-green-500 text-white hover:bg-green-400">
                Disponible
            </Badge>
        );
    }

    if(status === "retired") {
        return (
            <Badge variant="outline" className="bg-gray-500 text-white hover:bg-gray-400">
                Retirado
            </Badge>
        );
    }

    return (
        <Badge variant="outline">
            Desconocido
        </Badge>
    );
}

export default ClickerStatusChip;