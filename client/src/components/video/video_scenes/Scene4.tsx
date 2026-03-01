import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { sceneTransitions } from '@/lib/video';
import { ShieldCheck } from 'lucide-react';
import characterImg from '@assets/5-2_1772350336689.png';

export function Scene4() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),  // Shield appears
      setTimeout(() => setPhase(2), 1200), // Protection rings expand
      setTimeout(() => setPhase(3), 2000), // Keyword emphasizes
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 bg-[#0046FF] flex items-center justify-center overflow-hidden"
      {...sceneTransitions.splitHorizontal}
    >
      {/* Dynamic Background Pattern */}
      <motion.div 
        className="absolute inset-0 opacity-10"
        animate={{ backgroundPosition: ['0px 0px', '100px 100px'] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}
      />

      {/* Character Center */}
      <motion.div
        className="relative z-20"
        initial={{ scale: 0.5, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        {/* Protection Rings */}
        {phase >= 2 && (
          <>
            {[1, 2, 3].map((ring) => (
              <motion.div
                key={ring}
                className="absolute inset-[-100px] rounded-full border-2 border-[#00D2FF]/40"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                  scale: [0.8, 1.5, 2],
                  opacity: [0, 0.5, 0]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  delay: ring * 0.4,
                  ease: "easeOut"
                }}
              />
            ))}
          </>
        )}

        <div className="relative w-[28vw] h-[28vw] bg-white rounded-full flex items-center justify-center shadow-2xl p-[1vw]">
          <img src={characterImg} alt="Character" className="w-[85%] h-auto object-contain" />
          
          {/* Shield Overlay */}
          {phase >= 1 && (
            <motion.div
              className="absolute -right-[2vw] -bottom-[2vw] bg-[#00D2FF] text-white p-[1.5vw] rounded-full shadow-lg border-[0.3vw] border-white"
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", bounce: 0.6, delay: 0.2 }}
            >
              <ShieldCheck className="w-[5vw] h-[5vw]" />
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Typography */}
      <div className="absolute top-[15%] inset-x-0 text-center z-30">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <span className="inline-block px-4 py-1 rounded-full bg-white/20 text-[#00D2FF] font-mono font-bold text-sm tracking-widest mb-4 backdrop-blur-sm border border-white/10">
            SECURITY ACTIVE
          </span>
        </motion.div>
        
        <motion.h2 
          className="text-[5vw] font-display font-black text-white"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, type: "spring" }}
        >
          직원과 자산을 안전하게
        </motion.h2>
        
        {phase >= 3 && (
          <motion.div
            className="mt-6 text-[8vw] font-black tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 opacity-20 absolute inset-x-0 -z-10 -top-20 pointer-events-none select-none"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.2 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            보호
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
