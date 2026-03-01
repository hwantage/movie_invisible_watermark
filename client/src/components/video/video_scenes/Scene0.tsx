import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { sceneTransitions } from '@/lib/video';
import somansaLogo from '@assets/logo_somansa_1772350313980.png';

export function Scene0() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),  // Logo appears
      setTimeout(() => setPhase(2), 1200), // Text appears
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 bg-white flex flex-col items-center justify-center overflow-hidden"
      {...sceneTransitions.fadeBlur}
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      
      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-[5vw]"
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.img 
          src={somansaLogo} 
          alt="Somansa Logo" 
          className="w-[50vw] h-auto mb-[4vw]"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
        />
        
        {phase >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-[4vw] font-display font-black text-[#0046FF] mb-[1.5vw] tracking-tight">
              비가시성 워터마크 기능 소개
            </h1>
            <p className="text-[2.2vw] font-body font-medium text-[#4A4A4A] leading-tight">
              화면 촬영을 통한 기업 민감 정보 유출을 방지합니다.
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Decorative elements */}
      <motion.div 
        className="absolute bottom-0 left-0 w-full h-[1vh] bg-[#0046FF]"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
    </motion.div>
  );
}
