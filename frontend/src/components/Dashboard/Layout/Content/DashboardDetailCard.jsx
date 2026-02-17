import { 
    Card, 
    CardHeader, 
    CardTitle 
} from "@/components/ui/card";

const DashboardDetailCard = ({title, value}) => {
    return(
        <Card className="flex items-center justify-center gap-4 border-none bg-transparent shadow-none">
            <CardHeader>
                <CardTitle className="text-xl text-muted-foreground">{value} {title}</CardTitle>
            </CardHeader>
        </Card>
    );
}

export default DashboardDetailCard;