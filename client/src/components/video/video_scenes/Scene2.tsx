import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import pcScreen from '@assets/image_1772353151279.png';

export function Scene2() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),  // Warning overlay appears
      setTimeout(() => setPhase(2), 1200), // Screen zooms in
      setTimeout(() => setPhase(3), 3000), // Invisible code starts revealing
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 bg-black flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* PC Screen background (zooming in) */}
      <motion.div 
        className="absolute inset-0 flex items-center justify-center opacity-40"
        initial={{ scale: 0.8 }}
        animate={{ scale: phase >= 2 ? 1.5 : 0.8 }}
        transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <img src={pcScreen} alt="PC Screen" className="w-full h-full object-cover" />
      </motion.div>

      {/* Warning effects */}
      {phase >= 1 && (
        <>
          <motion.div 
            className="absolute inset-0 bg-red-500 mix-blend-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.4, 0.2, 0.5, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
          />
          <motion.div 
            className="absolute inset-0 border-[16px] border-red-500/80"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
        </>
      )}

      {/* Warning Badge */}
      {phase >= 1 && phase < 3 && (
        <motion.div 
          className="relative z-20 bg-black/80 backdrop-blur-xl border border-red-500/50 p-[3vw] rounded-[2vw] text-center shadow-[0_0_100px_rgba(239,68,68,0.4)]"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <AlertTriangle className="w-[6vw] h-[6vw] text-red-500 mx-auto mb-[2vw]" />
          </motion.div>
          <h2 className="text-[4vw] leading-tight font-display font-bold text-white mb-[1.5vw] tracking-tight">
            경고: 무단 촬영 감지
          </h2>
          <p className="text-red-300 font-body text-[2vw]">
            비가시성 워터마크가 보호 중입니다
          </p>
        </motion.div>
      )}

      {/* Invisible Code Reveal (starts subtle) */}
      {phase >= 3 && (
        <motion.div 
          className="absolute inset-0 z-10 flex flex-wrap content-start p-10 opacity-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 1 }}
        >
          {Array.from({ length: 250 }).map((_, i) => (
            <motion.div
              key={i}
              className="text-xs font-mono text-cyan-400 mr-4 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: Math.random() * 0.6 + 0.2 }}
              transition={{
                duration: 0.8,
                delay: Math.random() * 2.5,
                ease: 'easeOut'
              }}
            >
              {Math.random().toString(36).substring(2, 10).toUpperCase()}
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
