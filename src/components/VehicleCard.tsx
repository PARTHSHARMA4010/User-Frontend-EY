import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Activity, Zap } from "lucide-react";

interface VehicleCardProps {
  car: any;
  onClick: () => void;
}

export const VehicleCard = ({ car, onClick }: VehicleCardProps) => {
  // 1. Determine Status
  const isCritical = car.status === "ALERT" || car.status?.toUpperCase() === "CRITICAL";
  
  // 2. Create a stable "seed" based on the Vehicle ID (so numbers don't flicker)
  const seed = car.vehicle_id 
    ? car.vehicle_id.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0) 
    : 123;

  // 3. Dynamic Health Score Logic
  const generateHealthScore = () => {
    if (car.health_score) return car.health_score; 
    return isCritical ? 35 + (seed % 30) : 85 + (seed % 14); 
  };
  const healthScore = generateHealthScore();

  // 4. Stable "Days Left" Prediction (Generates a number between 7 and 28)
  const estimatedDaysLeft = (seed % 22) + 7;

  // 5. Dynamic Colors based on status
  const themeColor = isCritical ? "red" : "cyan";
  // Reverted to the subtle, semi-transparent border so it's not a harsh solid red line
  const borderColor = isCritical ? "border-red-500/30" : "border-cyan-500/30";

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
              {car.model || "UNKNOWN MODEL"}
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
            <span className={isCritical ? "text-red-400 font-bold" : "text-cyan-400 font-bold"}>{healthScore}%</span>
          </div>
          <div className="h-2 w-full bg-slate-800/50 rounded-full overflow-hidden border border-white/5">
            <div 
              className={`h-full transition-all duration-1000 ${isCritical ? "bg-gradient-to-r from-red-600 to-orange-500" : "bg-gradient-to-r from-cyan-600 to-blue-500"}`} 
              style={{ width: `${healthScore}%`, boxShadow: `0 0 10px ${isCritical ? 'red' : 'cyan'}` }}
            />
          </div>
        </div>

        {/* Prediction Alert Box */}
       

        {/* Footer Data */}
        <div className="pt-4 border-t border-white/5 flex justify-between items-center text-xs text-slate-500 font-mono">
            <div className="flex items-center gap-2">
               <Zap className="h-3 w-3 text-yellow-500" />
               <span>{car.fuel_type || "EV"}</span>
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