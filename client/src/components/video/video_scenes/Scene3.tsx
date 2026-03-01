import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { sceneTransitions } from '@/lib/video';
import { Search, Scan } from 'lucide-react';
import pcScreen from '@assets/image_1772353151279.png';

export function Scene3() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),  // Magnifying glass appears
      setTimeout(() => setPhase(2), 1500), // Glass scans across
      setTimeout(() => setPhase(3), 3000), // Phone app UI reveals
      setTimeout(() => setPhase(4), 4000), // Scan complete
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 bg-[#0F172A] flex items-center justify-center overflow-hidden"
      {...sceneTransitions.morphExpand}
    >
      {/* Deep zoom into PC screen */}
      <motion.div 
        className="absolute inset-0 opacity-20"
        initial={{ scale: 1 }}
        animate={{ scale: 2 }}
        transition={{ duration: 5, ease: "linear" }}
      >
        <img src={pcScreen} alt="PC Screen" className="w-full h-full object-cover grayscale" />
      </motion.div>

      {/* Digital Code Layer (Invisible Watermark) */}
      <div className="absolute inset-0 z-10 overflow-hidden opacity-40">
        <div className="w-[200%] h-[200%] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHRleHQgeD0iMCIgeT0iMjAiIGZpbGw9IiMwMEQyRkYiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZvbnQtc2l6ZT0iMTBweCIgb3BhY2l0eT0iMC41Ij4wMTAxPC90ZXh0Pjwvc3ZnPg==')] animate-scanline" />
      </div>

      {/* Magnifying Glass scanning effect */}
      {phase >= 1 && phase < 3 && (
        <motion.div
          className="absolute z-30 pointer-events-none"
          initial={{ x: '-50vw', y: '-20vh', opacity: 0, scale: 0.5 }}
          animate={{ 
            x: ['-50vw', '10vw', '40vw'], 
            y: ['-20vh', '10vh', '-10vh'],
            opacity: [0, 1, 1],
            scale: [0.5, 1.5, 1.5]
          }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
        >
          <div className="relative flex items-center justify-center w-[20vw] h-[20vw]">
            {/* The lens effect */}
            <div className="absolute inset-0 rounded-full border-[0.3vw] border-[#00D2FF] bg-[#0046FF]/20 backdrop-blur-sm shadow-[0_0_50px_rgba(0,210,255,0.4)]" />
            <Search className="absolute -bottom-[2vw] -right-[2vw] w-[8vw] h-[8vw] text-white drop-shadow-xl opacity-80" />
            
            {/* The revealed code inside the lens */}
            <div className="absolute inset-[1vw] rounded-full overflow-hidden flex items-center justify-center bg-black/40">
              <span className="font-mono text-[#00D2FF] text-[1.5vw] leading-tight font-bold tracking-[0.2em] text-center">
                SOMANSA<br/>SECURE<br/>#892A4B
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Smartphone App Scan Reveal */}
      <AnimatePresence>
        {phase >= 3 && (
          <motion.div
            className="absolute z-40 w-[22vw] h-[45vw] border-[0.8vw] border-[#1A1A1A] rounded-[2.5vw] bg-black overflow-hidden shadow-2xl"
            initial={{ y: '100vh', opacity: 0, rotate: 10 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            {/* App UI */}
            <div className="absolute top-0 inset-x-0 h-[5vw] bg-gradient-to-b from-black/80 to-transparent z-20 flex items-center justify-center">
              <span className="text-white text-[1.2vw] font-display font-medium mt-[1vw]">워터마크 스캐너</span>
            </div>
            
            {/* Camera View (simulated) */}
            <div className="absolute inset-0 bg-[#002B99]/30 backdrop-blur-md flex items-center justify-center">
              {/* Scan box */}
              <motion.div 
                className="w-[15vw] h-[15vw] border-[0.1vw] border-[#00D2FF] relative"
                animate={{ 
                  boxShadow: phase >= 4 ? ['0 0 0px #00D2FF', '0 0 50px #00D2FF', '0 0 20px #00D2FF'] : 'none'
                }}
                transition={{ duration: 1 }}
              >
                {/* Scan line */}
                <motion.div 
                  className="absolute left-0 right-0 h-[0.2vw] bg-[#00D2FF] shadow-[0_0_10px_#00D2FF]"
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                
                {/* Corner markers */}
                <div className="absolute top-[-0.2vw] left-[-0.2vw] w-[1.5vw] h-[1.5vw] border-t-[0.3vw] border-l-[0.3vw] border-white" />
                <div className="absolute top-[-0.2vw] right-[-0.2vw] w-[1.5vw] h-[1.5vw] border-t-[0.3vw] border-r-[0.3vw] border-white" />
                <div className="absolute bottom-[-0.2vw] left-[-0.2vw] w-[1.5vw] h-[1.5vw] border-b-[0.3vw] border-l-[0.3vw] border-white" />
                <div className="absolute bottom-[-0.2vw] right-[-0.2vw] w-[1.5vw] h-[1.5vw] border-b-[0.3vw] border-r-[0.3vw] border-white" />
              </motion.div>
            </div>

            {/* Scan Result overlay */}
            {phase >= 4 && (
              <motion.div 
                className="absolute bottom-[2vw] inset-x-[1.5vw] bg-white rounded-[1vw] p-[1.5vw] shadow-xl"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
              >
                <div className="flex items-center gap-[1vw] mb-[1vw]">
                  <div className="w-[3vw] h-[3vw] shrink-0 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <Scan className="w-[1.5vw] h-[1.5vw]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[1.1vw] text-gray-900">숨겨진 코드 스캔 완료</h4>
                    <p className="text-[0.9vw] text-gray-500">기기 정보가 확인되었습니다</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-[1vw] rounded-[0.5vw] font-mono text-[0.8vw] leading-tight text-[#0046FF] break-all">
                  USER: EMP_49201<br/>
                  DEVICE: PC_MAC_A02<br/>
                  TIME: 2026.02.22
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Explanatory Text */}
      <motion.div 
        className="absolute top-[15%] right-[10%] z-30 w-[35vw] text-right"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
      >
        <h2 className="text-[3vw] leading-tight font-display font-bold text-white mb-[1.5vw]">
          눈에 보이지 않는<br />
          <span className="text-[#00D2FF]">디지털 코드</span>
        </h2>
        <p className="text-[1.5vw] leading-snug text-gray-300 font-body">
          스마트폰 전용 앱으로 비추면<br />
          숨겨진 워터마크가 즉시 스캔됩니다.
        </p>
      </motion.div>
    </motion.div>
  );
}

// Temporary AnimatePresence import for this file
import { AnimatePresence } from 'framer-motion';
