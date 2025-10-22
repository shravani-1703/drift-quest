import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import memoryTemple from "@/assets/memory-temple.jpg";
import memoryBeach from "@/assets/memory-beach.jpg";
import memoryMarket from "@/assets/memory-market.jpg";
import memoryMountain from "@/assets/memory-mountain.jpg";
import memoryStreet from "@/assets/memory-street.jpg";
import memoryDesert from "@/assets/memory-desert.jpg";

const timePhases = [
  {
    name: "dawn",
    gradient: "from-amber-900/40 via-rose-900/30 to-orange-800/40",
    overlay: "bg-gradient-to-b from-amber-500/10 via-rose-500/5 to-purple-900/10",
    duration: 20000,
  },
  {
    name: "day",
    gradient: "from-sky-400/30 via-blue-300/20 to-cyan-400/30",
    overlay: "bg-gradient-to-b from-cyan-400/10 via-blue-400/5 to-sky-300/10",
    duration: 20000,
  },
  {
    name: "sunset",
    gradient: "from-orange-600/40 via-pink-600/30 to-purple-800/40",
    overlay: "bg-gradient-to-b from-orange-500/10 via-pink-500/8 to-purple-700/10",
    duration: 20000,
  },
  {
    name: "night",
    gradient: "from-indigo-950/50 via-purple-950/40 to-slate-950/50",
    overlay: "bg-gradient-to-b from-indigo-900/20 via-purple-900/15 to-black/30",
    duration: 20000,
  },
];

const travelMemories = [
  { src: memoryTemple, alt: "Ancient temple at sunrise" },
  { src: memoryBeach, alt: "Tropical beach sunset" },
  { src: memoryMarket, alt: "Bustling night market" },
  { src: memoryMountain, alt: "Snowy mountain peaks" },
  { src: memoryStreet, alt: "European cobblestone street" },
  { src: memoryDesert, alt: "Desert dunes at golden hour" },
];

export function CinematicBackground() {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [visibleMemories, setVisibleMemories] = useState<number[]>([]);

  const currentPhase = timePhases[currentPhaseIndex];

  // Cycle through time phases
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhaseIndex((prev) => (prev + 1) % timePhases.length);
    }, currentPhase.duration);

    return () => clearInterval(interval);
  }, [currentPhaseIndex, currentPhase.duration]);

  // Randomly show/hide travel memories
  useEffect(() => {
    const showMemory = () => {
      const randomIndex = Math.floor(Math.random() * travelMemories.length);
      setVisibleMemories((prev) => {
        if (prev.includes(randomIndex)) return prev;
        return [...prev, randomIndex].slice(-3); // Keep max 3 visible
      });

      // Hide after 8 seconds
      setTimeout(() => {
        setVisibleMemories((prev) => prev.filter((i) => i !== randomIndex));
      }, 8000);
    };

    // Show first memory immediately
    showMemory();

    // Then show new memories every 5-7 seconds
    const interval = setInterval(() => {
      showMemory();
    }, 5000 + Math.random() * 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base dark background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />

      {/* Animated time-lapse gradient overlay */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPhase.name}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 4, ease: "easeInOut" }}
          className={`absolute inset-0 bg-gradient-to-br ${currentPhase.gradient}`}
        />
      </AnimatePresence>

      {/* Secondary overlay for depth */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`overlay-${currentPhase.name}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 3, ease: "easeInOut", delay: 1 }}
          className={`absolute inset-0 ${currentPhase.overlay}`}
        />
      </AnimatePresence>

      {/* Floating travel memory overlays */}
      <div className="absolute inset-0 pointer-events-none">
        {visibleMemories.map((memoryIndex) => {
          const memory = travelMemories[memoryIndex];
          const position = {
            top: `${15 + Math.random() * 60}%`,
            left: `${10 + Math.random() * 70}%`,
          };
          const rotation = -8 + Math.random() * 16;
          const scale = 0.8 + Math.random() * 0.4;

          return (
            <motion.div
              key={`${memoryIndex}-${Date.now()}`}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ 
                opacity: [0, 0.6, 0.6, 0],
                scale: [0.9, scale, scale, 0.8],
                y: [20, 0, 0, -20],
                rotate: rotation,
              }}
              transition={{ 
                duration: 8,
                times: [0, 0.2, 0.8, 1],
                ease: "easeInOut",
              }}
              style={{
                position: "absolute",
                ...position,
              }}
              className="transform-gpu"
            >
              {/* Polaroid frame effect */}
              <div className="relative p-3 bg-white/90 backdrop-blur-sm rounded-lg shadow-2xl border border-white/50">
                <img
                  src={memory.src}
                  alt={memory.alt}
                  className="w-48 h-36 object-cover rounded blur-[2px] opacity-80"
                  style={{
                    filter: "blur(2px) brightness(1.1) saturate(0.9)",
                  }}
                />
                {/* Subtle inner shadow for depth */}
                <div className="absolute inset-3 rounded pointer-events-none shadow-inner" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Ambient light particles */}
      <div className="absolute inset-0">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
              background: currentPhaseIndex === 3 
                ? "rgba(139, 92, 246, 0.4)" // violet for night
                : "rgba(251, 191, 36, 0.3)", // amber for day
            }}
            animate={{
              y: [0, -50 - Math.random() * 50],
              opacity: [0, 0.8, 0],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Subtle grid for depth perception */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.02)_1px,transparent_1px)] bg-[size:80px_80px] opacity-30" />

      {/* Vignette effect */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/40" />
    </div>
  );
}
