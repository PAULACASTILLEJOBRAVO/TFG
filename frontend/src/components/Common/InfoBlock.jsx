import { Label } from "../ui/label";

const InfoBlock = ({label, value}) => {
    return(
        <div className="flex flex-col gap-0.5">
            <Label className="text-xs text-muted-foreground">
                {label}
            </Label>  

            <div className="font-bold">
                {value}
            </div>
        </div>
    );
}

export default InfoBlock;