import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { stringToHlsColor, getInitials } from "@/utils/avatar";

const sizeMap = {
  sm: "h-8 w-8 text-xs",
  md: "h-9 w-9 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-24 w-24 text-xl"
};

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