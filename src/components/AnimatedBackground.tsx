import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const timePhases = ["dawn", "day", "sunset", "night"] as const;
type TimePhase = typeof timePhases[number];

const phaseColors = {
  dawn: "from-amber-500/20 via-rose-500/20 to-purple-900/20",
  day: "from-cyan-400/20 via-blue-500/20 to-indigo-600/20",
  sunset: "from-orange-500/20 via-pink-500/20 to-purple-700/20",
  night: "from-indigo-900/30 via-purple-900/30 to-black/40",
};

export function AnimatedBackground() {
  const [currentPhase, setCurrentPhase] = useState<TimePhase>("night");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhase((prev) => {
        const currentIndex = timePhases.indexOf(prev);
        return timePhases[(currentIndex + 1) % timePhases.length];
      });
    }, 15000); // Change phase every 15 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated gradient overlay */}
      <motion.div
        key={currentPhase}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 3 }}
        className={`absolute inset-0 bg-gradient-to-br ${phaseColors[currentPhase]}`}
      />

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:72px_72px]" />
    </div>
  );
}
