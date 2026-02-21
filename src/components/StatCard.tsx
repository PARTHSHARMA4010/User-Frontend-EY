import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: number;
  icon: ReactNode;
  color: string;
  border: string;
  pulse?: boolean;
}

export const StatCard = ({ label, value, icon, color, border, pulse }: StatCardProps) => (
  <div className={`bg-slate-900/50 border ${border} p-5 rounded-xl backdrop-blur-sm flex items-center justify-between`}>
    <div>
      <p className="text-slate-500 text-xs font-bold tracking-wider mb-1">{label}</p>
      <h3 className={`text-3xl font-bold ${color} ${pulse ? 'animate-pulse' : ''}`}>{value}</h3>
    </div>
    <div className={`p-3 rounded-full bg-slate-950 border border-slate-800 ${color}`}>
      {icon}
    </div>
  </div>
);