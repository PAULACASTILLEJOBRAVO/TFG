import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";

const ManagementButton = ({icon: Icon, label, to}) => {
    const navigate = useNavigate();

    return(
        <Button
            variant="outline"
            className="
                h-40 w-40 
                flex flex-col 
                gap-3 
                rounded-lg
                transition-all
                hover:bg-muted
                hover:shadow-md 
                [&_svg]:size-20
            "
            onClick={() => navigate(to)}
            size="icon"
        >
            {typeof Icon === "string" ? (
                <img src={Icon} alt={label} className="h-20 w-20" />
            ) : (
                <Icon />    
            )}
            <Label className="text-sm font-medium text-center ">{label}</Label>
        </Button>
    );
}

export default ManagementButton;