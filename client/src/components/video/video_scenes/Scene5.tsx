import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { sceneTransitions } from '@/lib/video';
import somansaLogo from '@assets/logo_somansa_1772350313980.png';

export function Scene5() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 800),  // Subtext reveals
      setTimeout(() => setPhase(2), 2500), // Exit transition starts
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 bg-white flex flex-col items-center justify-center overflow-hidden"
      {...sceneTransitions.fadeBlur}
    >
      {/* Minimal clean background for logo */}
      <motion.div 
        className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#0046FF] to-transparent"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.2 }}
      />

      <motion.div
        className="relative z-10 flex flex-col items-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <img 
          src={somansaLogo} 
          alt="Somansa Logo" 
          className="h-[10vw] w-auto object-contain" 
        />
        
        {phase >= 1 && (
          <motion.div
            className="mt-[3vw] text-center"
            initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[#0046FF] font-display font-medium tracking-[0.2em] text-[1.2vw] mb-[1vw]">
              INVISIBLE WATERMARK SECURITY
            </p>
            <h3 className="text-[2.5vw] font-body font-bold text-gray-800">
              안전한 보안의 기준, 소만사
            </h3>
          </motion.div>
        )}
      </motion.div>

      {/* Subtle particle effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#0046FF] rounded-full"
            initial={{ 
              x: `${Math.random() * 100}vw`, 
              y: `${100 + Math.random() * 20}vh`,
              opacity: Math.random() * 0.5 + 0.2
            }}
            animate={{ 
              y: `-20vh`,
              x: `+=${(Math.random() - 0.5) * 100}px`
            }}
            transition={{ 
              duration: 5 + Math.random() * 5, 
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear"
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
