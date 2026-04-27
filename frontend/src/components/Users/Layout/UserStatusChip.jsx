import { Badge } from "@/components/ui/badge";

const UserStatusChip = ({ deleted }) => {
    if(deleted) {
        return (
            <Badge variant="destructive">
                Eliminado
            </Badge>
        );
    }
}

export default UserStatusChip;