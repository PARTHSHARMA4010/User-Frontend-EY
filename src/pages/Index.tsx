import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, Activity, Cpu, Wrench } from "lucide-react"; // Added Wrench icon
import { useNavigate } from "react-router-dom";
import { StatCard } from "@/components/StatCard";
import { VehicleCard } from "@/components/VehicleCard";
import { SensorModal } from "@/components/SensorModal";

// ... (Interface Vehicle code remains same) ...
interface Vehicle {
  vehicle_id: string;
  model: string;
  fuel_type: string;
  status: string;
  summary: string;
  predictions: any[];
  sensors: any;
}

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [fleet, setFleet] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState<Vehicle | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (!savedUser) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(savedUser);
    setUser(parsedUser);

    const fetchData = async () => {
      const data = await api.getDashboard(parsedUser.user_id);

      if (data && data.my_fleet) {
        setFleet(data.my_fleet);

        // Update selected car ONLY if modal open
        setSelectedCar(prev => {
          if (!prev) return null;
          return data.my_fleet.find(
            (c: Vehicle) => c.vehicle_id === prev.vehicle_id
          ) || null;
        });
      }

      setLoading(false);
    };

    fetchData();
    const interval = setInterval(fetchData, 2000);

    return () => clearInterval(interval);

  }, [navigate]); 


  if (loading) return <div className="min-h-screen bg-[#050b14] flex items-center justify-center text-cyan-400 font-mono animate-pulse">ESTABLISHING SATELLITE UPLINK...</div>;

  return (
    <div className="min-h-screen relative font-sans selection:bg-cyan-500/30">
      
      {/* --- BACKGROUND LAYERS --- */}
      <div className="cyber-grid-bg" /> 
      <div className="glow-orb bg-cyan-500 top-[-10%] left-[-10%] w-[500px] h-[500px]" />
      <div className="glow-orb bg-blue-600 bottom-[-10%] right-[-10%] w-[600px] h-[600px] animation-delay-2000" />

      {/* --- MAIN CONTENT CONTAINER --- */}
      <div className="relative z-10 p-8 max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="flex justify-between items-end mb-12 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-5xl font-black italic bg-gradient-to-r from-cyan-300 via-blue-500 to-purple-600 bg-clip-text text-transparent font-orbitron tracking-tighter drop-shadow-lg">
              AUTO AI
            </h1>
            <p className="text-cyan-100/60 mt-2 font-mono text-sm tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              FLEET COMMAND CENTER • {user?.name.toUpperCase()}
            </p>
          </div>

          {/* --- ACTION BUTTONS --- */}
          <div className="flex gap-4">
            {/* NEW BUTTON: GO TO BOOKINGS */}
            <Button 
              onClick={() => navigate("/bookings")} 
              className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500/20 backdrop-blur-md transition-all group"
            >
              <Wrench className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
              SERVICE CENTER
            </Button>

            <Button 
              onClick={() => navigate("/login")} 
              variant="outline" 
              className="border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-red-300 backdrop-blur-md transition-all"
            >
              TERMINATE SESSION
            </Button>
          </div>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {/* We use classNames directly here to override the default StatCard styles for transparency */}
          <div className="glass-panel p-6 rounded-2xl flex items-center justify-between group hover:bg-white/5 transition-all">
             <div>
               <p className="text-slate-400 text-xs font-bold tracking-widest mb-1">TOTAL ASSETS</p>
               <h3 className="text-4xl font-bold text-white group-hover:scale-105 transition-transform">{fleet.length}</h3>
             </div>
             <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400"><Cpu /></div>
          </div>

          <div className="glass-panel p-6 rounded-2xl flex items-center justify-between group hover:bg-white/5 transition-all">
             <div>
               <p className="text-slate-400 text-xs font-bold tracking-widest mb-1">OPTIMAL</p>
               <h3 className="text-4xl font-bold text-emerald-400 group-hover:scale-105 transition-transform">{fleet.filter(c => c.status !== "ALERT").length}</h3>
             </div>
             <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400"><CheckCircle /></div>
          </div>

          <div className="glass-panel p-6 rounded-2xl flex items-center justify-between border-red-500/30 bg-red-900/10 group hover:bg-red-900/20 transition-all">
             <div>
               <p className="text-slate-400 text-xs font-bold tracking-widest mb-1">CRITICAL</p>
               <h3 className="text-4xl font-bold text-red-500 group-hover:scale-105 transition-transform">{fleet.filter(c => c.status === "ALERT").length}</h3>
             </div>
             <div className="p-3 rounded-xl bg-red-500/20 text-red-500 animate-pulse"><AlertTriangle /></div>
          </div>
        </div>

        {/* Vehicle Grid */}
        <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-3 font-orbitron">
          <Activity className="text-cyan-400" />
          ACTIVE TELEMETRY FEEDS
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {fleet.map((car) => (
            <VehicleCard 
              key={car.vehicle_id} 
              car={car} 
              onClick={() => setSelectedCar(car)} 
            />
          ))}
        </div>

        {/* Modal */}
        {selectedCar && (
          <SensorModal 
            vehicle={selectedCar} 
            onClose={() => setSelectedCar(null)} 
          />
        )}
      </div>
    </div>
  );
};

export default Index;