import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface WeeklyProgressProps {
  data: number[]; // 7 days of data, 0-100%
}

export const WeeklyProgress = ({ data }: WeeklyProgressProps) => {
  // Add 180 degrees offset to make it a semi-circle
  const chartData = data.map((val, i) => ({ name: `Day ${i}`, value: 100 / 7 }));
  
  // Custom colors based on value
  const getFill = (value: number) => {
    if (value > 80) return '#FF9F43'; // High activity
    if (value > 50) return '#A68972'; // Medium
    return '#5A8F92'; // Low/Normal
  };

  return (
    <div className="h-64 w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data.map((v, i) => ({ value: 1 }))}
            cx="50%"
            cy="100%"
            startAngle={180}
            endAngle={0}
            innerRadius={93}
            outerRadius={148}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((value, index) => (
              <Cell key={`cell-${index}`} fill={getFill(value)} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
