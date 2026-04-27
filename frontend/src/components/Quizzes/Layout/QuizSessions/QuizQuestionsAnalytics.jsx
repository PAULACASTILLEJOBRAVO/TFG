import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const QuizQuestionsAnalytics = ({ question }) => {
  const data = question.options.map(opt => ({
    name: opt.letter,
    value: opt.count,
    isCorrect: opt.isCorrect
  }));

  return (
    <div className="p-4 bg-white rounded-xl border">
      <div className="text-sm text-gray-500 mb-2">
        {question.text}
      </div>

      <div style={{ width: "100%", height: 250 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <Tooltip />

            <Bar dataKey="value" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default QuizQuestionsAnalytics;