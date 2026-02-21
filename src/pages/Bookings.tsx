import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wrench, Clock, ArrowLeft, CheckCircle, Calendar, Car, AlertTriangle, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns"; // Make sure to npm install date-fns if not present, or use native Date

interface Vehicle {
  vehicle_id: string;
  model: string;
  status: string;
  manufacturer?: string; // e.g., "BMW", "Maruti" - assumed to be part of vehicle data or derived from model
}

interface ServiceCenter {
  centerId: string;
  name: string;
  location: string;
  company_name: string;
}

const Bookings = () => {
  const navigate = useNavigate();
  
  // State
  const [fleet, setFleet] = useState<Vehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  // Booking Form State
  const [availableCenters, setAvailableCenters] = useState<ServiceCenter[]>([]);
  const [selectedCenter, setSelectedCenter] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  // 1. Get User ID
  const savedUser = localStorage.getItem("currentUser");
  const user = savedUser ? JSON.parse(savedUser) : { user_id: "USR_UNKNOWN" };
  const userId = user.user_id;

  // 2. INITIAL LOAD: Fetch Fleet List
  useEffect(() => {
    const initData = async () => {
      const dashboardData = await api.getDashboard(userId);
      
      if (dashboardData && dashboardData.my_fleet && dashboardData.my_fleet.length > 0) {
        setFleet(dashboardData.my_fleet);
        setSelectedVehicleId(dashboardData.my_fleet[0].vehicle_id);
      }
      setInitializing(false);
    };

    initData();
  }, [userId]);

  // 3. DYNAMIC LOAD: Fetch Logs & Centers when Vehicle Changes
  useEffect(() => {
    if (!selectedVehicleId) return;

    const fetchContextData = async () => {
      // A. Fetch History Logs
      const history = await api.getLogs(selectedVehicleId);
      setLogs(history || []);

      // B. Fetch Service Centers for this Vehicle's Brand
      // Assuming 'model' or 'vehicle_id' contains the brand, or we have a manufacturer field.
      // Logic: Extract "Maruti" from "Maruti_123" or use the model name.
      const currentCar = fleet.find(c => c.vehicle_id === selectedVehicleId);
      if (currentCar) {
         // Simple heuristic: Try to match the first word of the model or ID as the company
         // In a real app, 'manufacturer' should be a distinct field.
         let companyQuery = currentCar.model.split(" ")[0]; // e.g., "BMW" from "BMW X5"
         
         // If vehicle_id has underscore logic like "Maruti_123", prefer that
         if (currentCar.vehicle_id.includes("_")) {
             companyQuery = currentCar.vehicle_id.split("_")[0];
         }

         try {
             // Using the deployed admin API to find centers
             // Note: The screenshot showed /get-center-by-name, but typically you search by company.
             // We will filter the results client-side if the API returns all, or query specific if supported.
             // For now, let's assume we fetch all and filter, or use a specific search endpoint if available.
             // Replacing with the endpoint likely available based on previous context:
             const response = await fetch(`https://admin-ey-1.onrender.com/get-all-centers`);
             const allCenters = await response.json();
             
             // Filter for the specific company (case-insensitive)
             const relevantCenters = allCenters.filter((c: any) => 
                 c.company_name?.toLowerCase().includes(companyQuery.toLowerCase()) || 
                 c.name.toLowerCase().includes(companyQuery.toLowerCase())
             );
             
             setAvailableCenters(relevantCenters.length > 0 ? relevantCenters : allCenters.slice(0, 5)); // Fallback to top 5 if no match
         } catch (err) {
             console.error("Failed to fetch centers", err);
         }
      }
    };

    fetchContextData();
  }, [selectedVehicleId, fleet]); 

  // --- 4. BOOKING LOGIC ---
  const handleBooking = async () => {
    if (!selectedVehicleId || !selectedCenter || !selectedDate || !selectedTime) {
        alert("Please select a service center, date, and time.");
        return;
    }
    setLoading(true);

    const centerDetails = availableCenters.find(c => c.centerId === selectedCenter);
    const scheduledDateTime = new Date(`${selectedDate}T${selectedTime}:00Z`).toISOString();

    // Construct the Manual Booking JSON as requested
    const bookingPayload = {
      logId: `LOG_${new Date().toISOString().replace(/[-:T.]/g, '').slice(0,14)}`,
      userId: userId,
      vehicleId: selectedVehicleId,
      timestamp: new Date().toISOString(),
      logType: "BOOKING",
      data: {
         vehicleId: selectedVehicleId,
         confirmationCode: "PENDING", // Will be updated by backend response
         status: "REQUESTED",
         scheduledService: {
            isScheduled: true,
            serviceCenterName: centerDetails?.name || "Unknown Center",
            dateTime: scheduledDateTime
         },
         action: "CREATED"
      }
    };

    try {
        const bookingResponse = await api.bookService(bookingPayload);

        if (bookingResponse.success) {
          // Save the confirmed log to history
          // Backend usually returns the confirmation code here
          const finalLog = {
            ...bookingPayload,
            data: {
              ...bookingPayload.data,
              confirmationCode: bookingResponse.data.confirmationCode || "CONFIRMED",
              status: "CONFIRMED",
              message: "Service appointment scheduled successfully."
            }
          };

          await api.saveLog(finalLog);
          
          // Refresh Logs
          const updatedHistory = await api.getLogs(selectedVehicleId);
          setLogs(updatedHistory);
          
          // Reset Form
          setSelectedDate("");
          setSelectedTime("");
          setSelectedCenter("");
        } else {
alert("Booking Failed! " + ((bookingResponse as any).message || "Server Error."));        }
    } catch (e) {
        console.error("Booking error", e);
        alert("An error occurred while booking.");
    }

    setLoading(false);
  };

  if (initializing) return <div className="min-h-screen bg-[#050b14] flex items-center justify-center text-cyan-400 font-mono animate-pulse">LOADING FLEET DATA...</div>;

  return (
    <div className="min-h-screen bg-[#050b14] p-8 font-sans text-slate-100 relative overflow-x-hidden">
      
      {/* Background Effects */}
      <div className="cyber-grid-bg" />
      <div className="glow-orb bg-purple-600 top-[-10%] right-[-10%] w-[500px] h-[500px]" />

      <div className="relative z-10 max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-4xl font-black italic bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent font-orbitron">
              SERVICE OPERATIONS
            </h1>
            <p className="text-slate-400 mt-2 font-mono text-sm">
              SELECT A VEHICLE TO MANAGE SERVICE RECORDS
            </p>
          </div>
          <Button onClick={() => navigate("/")} variant="outline" className="border-slate-700 hover:bg-white/5">
            <ArrowLeft className="mr-2 h-4 w-4" /> DASHBOARD
          </Button>
        </header>

        {/* --- STEP 1: VEHICLE SELECTOR --- */}
        <div className="mb-10">
          <h3 className="text-sm font-bold text-slate-400 mb-4 tracking-widest font-orbitron">AVAILABLE ASSETS</h3>
          <div className="flex gap-4 overflow-x-auto p-4 scrollbar-hide">
            {fleet.map((car) => {
              const isSelected = selectedVehicleId === car.vehicle_id;
              const isCritical = car.status === "ALERT";

              return (
                <div 
                  key={car.vehicle_id}
                  onClick={() => setSelectedVehicleId(car.vehicle_id)}
                  className={`
                    min-w-[250px] p-4 rounded-xl cursor-pointer transition-all duration-300 border-2 relative overflow-hidden group
                    ${isSelected 
                      ? "bg-cyan-950/40 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)] scale-[1.02]" 
                      : "bg-slate-900/40 border-slate-800 hover:border-slate-600 hover:bg-slate-800/40"
                    }
                  `}
                >
                  <div className="flex justify-between items-start mb-2">
                    <Car className={`h-6 w-6 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                    {isCritical && <AlertTriangle className="h-5 w-5 text-red-500 animate-pulse" />}
                  </div>
                  <h4 className={`text-lg font-bold ${isSelected ? 'text-white' : 'text-slate-400'}`}>{car.model}</h4>
                  <p className="text-xs font-mono text-slate-500">{car.vehicle_id}</p>
                  
                  {isSelected && (
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-cyan-400 animate-pulse" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* --- STEP 2: BOOKING & HISTORY --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-4 duration-700">
          
          {/* LEFT: Booking Action Card */}
          <Card className="bg-slate-900/60 border-cyan-500/30 backdrop-blur-xl h-fit">
            <CardHeader>
              <CardTitle className="text-cyan-400 flex items-center gap-2 font-orbitron">
                <Wrench className="h-5 w-5" /> INITIATE SERVICE
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-cyan-950/40 rounded-lg border border-cyan-500/20 text-sm text-cyan-100">
                <p className="font-bold mb-2 flex items-center gap-2">
                   <CheckCircle className="h-4 w-4 text-cyan-400" /> Selected Vehicle
                </p>
                Booking service for <span className="text-white font-bold underline">{fleet.find(c => c.vehicle_id === selectedVehicleId)?.model}</span>.
              </div>
              
              <div className="space-y-4">
                 {/* Service Center Selector */}
                 <div>
                    <label className="text-xs font-bold text-slate-500 mb-1 block">SELECT SERVICE CENTER</label>
                    <select 
                        className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-sm text-white focus:border-cyan-500 outline-none"
                        value={selectedCenter}
                        onChange={(e) => setSelectedCenter(e.target.value)}
                    >
                        <option value="">-- Choose Center --</option>
                        {availableCenters.map(center => (
                            <option key={center.centerId} value={center.centerId}>
                                {center.name} ({center.location})
                            </option>
                        ))}
                    </select>
                 </div>

                 {/* Date & Time Picker */}
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500 mb-1 block">DATE</label>
                        <input 
                            type="date" 
                            className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-sm text-white focus:border-cyan-500 outline-none"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 mb-1 block">TIME</label>
                        <input 
                            type="time" 
                            className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-sm text-white focus:border-cyan-500 outline-none"
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                        />
                    </div>
                 </div>

                 <div className="flex justify-between text-xs text-slate-400 font-mono pt-2">
                    <span>EST. COST:</span> <span className="text-white">$120.00</span>
                 </div>
              </div>

              <Button 
                onClick={handleBooking} 
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold h-12 text-lg shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all"
              >
                {loading ? "TRANSMITTING..." : "CONFIRM APPOINTMENT"}
              </Button>
            </CardContent>
          </Card>

          {/* RIGHT: Digital History Log */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2 font-orbitron">
                <Clock className="text-purple-400" /> SERVICE HISTORY
              </h2>
              <Badge variant="outline" className="border-slate-700 text-slate-400">
                {selectedVehicleId}
              </Badge>
            </div>

            {logs.length === 0 ? (
               <div className="text-slate-500 italic p-12 text-center border border-dashed border-slate-800 rounded-xl bg-slate-900/20">
                 No service history found for this vehicle.
               </div>
            ) : (
              logs.map((log) => (
                <div key={log.logId} className="flex gap-4 group animate-in slide-in-from-right-4 duration-500">
                  {/* Timeline */}
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full mt-6 shadow-[0_0_10px_currentColor] ${log.logType === 'BOOKING' ? 'bg-green-500 text-green-500' : 'bg-amber-500 text-amber-500'}`} />
                    <div className="w-0.5 h-full bg-slate-800 group-last:bg-transparent" />
                  </div>

                  {/* Log Card */}
                  <div className="flex-1 pb-6">
                    <div className="bg-slate-900/40 border border-white/5 p-5 rounded-xl hover:bg-white/5 transition-all hover:border-white/10 hover:translate-x-1">
                      <div className="flex justify-between items-start mb-3">
                        <Badge variant="outline" className={log.logType === 'BOOKING' ? 'text-green-400 border-green-500/30 bg-green-500/10' : 'text-amber-400 border-amber-500/30 bg-amber-500/10'}>
                          {log.logType}
                        </Badge>
                        <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                           <Calendar className="h-3 w-3" />
                           {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                      
                      {log.logType === 'BOOKING' ? (
                          <div>
                            <h4 className="font-bold text-white text-lg">Service Appointment Confirmed</h4>
                            <div className="text-sm text-slate-400 mt-2 grid grid-cols-2 gap-4">
                              <div>
                                <span className="text-slate-600 text-xs block">SERVICE CENTER</span>
                                {log.data.scheduledService?.serviceCenterName || log.data.serviceCenterName || "N/A"}
                              </div>
                              <div>
                                <span className="text-slate-600 text-xs block">STATUS</span>
                                <span className="text-green-400 font-bold">{log.data.status}</span>
                              </div>
                            </div>
                          </div>
                      ) : (
                          <div>
                            <h4 className="font-bold text-white text-lg">Issue Detected: {log.data.component || "General System"}</h4>
                            <p className="text-sm text-slate-400 mt-1">
                              {log.data.issue} <span className="text-amber-500">({log.data.severity || "MEDIUM"})</span>
                            </p>
                          </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookings;