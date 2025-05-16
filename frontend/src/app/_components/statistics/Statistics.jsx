"use client";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function Statistics({ data }) {
  if (!data) return <p className="text-white text-2xl">Loading...</p>;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-4">
      <div className="mb-6 text-center">
        <h2 className="text-4xl font-Satoshi font-bold m-4">{data.commodity}</h2>
        <p className="text-xl font-Satoshi italic">Unit: {data.unit}</p>
        <p className="text-lg font-Satoshi font-semibold">Invest Recommendation: {data.investment_recommendation}</p>
      </div>

      <ResponsiveContainer width="90%" height="70%">
        <LineChart data={data.prices}>
          <XAxis dataKey="date" stroke="#a855f7" fontSize={15} interval="preserveStartEnd" tick={{ fill: "#ffffff", fontSize: 15 }} />
          <YAxis stroke="#a855f7" fontSize={20} tick={{ fill: "#ffffff", fontSize: 15 }}/>
          <CartesianGrid stroke="#4b5563" strokeDasharray="5 5" />
          <Tooltip
            contentStyle={{ fontSize: '15px',  backgroundColor: "#1f1f1f", borderColor: "#a855f7" }} // 👈 Smaller tooltip box text
            itemStyle={{ fontSize: '15px' }}     // 👈 Smaller item text (e.g., "Price: 154.00")
            labelStyle={{ fontSize: '15px', color: "#fff" }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#ffffff"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
