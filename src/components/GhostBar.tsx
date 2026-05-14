import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface GhostBarProps {
  label: string;
  currentValue: number;
  previousValue: number;
  unit: string;
  className?: string;
}

export const GhostBar = ({ label, currentValue, previousValue, unit, className }: GhostBarProps) => {
  const maxVal = Math.max(currentValue, previousValue) * 1.2;
  const currentHeight = (currentValue / maxVal) * 100;
  const previousHeight = (previousValue / maxVal) * 100;
  const isBetter = currentValue >= previousValue;

  return (
    <div className={cn("flex flex-col gap-2 p-3 rounded-2xl bg-white/[0.02] border border-white/5", className)}>
      <div className="flex justify-between items-end">
        <div>
          <p className="text-[7px] text-white/30 font-bold uppercase tracking-widest">{label}</p>
          <p className="text-sm font-black text-white">{currentValue.toLocaleString()} <span className="text-[10px] text-white/50">{unit}</span></p>
        </div>
        <div className={cn("text-[8px] font-black uppercase tracking-wider", isBetter ? "text-primary" : "text-red-400")}>
          {isBetter ? '↑' : '↓'} {Math.abs(currentValue - previousValue).toFixed(0)} {unit}
        </div>
      </div>
      
      {/* Bars */}
      <div className="flex items-end gap-1 h-12 w-full mt-1">
        {/* Ghost/Previous Bar (Background) */}
        <div className="relative flex-1 h-full bg-white/5 rounded-t-sm">
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: `${previousHeight}%` }}
            className="absolute bottom-0 w-full bg-white/10 rounded-t-sm"
          />
        </div>
        
        {/* Current Bar (Foreground) */}
        <div className="relative flex-1 h-full bg-white/5 rounded-t-sm">
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: `${currentHeight}%` }}
            className="absolute bottom-0 w-full bg-primary rounded-t-sm shadow-[0_0_10px_rgba(204,255,0,0.5)]"
          />
        </div>
      </div>
    </div>
  );
};
