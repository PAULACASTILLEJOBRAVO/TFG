import { colsMap } from "@/utils/constants";

const DashboardContentDetailCard = ({children, cols = 2}) => {
    return(
        <div className="py-3">
            <div className={`grid grid-cols-1 ${colsMap[cols] ?? "md:grid-cols-2"} gap-2`}>
                {children}
            </div>
        </div>
    );
}

export default DashboardContentDetailCard;