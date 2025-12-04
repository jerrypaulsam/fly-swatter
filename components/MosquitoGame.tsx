'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type MosquitoData = {
  id: number;
  initialLeft: number; // 0-100%
  initialTop: number;  // 0-100%
};

type ClickEffect = {
  id: number;
  x: number;
  y: number;
};

// --- Sub-Component: Individual Mosquito ---
const SingleMosquito = ({ 
    data, 
    onSwat 
}: { 
    data: MosquitoData; 
    onSwat: (id: number, e: React.MouseEvent | React.TouchEvent) => void 
}) => {
  
  // Generate random flight path using PERCENTAGES (0% to 90%)
  // This ensures they cover the WHOLE screen, no matter the device size.
  const flightPath = useMemo(() => {
    // 8 random points
    const pointsLeft = Array.from({ length: 8 }).map(() => `${Math.random() * 90}%`);
    const pointsTop = Array.from({ length: 8 }).map(() => `${Math.random() * 85}%`); // 85% to keep it away from very bottom
    return { left: pointsLeft, top: pointsTop };
  }, []);

  return (
    <motion.div
      // Start position
      initial={{ opacity: 0, scale: 0, left: `${data.initialLeft}%`, top: `${data.initialTop}%` }}
      // Animate Left/Top properties (CSS Percentages)
      animate={{
        opacity: 1,
        scale: 1,
        left: flightPath.left,
        top: flightPath.top,
        rotate: [0, 20, -20, 10, -10, 30, -30]
      }}
      exit={{ opacity: 0, scale: 0, rotate: 360, transition: { duration: 0.1 } }}
      transition={{
        duration: 6, // 3 seconds to loop through path (Fast but trackable)
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut"
      }}
      // VISUAL SIZE: 30px (Small)
      // HITBOX: The padding makes it easier to click on mobile without making the image huge
      className="absolute z-10 touch-manipulation flex items-center justify-center"
      style={{ width: '50px', height: '50px' }} 
      
      // Events
      onMouseDown={(e) => onSwat(data.id, e)}
      onTouchStart={(e) => onSwat(data.id, e)}
    >
        {/* The Actual Visual Mosquito (30px) */}
        <svg 
            width="30" 
            height="30" 
            viewBox="0 0 100 100" 
            className="drop-shadow-md filter select-none pointer-events-none"
        >
           {/* Wings (Transparent White) */}
           <path d="M50 30 Q10 0 5 30 T50 50" fill="rgba(255, 255, 255, 0.8)" stroke="black" strokeWidth="2" />
           <path d="M50 30 Q90 0 95 30 T50 50" fill="rgba(255, 255, 255, 0.8)" stroke="black" strokeWidth="2" />
           {/* Body (Black) */}
           <ellipse cx="50" cy="50" rx="10" ry="25" fill="#1a1a1a" />
           {/* Head (Red) */}
           <circle cx="50" cy="25" r="10" fill="#cc0000" />
           {/* Legs */}
           <path d="M40 50 L10 80 M60 50 L90 80 M40 40 L5 20 M60 40 L95 20" stroke="black" strokeWidth="3" fill="none" />
        </svg>
    </motion.div>
  );
};

