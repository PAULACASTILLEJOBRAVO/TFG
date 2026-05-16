import { useTranslation } from "react-i18next";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

const BarGraphic = ({ data, dataKey, dataValue }) => {
    const {t} = useTranslation();

    return (
        <div style={{ width: "100%", height: 100 }}>
            <ResponsiveContainer>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={dataKey} />
                    <Tooltip 
                        content={({ active, payload }) => { // Custom tooltip to show option details
                            if (!active || !payload?.length) return null;

                            const data = payload[0].payload;

                            return (
                                <div className="bg-white border rounded-lg p-3 shadow-md">
                                    <p className="font-semibold">
                                    {t('teacher.quizSessions.analytics.option')} {data.name}
                                    </p>

                                    <p>{data.value} {t('teacher.quizSessions.analytics.responses')}</p>

                                    <p>{data.percentage} {t('teacher.quizSessions.analytics.percentage')}</p>

                                    <p
                                    className={
                                        data.isCorrect
                                        ? "text-green-600"
                                        : "text-red-500"
                                    }
                                    >
                                    {data.isCorrect ? t('teacher.quizSessions.analytics.correct') : t('teacher.quizSessions.analytics.incorrect')}
                                    </p>
                                </div>
                            );
                        }}
                    />

                    <Bar dataKey={dataValue} radius={[6, 6, 0, 0]} 
                        shape={(props) => {
                            const { payload, x, y, width, height } = props;

                            const fill = payload.isCorrect ? "#22c55e" : "#94a3b8";
                        
                            return <rect x={x} y={y} width={width} height={height} fill={fill} rx={6} ry={6} />
                            ;
                        }}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default BarGraphic;