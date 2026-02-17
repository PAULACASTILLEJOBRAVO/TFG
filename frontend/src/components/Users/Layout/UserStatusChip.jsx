import { Badge } from "@/components/ui/badge";

const UserStatusChip = ({ isActive, isDelete }) => {
    if(isDelete || !isActive) {
        return (
            <Badge variant="destructive">
                Eliminado
            </Badge>
        );
    }
}

export default UserStatusChip;