import { motion } from "framer-motion";
import { QrCode, Calendar, MapPin, Car, CheckCircle, Circle, Wrench, Database, Phone, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

interface ServiceTicketProps {
  onViewInsights: () => void;
}

const bookingDetails = {
  bookingId: "BK-2025-889",
  vehicle: "XUV 700 (XYZ-789)",
  serviceCenter: "AutoCare Hub (Sector 62)",
  dateTime: "Jan 18, 2025 • 10:00 AM",
  serviceType: "Predictive Brake Replacement",
  status: "CONFIRMED",
};

const timelineSteps = [
  { id: 1, title: "Anomaly Detected", agent: "Data Agent", icon: Database, completed: true },
  { id: 2, title: "Customer Contacted", agent: "Voice Agent", icon: Phone, completed: true },
  { id: 3, title: "Appointment Scheduled", agent: "Scheduling Agent", icon: Calendar, completed: true },
  { id: 4, title: "Service Completed", agent: "Service Agent", icon: Wrench, completed: false },
  { id: 5, title: "Factory Feedback Loop", agent: "Analytics Agent", icon: ArrowRight, completed: false },
];

export const ServiceTicket = ({ onViewInsights }: ServiceTicketProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background p-8"
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Service Scheduled</h1>
          <p className="text-muted-foreground">Your appointment has been confirmed</p>
        </motion.div>

        {/* Ticket Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative bg-card rounded-2xl overflow-hidden border border-border mb-8"
        >
          {/* Top accent bar */}
          <div className="h-2 bg-success" />

          {/* Main content */}
          <div className="p-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {/* Confirmed badge */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-success/20 rounded-full mb-6"
                >
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span className="font-display font-bold text-success">{bookingDetails.status}</span>
                </motion.div>

                {/* Booking ID */}
                <div className="mb-6">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Booking ID</p>
                  <p className="font-display text-2xl font-bold text-primary">{bookingDetails.bookingId}</p>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <Car className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Vehicle</p>
                      <p className="text-foreground font-medium">{bookingDetails.vehicle}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Service Center</p>
                      <p className="text-foreground font-medium">{bookingDetails.serviceCenter}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Date & Time</p>
                      <p className="text-foreground font-medium">{bookingDetails.dateTime}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Wrench className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Service Type</p>
                      <p className="text-foreground font-medium">{bookingDetails.serviceType}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* QR Code */}
              <div className="ml-8 flex flex-col items-center">
                <div className="w-32 h-32 bg-foreground rounded-lg p-2 flex items-center justify-center">
                  <div className="w-full h-full bg-background rounded flex items-center justify-center">
                    <QrCode className="w-20 h-20 text-foreground" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Scan at arrival</p>
              </div>
            </div>
          </div>

          {/* Dashed separator */}
          <div className="relative px-8">
            <div className="border-t-2 border-dashed border-border" />
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-background rounded-full" />
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-background rounded-full" />
          </div>

          {/* Footer */}
          <div className="p-6 bg-secondary/30">
            <p className="text-center text-sm text-muted-foreground">
              A confirmation SMS has been sent to your registered mobile number
            </p>
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-xl border border-border p-6 mb-8"
        >
          <h3 className="font-display text-lg font-bold text-foreground mb-6">Agentic Process Flow</h3>
          
          <div className="space-y-1">
            {timelineSteps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-start gap-4"
              >
                {/* Connector line */}
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step.completed 
                      ? "bg-success/20 text-success" 
                      : "bg-secondary text-muted-foreground"
                  }`}>
                    {step.completed ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </div>
                  {index < timelineSteps.length - 1 && (
                    <div className={`w-0.5 h-12 ${step.completed ? "bg-success/50" : "bg-border"}`} />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-8">
                  <div className="flex items-center gap-2">
                    <step.icon className={`w-4 h-4 ${step.completed ? "text-success" : "text-muted-foreground"}`} />
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      step.completed 
                        ? "bg-success/20 text-success" 
                        : "bg-secondary text-muted-foreground"
                    }`}>
                      {step.agent}
                    </span>
                  </div>
                  <p className={`text-lg font-medium mt-1 ${
                    step.completed ? "text-foreground" : "text-muted-foreground"
                  }`}>
                    {step.title}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Admin Action */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-right"
        >
          <Button
            onClick={onViewInsights}
            variant="ghost"
            className="text-muted-foreground hover:text-primary text-sm"
          >
            Authorized Personnel: View Manufacturing Insights →
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};
