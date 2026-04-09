import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { colorChart } from "@/utils/constants";

const PieGraphic = ({ data }) => {
    const total = data.reduce((acc, item) => acc + item.value, 0);
                        
    return (
        <ResponsiveContainer width="100%" height={260}>
            <PieChart margin={{ top: 40, bottom: 40, left: 20, right: 20 }}>
                <Pie
                    data={data}
                    dataKey="value" 
                    nameKey="name" 
                    isAnimationActive={true}
                    animationDuration={800}
                    animationEasing="ease-out"
                    cx="50%"
                    cy="45%"
                    outerRadius="75%"
                    innerRadius="50%"
                    paddingAngle={2} 
                    label={({ percent, value }) =>
                        value > 0 && percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ""
                    }
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colorChart[index % colorChart.length]} />
                    ))}
                </Pie>
                <Tooltip 
                    contentStyle={{
                        backgroundColor: "#fff",
                        borderRadius: "8px",
                        border: "1px solid #e5e7eb",
                        fontSize: "14px"
                    }}
                    formatter={(value, name) => {
                        return [
                            `${value} (${total ? ((value / total) * 100).toFixed(0) : 0}%)`,
                            name
                        ];
                    }}
                />
                <Legend verticalAlign="bottom" height={30} />
            </PieChart>
        </ResponsiveContainer>
    );
}

export default PieGraphic;