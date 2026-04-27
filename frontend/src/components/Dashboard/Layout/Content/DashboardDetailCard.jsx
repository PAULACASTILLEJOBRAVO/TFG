import { Card } from "@/components/ui/card";

const DashboardDetailCard = ({
  title,
  value,
  icon: Icon,
  className = "",
  colorTextIcon = "text-gray-400",
  colorTextValue = "text-gray-900",
  colorTextTitle = "text-gray-500",
}) => {
  return (
    <Card
      className={`flex items-center gap-4 p-4 rounded-xl border bg-white shadow-sm ${className}`}
    >
      {/* Icon */}
      {Icon && (
        <div className={colorTextIcon + " shrink-0"}>
          <Icon className="h-5 w-5" />
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col">
        {/* VALUE */}
        <div className={colorTextValue + " text-2xl font-semibold leading-none"}>
          {value}
        </div>

        {/* TITLE */}
        <div className={`text-xs ${colorTextTitle} mt-1`}>
          {title}
        </div>
      </div>
    </Card>
  );
};

export default DashboardDetailCard;