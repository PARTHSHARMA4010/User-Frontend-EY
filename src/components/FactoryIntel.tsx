import { motion } from "framer-motion";
import { ArrowLeft, TrendingUp, AlertTriangle, Target, Terminal } from "lucide-react";
import { Button } from "./ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";

interface FactoryIntelProps {
  onBack: () => void;
}

const failureData = [
  { component: "Brake Pads", count: 1240, fill: "hsl(var(--destructive))" },
  { component: "Battery", count: 450, fill: "hsl(var(--warning))" },
  { component: "Engine", count: 280, fill: "hsl(var(--primary))" },
  { component: "Tires", count: 180, fill: "hsl(var(--accent))" },
];

const temperatureData = [
  { temp: -5, failures: 180, z: 100 },
  { temp: -2, failures: 220, z: 120 },
  { temp: 0, failures: 340, z: 180 },
  { temp: 2, failures: 280, z: 150 },
  { temp: 5, failures: 120, z: 80 },
  { temp: 10, failures: 45, z: 40 },
  { temp: 15, failures: 30, z: 30 },
  { temp: 20, failures: 25, z: 25 },
  { temp: 25, failures: 20, z: 20 },
  { temp: 30, failures: 22, z: 22 },
  { temp: 35, failures: 35, z: 35 },
];

const terminalOutput = `> AGENT: Manufacturing Insight Module
> STATUS: Pattern Detected
> ANALYSIS: 85% of brake failures occur in sub-5°C temperatures.
> ROOT CAUSE: Supplier 'BrakesOne' Batch #404 compound becomes brittle.
> AUTOMATED ACTION: CAPA Report #992 generated and sent to Engineering Team.
> RECOMMENDATION: Switch to cold-resistant compound for northern distribution.
> IMPACT: Estimated 68% reduction in field failures.`;

export const FactoryIntel = ({ onBack }: FactoryIntelProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background p-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <Button
              onClick={onBack}
              variant="ghost"
              className="mb-4 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="font-display text-3xl font-bold text-foreground">
              OEM Manufacturing Feedback Loop
            </h1>
            <p className="text-muted-foreground mt-1">Model: XUV 700 • Real-time Analytics</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Live Data</p>
            <div className="flex items-center gap-2 text-success">
              <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span className="font-medium">Streaming</span>
            </div>
          </div>
        </motion.div>

        {/* Metrics Cards */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-6 mb-8"
        >
          {/* Total Failures */}
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">Total Brake Failures</span>
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-4xl font-bold text-destructive">1,240</span>
              <span className="flex items-center text-sm text-destructive">
                <TrendingUp className="w-4 h-4 mr-1" />
                15%
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">vs. previous quarter</p>
          </div>

          {/* Avg Failure Mileage */}
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">Avg. Failure Mileage</span>
              <Target className="w-5 h-5 text-warning" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-4xl font-bold text-warning">12,500</span>
              <span className="text-sm text-muted-foreground">km</span>
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Target: 20,000 km</span>
                <span>62.5%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "62.5%" }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className="h-full bg-warning rounded-full"
                />
              </div>
            </div>
          </div>

          {/* Root Cause */}
          <div className="bg-card rounded-xl border border-destructive/50 p-6 animate-pulse-glow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">Identified Root Cause</span>
              <AlertTriangle className="w-5 h-5 text-destructive animate-pulse" />
            </div>
            <p className="font-display text-xl font-bold text-destructive mb-2">
              Material Fatigue
            </p>
            <p className="text-sm text-foreground">Batch #404</p>
            <p className="text-xs text-muted-foreground mt-1">Supplier: BrakesOne</p>
          </div>
        </motion.div>

        {/* Charts Row */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 gap-6 mb-8"
        >
          {/* Bar Chart */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-display text-lg font-bold text-foreground mb-6">
              Component Failure Frequency
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={failureData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="component" 
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                />
                <YAxis 
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Bar 
                  dataKey="count" 
                  radius={[4, 4, 0, 0]}
                  fill="hsl(var(--primary))"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Scatter Chart */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-display text-lg font-bold text-foreground mb-6">
              Failure Rate vs. Temperature (°C)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="temp" 
                  name="Temperature"
                  unit="°C"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                  domain={[-10, 40]}
                />
                <YAxis 
                  dataKey="failures" 
                  name="Failures"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                />
                <ZAxis dataKey="z" range={[50, 400]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  cursor={{ strokeDasharray: "3 3" }}
                />
                <Scatter 
                  data={temperatureData} 
                  fill="hsl(var(--destructive))"
                  fillOpacity={0.6}
                />
                {/* Highlight zone */}
                <rect
                  x={-5}
                  width={50}
                  fill="hsl(var(--destructive))"
                  fillOpacity={0.1}
                />
              </ScatterChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-destructive/30 rounded" />
                <span>Critical Zone (0-5°C)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-destructive rounded-full" />
                <span>Failure Cluster</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Terminal */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-card rounded-xl border border-accent/30 overflow-hidden"
        >
          <div className="flex items-center gap-2 px-4 py-3 bg-accent/10 border-b border-accent/30">
            <Terminal className="w-4 h-4 text-accent" />
            <span className="font-display text-sm font-bold text-accent">Agentic Insight Terminal</span>
            <div className="ml-auto flex items-center gap-2">
              <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span className="text-xs text-success">Active</span>
            </div>
          </div>
          <div className="p-6 font-mono text-sm">
            {terminalOutput.split("\n").map((line, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className={`${
                  line.includes("ROOT CAUSE") || line.includes("AUTOMATED ACTION")
                    ? "text-destructive"
                    : line.includes("RECOMMENDATION") || line.includes("IMPACT")
                    ? "text-success"
                    : "text-foreground/80"
                }`}
              >
                {line}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
