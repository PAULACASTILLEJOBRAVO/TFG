import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const LineGraphic = ({
  title,
  data = [],
  xKey = "name",
  lines = [],
  height = 250,
}) => {
  return (
    <div className="mt-6 p-4 bg-white rounded-xl border">
      {title && (
        <div className="text-sm text-gray-500 mb-4">
          {title}
        </div>
      )}

      <div style={{ width: "100%", height }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip />

            {lines.map((line, i) => (
              <Line
                key={i}
                type="monotone"
                dataKey={line.dataKey}
                stroke={line.color}
                strokeWidth={2}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineGraphic;