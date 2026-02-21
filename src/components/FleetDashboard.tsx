import { motion } from "framer-motion";
import { AlertTriangle, Phone } from "lucide-react";
import { VehicleCard } from "./VehicleCard";
import { Button } from "./ui/button";

interface FleetDashboardProps {
  onIncomingCall: () => void;
}

const vehicles = [
  {
    id: "XYZ-789",
    model: "XUV 700",
    type: "SUV",
    status: "CRITICAL" as const,
    healthScore: 45,
    lastSync: "Just now",
    prediction: {
      component: "Front Brake Pads",
      probability: "92%",
      daysRemaining: 14,
    },
  },
  {
    id: "LMN-456",
    model: "Thar 4x4",
    type: "Off-Road",
    status: "HEALTHY" as const,
    healthScore: 98,
    lastSync: "2 mins ago",
    prediction: null,
  },
  {
    id: "ABC-123",
    model: "Scorpio N",
    type: "SUV",
    status: "WARNING" as const,
    healthScore: 78,
    lastSync: "1 hour ago",
    prediction: {
      component: "Battery Voltage",
      probability: "Low Risk",
      daysRemaining: 45,
    },
  },
];

export const FleetDashboard = ({ onIncomingCall }: FleetDashboardProps) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Background effects */}
      <div className="fixed inset-0 cyber-grid opacity-30 pointer-events-none" />
      <div className="fixed top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Section Title */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <h2 className="font-display text-2xl font-bold text-foreground">My Connected Fleet</h2>
          <p className="text-muted-foreground">Real-time Predictive Monitoring</p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: "Total Vehicles", value: "3", color: "text-primary" },
            { label: "Healthy", value: "1", color: "text-success" },
            { label: "Warning", value: "1", color: "text-warning" },
            { label: "Critical", value: "1", color: "text-destructive" },
          ].map((stat, idx) => (
            <div
              key={stat.label}
              className="bg-card/50 backdrop-blur-sm rounded-lg border border-border p-4"
            >
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className={`font-display text-3xl font-bold ${stat.color}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Vehicle Grid */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-6 mb-8"
        >
          {vehicles.map((vehicle, index) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <VehicleCard vehicle={vehicle} />
            </motion.div>
          ))}
        </motion.div>

        {/* Incoming Call Banner */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            onClick={onIncomingCall}
            size="lg"
            className="w-full h-16 text-lg font-display font-bold gradient-critical hover:opacity-90 text-foreground glow-red animate-pulse-glow transition-all"
          >
            <div className="flex items-center justify-center gap-4">
              <div className="relative">
                <Phone className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-foreground rounded-full animate-ping" />
              </div>
              <span>⚠️ INCOMING AI CALL...</span>
              <AlertTriangle className="w-6 h-6" />
            </div>
          </Button>
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-12 text-center text-sm text-muted-foreground"
        >
          <p>Powered by Agentic AI • Predictive Maintenance Technology</p>
          <p className="mt-1">© 2025 Hero Motocorp. All rights reserved.</p>
        </motion.footer>
      </div>
    </div>
  );
};