// --- Main Game Component ---
export default function MosquitoGame({ 
  onGameOver, 
  onOpenScoreboard 
}: { 
  onGameOver: (score: number) => void;
  onOpenScoreboard: () => void;
}) {
  const [mosquitoes, setMosquitoes] = useState<MosquitoData[]>([]);
  const [clickEffects, setClickEffects] = useState<ClickEffect[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      setMosquitoes([]); 
      onGameOver(score);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, onGameOver, score]);

  // Spawner
  useEffect(() => {
    let spawnInterval: NodeJS.Timeout;
    if (isActive) {
      spawnInterval = setInterval(() => {
        setMosquitoes((prev) => {
          if (prev.length >= 12) return prev; // Max 12 mosquitoes
          return [...prev, {
            id: Date.now() + Math.random(),
            // Spawn anywhere between 5% and 90% of screen width/height
            initialLeft: Math.random() * 90,
            initialTop: Math.random() * 80,
          }];
        });
      }, 400); // New mosquito every 0.4s
    }
    return () => clearInterval(spawnInterval);
  }, [isActive]);

  // Visual Effect Helper
  const triggerVisualSwat = (x: number, y: number) => {
    const id = Date.now() + Math.random();
    setClickEffects(prev => [...prev, { id, x, y }]);
    setTimeout(() => {
        setClickEffects(prev => prev.filter(e => e.id !== id));
    }, 150);
  };

  // Handle clicks on empty space (misses)
  const handleContainerClick = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isActive) return;
    if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        let clientX, clientY;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            // @ts-ignore
            clientX = e.clientX;
            // @ts-ignore
            clientY = e.clientY;
        }
        // Calculate X/Y relative to the container
        triggerVisualSwat(clientX - rect.left, clientY - rect.top);
    }
  };

  const swatMosquito = (id: number, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation(); // Stop the container click from firing
    if (!isActive) return;

    // Trigger visual at click location
    let clientX, clientY;
    if ('touches' in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        // @ts-ignore
        clientX = e.clientX;
        // @ts-ignore
        clientY = e.clientY;
    }

    if(containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        triggerVisualSwat(clientX - rect.left, clientY - rect.top);
    }

    setMosquitoes((prev) => prev.filter((m) => m.id !== id));
    setScore((prev) => prev + 1);
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(60); 
    setMosquitoes([]);
    setIsActive(true);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* HUD */}
      <div className="flex justify-between w-full max-w-2xl mb-2 font-bold text-xl px-2 select-none">
        <span className="text-green-800 bg-green-100 px-4 py-1 rounded-full border border-green-300 shadow-sm text-lg md:text-xl">
            🦟 {score}
        </span>
        <div className="flex gap-2 md:gap-4 items-center">
            <span className={`px-4 py-1 rounded-full border text-lg md:text-xl shadow-sm ${timeLeft < 10 ? 'bg-red-100 text-red-600 border-red-300 animate-pulse' : 'bg-white text-gray-700 border-gray-300'}`}>
                ⏱ {timeLeft}s
            </span>
            {!isActive && (
                <button onClick={onOpenScoreboard} className="text-xs md:text-sm bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition shadow-md font-bold uppercase tracking-wide">
                    🏆 Ranks
                </button>
            )}
        </div>
      </div>

      {/* Game Window */}
      <div 
        ref={containerRef}
        // h-[60vh] ensures it fits on mobile screens without scrolling
        className="relative w-full max-w-2xl h-[60vh] md:h-[500px] bg-green-50 border-4 border-green-600 rounded-xl overflow-hidden game-area shadow-inner select-none touch-none"
        onClick={handleContainerClick}
        style={{ touchAction: 'none' }} // Crucial for mobile tapping
      >
        {/* Start Button Overlay */}
        {!isActive && timeLeft === 60 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20 backdrop-blur-sm">
                <button 
                    onClick={startGame}
                    className="bg-green-500 hover:bg-green-600 text-white font-black py-4 px-12 rounded-full text-2xl md:text-4xl transition transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(34,197,94,0.6)] border-4 border-white tracking-wider"
                >
                    PLAY
                </button>
            </div>
        )}

        <AnimatePresence mode='popLayout'>
          {mosquitoes.map((m) => (
            <SingleMosquito 
                key={m.id} 
                data={m} 
                onSwat={swatMosquito} 
            />
          ))}
        </AnimatePresence>

        {/* Visual Swat Effects */}
        {clickEffects.map((effect) => (
            <div 
                key={effect.id}
                className="absolute pointer-events-none z-30"
                style={{ 
                    left: effect.x - 30, // Center swatter (60px / 2)
                    top: effect.y - 30,
                    width: '60px',
                    height: '60px',
                    // Swatter Image
                    backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" transform="rotate(-45 12 12)"><line x1="10" y1="14" x2="2" y2="22"></line><path d="M14 10 L10 14"></path><rect x="10" y="2" width="10" height="10" rx="2"></rect><line x1="12" y1="5" x2="18" y2="5"></line><line x1="12" y1="9" x2="18" y2="9"></line><line x1="15" y1="2" x2="15" y2="12"></line></svg>')`,
                    backgroundSize: 'contain',
                    animation: 'swatAnim 0.15s ease-out'
                }}
            />
        ))}
      </div>

      <div className="w-full max-w-2xl mt-3 px-4 text-center">
        <p className="text-gray-400 text-xs uppercase tracking-widest">Tap quickly to swat • Avoid missing</p>
      </div>
    </div>
  );
}