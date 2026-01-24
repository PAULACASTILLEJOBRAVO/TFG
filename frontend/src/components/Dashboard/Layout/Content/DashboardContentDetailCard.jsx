const colsMap = {
  1: "grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
};

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