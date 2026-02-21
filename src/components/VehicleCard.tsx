import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Activity, Zap } from "lucide-react";

interface VehicleCardProps {
  car: any;
  onClick: () => void;
}

export const VehicleCard = ({ car, onClick }: VehicleCardProps) => {
  const isCritical = car.status === "ALERT";
  // Dynamic Colors based on status
  const themeColor = isCritical ? "red" : "cyan";
  const borderColor = isCritical ? "border-red-500/50" : "border-cyan-500/30";
  const glowColor = isCritical ? "shadow-red-500/20" : "shadow-cyan-500/20";
  const healthScore = isCritical ? 45 : 98;

  return (
    <div 
      onClick={onClick}
      className={`
        relative group cursor-pointer overflow-hidden rounded-2xl border transition-all duration-500
        bg-[#0a0f1c]/60 backdrop-blur-md
        ${borderColor} hover:border-${themeColor}-400
        shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(0,255,255,0.15)]
        hover:-translate-y-1
      `}
    >
      {/* --- EFFECT: HOLOGRAPHIC SCANNER (Visible on Hover) --- */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent translate-y-[-100%] group-hover:animate-[scanline_1.5s_ease-in-out_infinite] pointer-events-none" />

      {/* --- TECH DECORATIONS (The "Corners") --- */}
      <div className={`absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-${themeColor}-500/50 rounded-tl-xl`} />
      <div className={`absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-${themeColor}-500/50 rounded-br-xl`} />

      {/* Content */}
      <div className="p-6 relative z-10 space-y-5">
        
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-bold text-white tracking-widest font-orbitron drop-shadow-md">
              {car.model}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`w-2 h-2 rounded-full ${isCritical ? 'bg-red-500 animate-ping' : 'bg-cyan-500'}`} />
              <p className="text-xs text-slate-400 font-mono tracking-wider uppercase">
                ID: {car.vehicle_id}
              </p>
            </div>
          </div>
          {isCritical ? (
            <Badge className="bg-red-500/10 text-red-500 border border-red-500/50 animate-pulse">CRITICAL</Badge>
          ) : (
            <Badge className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/50">ONLINE</Badge>
          )}
        </div>

        {/* Health Bar Visualization */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono text-slate-400">
            <span>SYSTEM INTEGRITY</span>
            <span className={isCritical ? "text-red-400" : "text-cyan-400"}>{healthScore}%</span>
          </div>
          <div className="h-2 w-full bg-slate-800/50 rounded-full overflow-hidden border border-white/5">
            <div 
              className={`h-full transition-all duration-1000 ${isCritical ? "bg-gradient-to-r from-red-600 to-orange-500" : "bg-gradient-to-r from-cyan-600 to-blue-500"}`} 
              style={{ width: `${healthScore}%`, boxShadow: `0 0 10px ${isCritical ? 'red' : 'cyan'}` }}
            />
          </div>
        </div>

        {/* Prediction Alert Box */}
        {isCritical && car.predictions.length > 0 && (
          <div className="mt-4 p-3 rounded bg-red-950/30 border border-red-500/30 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-red-400 uppercase tracking-wide">Predictive Failure</p>
                <p className="text-sm text-red-200/80 leading-tight mt-1">
                  {car.predictions[0].issue} detected. Est. failure in <span className="text-white font-bold">{car.predictions[0].prediction.days_left} days</span>.
                </p>
              </div>
          </div>
        )}

        {/* Footer Data */}
        <div className="pt-4 border-t border-white/5 flex justify-between items-center text-xs text-slate-500 font-mono">
            <div className="flex items-center gap-2">
               <Zap className="h-3 w-3 text-yellow-500" />
               <span>{car.fuel_type}</span>
            </div>
            <div className="flex items-center gap-1">
               <Activity className="h-3 w-3 text-cyan-500" />
               <span>LIVE TELEMETRY</span>
            </div>
        </div>
      </div>
    </div>
  );
};