import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function ActivityChart({ data }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
      <h2 className="text-lg font-semibold mb-4 text-green-700">Monthly Activity</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="analyses" stroke="#16a34a" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
