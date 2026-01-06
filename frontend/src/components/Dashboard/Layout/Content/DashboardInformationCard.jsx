import { Card, CardHeader, CardTitle } from "@/components/ui/card";

const DashboardInformationCard = ({title, value}) => {
    return(
        <Card className="flex items-center justify-center gap-4">
            <CardHeader>
                <CardTitle className="text-xl text-muted-foreground">{value} {title}</CardTitle>
            </CardHeader>
        </Card>
    );
}

export default DashboardInformationCard;