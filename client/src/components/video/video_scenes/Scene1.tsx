import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { sceneTransitions } from '@/lib/video';
import shinhanChar from '@assets/s2_1771764494965.jpg';
import pcScreen from '@assets/s3_1771764494967.png';

export function Scene1() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),  // PC screen zooms out
      setTimeout(() => setPhase(2), 1500), // Character appears with phone
      setTimeout(() => setPhase(3), 2500), // Flash/Camera shutter effect
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 bg-white flex items-center justify-center overflow-hidden"
      {...sceneTransitions.clipCircle}
    >
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />

      {/* PC Screen representation */}
      <motion.div 
        className="absolute z-10 rounded-[1vw] overflow-hidden shadow-2xl border-[0.2vw] border-gray-100"
        initial={{ scale: 1.5, opacity: 0 }}
        animate={{ 
          scale: phase >= 1 ? 0.8 : 1.5,
          opacity: 1,
          y: phase >= 2 ? '-5%' : 0
        }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <img src={pcScreen} alt="PC Screen" className="w-[50vw] h-auto object-cover" />
      </motion.div>

      {/* Character with smartphone (representing someone taking a photo) */}
      {phase >= 2 && (
        <motion.div 
          className="absolute z-20 bottom-[-10%] right-[10%]"
          initial={{ y: 200, opacity: 0, rotate: 10 }}
          animate={{ y: 0, opacity: 1, rotate: -5 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <div className="relative">
            <img src={shinhanChar} alt="Shinhan Character" className="w-[20vw] h-auto object-contain mix-blend-multiply" />
            
            {/* Camera flash effect */}
            {phase >= 3 && (
              <motion.div 
                className="absolute inset-0 bg-white z-30 rounded-full"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [0, 2, 3] }}
                transition={{ duration: 0.5, times: [0, 0.1, 1] }}
              />
            )}
          </div>
        </motion.div>
      )}

      {/* Overlay Text */}
      <motion.div 
        className="absolute top-[10%] left-[10%] z-30 w-[40vw]"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <div className="bg-white/90 backdrop-blur-md p-[2vw] rounded-[1.5vw] border border-gray-100 shadow-xl">
          <h2 className="text-[2.5vw] leading-tight font-display font-bold text-[#1A1A1A] mb-[1vw]">
            사무실에서 누군가가<br />
            PC 화면을 촬영한다면?
          </h2>
          <p className="text-[#8C8C8C] font-body text-[1.5vw]">
            정보 유출의 위험이 발생합니다.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
