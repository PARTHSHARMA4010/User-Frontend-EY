import { motion } from "framer-motion";

interface AudioWaveformProps {
  isActive: boolean;
  barCount?: number;
}

export const AudioWaveform = ({ isActive, barCount = 40 }: AudioWaveformProps) => {
  return (
    <div className="flex items-center justify-center gap-1 h-32">
      {Array.from({ length: barCount }).map((_, i) => (
        <motion.div
          key={i}
          className="w-1.5 rounded-full gradient-voice"
          initial={{ height: 8 }}
          animate={isActive ? {
            height: [8, Math.random() * 80 + 20, 8],
          } : { height: 8 }}
          transition={{
            duration: 0.5 + Math.random() * 0.5,
            repeat: isActive ? Infinity : 0,
            repeatType: "reverse",
            delay: i * 0.02,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};
