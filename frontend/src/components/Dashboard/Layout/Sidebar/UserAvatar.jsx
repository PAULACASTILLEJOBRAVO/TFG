import { 
    Avatar, 
    AvatarFallback, 
    AvatarImage 
} from "@/components/ui/avatar";
import { 
    stringToHlsColor, 
    getInitials 
} from "@/utils/avatar";
import { sizeMap } from "@/utils/constants";

const UserAvatar = ({ name, avatar, size = "md" }) => {
    const bgColor = stringToHlsColor(name, 50);

    return(
        <Avatar className={sizeMap[size]}>
            {avatar && <AvatarImage src={avatar} alt={name ? name : "Icono"}/>}
            
            <AvatarFallback style={{backgroundColor: bgColor}} className="text-white font-medium">
                {getInitials(name) ?? <User className="h-4 w-4" />}
            </AvatarFallback>
        </Avatar>
    );
}

export default UserAvatar;