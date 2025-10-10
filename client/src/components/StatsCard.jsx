export default function StatsCard({ title, value, icon }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-5 flex items-center justify-between hover:shadow-md transition">
      <div>
        <h3 className="text-gray-500 text-sm">{title}</h3>
        <p className="text-3xl font-bold text-green-700">{value}</p>
      </div>
      <div className="text-green-600 bg-green-100 dark:bg-green-900 p-3 rounded-lg">{icon}</div>
    </div>
  );
}
