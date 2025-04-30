
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ChartData } from "@/types/finance";

interface FinanceChartProps {
  data: ChartData[];
  title: string;
  className?: string;
}

const FinanceChart: React.FC<FinanceChartProps> = ({ data, title, className = "" }) => {
  return (
    <div className={`finance-card ${className}`}>
      <h3 className="text-gray-700 font-medium mb-4">{title}</h3>
      
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} width={80} tickFormatter={(value) => `€${value}`} />
            <Tooltip 
              formatter={(value) => [`€${value}`, ""]}
              contentStyle={{ borderRadius: '4px', fontSize: '12px' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Bar dataKey="revenue" name="Revenue" fill="#10B981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" name="Expenses" fill="#EF4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FinanceChart;
