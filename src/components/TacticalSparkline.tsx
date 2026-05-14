import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface TacticalSparklineProps {
  data: { value: number }[];
  color: string;
  className?: string;
}

export const TacticalSparkline = ({ data, color, className }: TacticalSparklineProps) => {
  return (
    <div className={`w-full mt-1 opacity-60 pointer-events-none ${className || 'h-4'}`}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            strokeWidth={1.5} 
            dot={false} 
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
