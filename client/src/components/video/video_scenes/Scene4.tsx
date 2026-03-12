import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { sceneTransitions } from '@/lib/video';
import { Scan, Printer } from 'lucide-react';
import printerImg from '@assets/printer.jpg';

export function Scene4() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),   // 문서 출력 시작
      setTimeout(() => setPhase(2), 2800),  // 출력 완료 후 → 텍스트 + 스마트폰 등장
      setTimeout(() => setPhase(3), 3800),  // 워터마크 감지
      setTimeout(() => setPhase(4), 5300),  // 감지 완료 결과
      setTimeout(() => setPhase(5), 6300),  // 텍스트 강조
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 bg-[#0F172A] flex items-center justify-center overflow-hidden"
      {...sceneTransitions.crossDissolve}
    >
      {/* 프린터 배경 이미지 */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.1, opacity: 0.5 }}
        animate={{ scale: 1, opacity: 0.7 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      >
        <img src={printerImg} alt="Printer" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-l from-[#0F172A] via-[#0F172A]/80 to-transparent" />
      </motion.div>

      {/* ===== 오른쪽: 텍스트 영역 (문서 출력과 함께 등장) ===== */}
      <motion.div
        className="absolute right-[6%] top-0 bottom-0 w-[40vw] z-30 flex flex-col justify-center items-end text-right"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* 프린터 아이콘 배지 */}
        <motion.div
          className="inline-flex items-center gap-[0.6vw] px-[1.2vw] py-[0.5vw] rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-[2vw]"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Printer className="w-[1.4vw] h-[1.4vw] text-[#00D2FF]" />
          <span className="font-mono text-[1vw] text-[#00D2FF] tracking-widest font-bold">PRINT INVISIBLE WATERMARK</span>
        </motion.div>

        <h2 className="text-[3.5vw] leading-[1.15] font-display font-black text-white mb-[2vw]">
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
          >
            프린트에도
          </motion.span>
          <motion.span
            className="block text-[#00D2FF]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            보이지 않는 워터마크
          </motion.span>
        </h2>

        <motion.div
          className="h-[0.2vw] w-[6vw] bg-gradient-to-l from-[#00D2FF] to-transparent mb-[2vw] ml-auto"
          initial={{ scaleX: 0, originX: 1 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.5, duration: 0.8, ease: 'easeOut' }}
        />

        <motion.p
          className="text-[1.6vw] leading-relaxed text-gray-300 font-body max-w-[32vw]"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7, duration: 0.7 }}
        >
          훼손된 문서 일부 조각만으로도<br />
          <span className="text-white font-semibold">출처 확인</span>이 가능합니다.
        </motion.p>
      </motion.div>

      {/* ===== 왼쪽: A4 문서 + 스마트폰 스캐너 ===== */}
      <div className="absolute left-[4%] top-0 bottom-0 z-20 w-[50vw] flex items-center justify-center">

        {/* A4 출력 문서 (비율 1:1.414) — 프린터에서 출력되는 효과 */}
        <motion.div
          className="absolute left-[calc(15vw-40px)] w-[28vw] h-[39.6vw] max-h-[85vh]"
          style={{ marginTop: '-100px' }}
          initial={{ opacity: 1, y: 20, clipPath: 'inset(100% 0 0 0)' }}
          animate={{ opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)' }}
          transition={{ delay: 0.3, duration: 2, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="relative w-full h-full bg-gray-100 shadow-2xl overflow-hidden">
            {/* 문서 상단 CONFIDENTIAL 띠 */}
            <div className="bg-gray-50 border-b border-gray-200 px-[1.2vw] py-[0.6vw] flex items-center justify-between">
              <span className="font-mono text-[0.55vw] text-gray-600 font-bold tracking-widest">CONFIDENTIAL</span>
              <span className="font-mono text-[0.55vw] text-gray-400 tracking-wider">반도체 설계도면</span>
            </div>

            {/* 반도체 도면 콘텐츠 */}
            <div className="p-[1.2vw] flex flex-col h-[calc(100%-2.5vw)]">
              {/* 도면 타이틀 */}
              <div className="mb-[0.8vw]">
                <h4 className="font-mono font-bold text-[0.85vw] text-gray-800 mb-[0.2vw]">SoC Layout - Rev.3.2</h4>
                <p className="font-mono text-[0.5vw] text-gray-400">SEMICONDUCTOR CHIP DESIGN / LAYER: M1-M8 / SCALE: 1:500</p>
              </div>

              {/* 도면 그리드 영역 */}
              <div className="relative flex-1 bg-white border border-gray-300 rounded-[0.2vw] overflow-hidden">
                {/* 그리드 패턴 */}
                <div className="absolute inset-0" style={{
                  backgroundSize: '1.2vw 1.2vw',
                  backgroundImage: 'linear-gradient(to right, #E5E7EB 1px, transparent 1px), linear-gradient(to bottom, #E5E7EB 1px, transparent 1px)'
                }} />

                {/* 칩 레이아웃 SVG (흑백 인쇄) */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 500" preserveAspectRatio="xMidYMid meet">
                  {/* 외곽 다이 */}
                  <rect x="30" y="20" width="340" height="460" fill="none" stroke="#6B7280" strokeWidth="1.5" />
                  {/* 코어 블록들 */}
                  <rect x="50" y="40" width="140" height="80" fill="#F3F4F6" stroke="#4B5563" strokeWidth="1.5" rx="2" />
                  <text x="120" y="85" textAnchor="middle" fill="#1F2937" fontFamily="monospace" fontSize="12">CPU Core</text>
                  <rect x="210" y="40" width="140" height="80" fill="#F3F4F6" stroke="#4B5563" strokeWidth="1.5" rx="2" />
                  <text x="280" y="85" textAnchor="middle" fill="#1F2937" fontFamily="monospace" fontSize="12">GPU</text>
                  {/* NPU */}
                  <rect x="50" y="140" width="140" height="70" fill="#F9FAFB" stroke="#6B7280" strokeWidth="1.5" rx="2" />
                  <text x="120" y="180" textAnchor="middle" fill="#1F2937" fontFamily="monospace" fontSize="12">NPU</text>
                  <rect x="210" y="140" width="140" height="70" fill="#F9FAFB" stroke="#6B7280" strokeWidth="1.5" rx="2" />
                  <text x="280" y="180" textAnchor="middle" fill="#1F2937" fontFamily="monospace" fontSize="12">DSP</text>
                  {/* 메모리 */}
                  <rect x="50" y="230" width="300" height="60" fill="#E5E7EB" stroke="#4B5563" strokeWidth="1.5" rx="2" />
                  <text x="200" y="265" textAnchor="middle" fill="#1F2937" fontFamily="monospace" fontSize="12">SRAM 256KB</text>
                  {/* 배선 */}
                  <line x1="120" y1="120" x2="120" y2="140" stroke="#374151" strokeWidth="1" />
                  <line x1="280" y1="120" x2="280" y2="140" stroke="#374151" strokeWidth="1" />
                  <line x1="120" y1="210" x2="120" y2="230" stroke="#374151" strokeWidth="1" />
                  <line x1="280" y1="210" x2="280" y2="230" stroke="#374151" strokeWidth="1" />
                  {/* I/O + PHY */}
                  <rect x="50" y="310" width="140" height="70" fill="#F3F4F6" stroke="#6B7280" strokeWidth="1.5" rx="2" />
                  <text x="120" y="350" textAnchor="middle" fill="#1F2937" fontFamily="monospace" fontSize="12">PHY Layer</text>
                  <rect x="210" y="310" width="140" height="70" fill="#F3F4F6" stroke="#6B7280" strokeWidth="1.5" rx="2" />
                  <text x="280" y="350" textAnchor="middle" fill="#1F2937" fontFamily="monospace" fontSize="12">SerDes / PLL</text>
                  {/* I/O 블록 */}
                  <rect x="50" y="400" width="300" height="50" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="1.5" rx="2" />
                  <text x="200" y="430" textAnchor="middle" fill="#374151" fontFamily="monospace" fontSize="11">I/O Ring &amp; Pad Frame</text>
                </svg>

                {/* 비가시성 워터마크 (매우 연한 반복 텍스트) */}
                <div className="absolute inset-0 overflow-hidden opacity-[0.03] pointer-events-none select-none rotate-[-20deg] scale-150">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="whitespace-nowrap font-mono text-[0.7vw] text-gray-800 leading-[2vw]">
                      SOMANSA_WM_ID:892A4B &nbsp; SOMANSA_WM_ID:892A4B &nbsp; SOMANSA_WM_ID:892A4B &nbsp; SOMANSA_WM_ID:892A4B
                    </div>
                  ))}
                </div>

              </div>

              {/* 도면 하단 정보 */}
              <div className="flex justify-between items-center mt-[0.4vw]">
                <span className="font-mono text-[0.5vw] text-gray-400">DWG NO: SC-2026-0322-A</span>
                <span className="font-mono text-[0.5vw] text-gray-400">DATE: 2026.03.07</span>
              </div>
            </div>

            {/* 워터마크 감지 표시 - 스캔 완료 후 문서 위에 드러남 */}
            <AnimatePresence>
              {phase >= 3 && (
                <motion.div
                  className="absolute inset-0 z-20 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="absolute inset-0 overflow-hidden opacity-25 rotate-[-20deg] scale-150">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="whitespace-nowrap font-mono text-[0.7vw] text-[#EF4444] leading-[2vw]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0.6] }}
                        transition={{ delay: i * 0.1, duration: 0.8 }}
                      >
                        SOMANSA_WM_ID:892A4B &nbsp; SOMANSA_WM_ID:892A4B &nbsp; SOMANSA_WM_ID:892A4B &nbsp; SOMANSA_WM_ID:892A4B
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 디지털 코드 레이어 - 스캔 시작 시 문서 전체에 흘러내림 */}
            <AnimatePresence>
              {phase >= 2 && (
                <motion.div
                  className="absolute inset-0 z-10 overflow-hidden pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 2 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                >
                  <div className="w-[200%] h-[200%] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHRleHQgeD0iMCIgeT0iMjAiIGZpbGw9IiMwMEQyRkYiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZvbnQtc2l6ZT0iMTBweCIgb3BhY2l0eT0iMC41Ij4wMTAxPC90ZXh0Pjwvc3ZnPg==')] animate-scanline" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ===== 스마트폰 스캐너 앱 (Scene3과 동일 구조) ===== */}
        <AnimatePresence>
          {phase >= 2 && (
            <motion.div
              className="absolute right-0 z-40 w-[16vw] h-[33vw] border-[0.6vw] border-[#1A1A1A] rounded-[2vw] bg-black overflow-hidden shadow-2xl"
              style={{ right: 'calc(-2vw + 100px)', marginTop: '40px' }}
              initial={{ y: '100vh', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            >
              {/* App UI */}
              <div className="absolute top-0 inset-x-0 h-[3.5vw] bg-gradient-to-b from-black/80 to-transparent z-20 flex items-center justify-center">
                <span className="text-white text-[0.9vw] font-display font-medium mt-[0.8vw]">워터마크 스캐너</span>
              </div>

              {/* Camera View */}
              <div className="absolute inset-0 bg-[#002B99]/30 backdrop-blur-md flex items-center justify-center">
                {/* Scan box */}
                <motion.div
                  className="w-[10vw] h-[10vw] border-[0.1vw] border-[#00D2FF] relative"
                  animate={{
                    boxShadow: phase >= 4 ? ['0 0 0px #00D2FF', '0 0 50px #00D2FF', '0 0 20px #00D2FF'] : 'none'
                  }}
                  transition={{ duration: 1 }}
                >
                  {/* Scan line */}
                  <motion.div
                    className="absolute left-0 right-0 h-[0.2vw] bg-[#00D2FF] shadow-[0_0_10px_#00D2FF]"
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  />

                  {/* Corner markers */}
                  <div className="absolute top-[-0.15vw] left-[-0.15vw] w-[1.2vw] h-[1.2vw] border-t-[0.25vw] border-l-[0.25vw] border-white" />
                  <div className="absolute top-[-0.15vw] right-[-0.15vw] w-[1.2vw] h-[1.2vw] border-t-[0.25vw] border-r-[0.25vw] border-white" />
                  <div className="absolute bottom-[-0.15vw] left-[-0.15vw] w-[1.2vw] h-[1.2vw] border-b-[0.25vw] border-l-[0.25vw] border-white" />
                  <div className="absolute bottom-[-0.15vw] right-[-0.15vw] w-[1.2vw] h-[1.2vw] border-b-[0.25vw] border-r-[0.25vw] border-white" />
                </motion.div>
              </div>

              {/* Scan Result overlay */}
              {phase >= 4 && (
                <motion.div
                  className="absolute bottom-[1.5vw] inset-x-[1vw] bg-white rounded-[0.8vw] p-[1vw] shadow-xl"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                >
                  <div className="flex items-center gap-[0.6vw] mb-[0.6vw]">
                    <div className="w-[2.2vw] h-[2.2vw] shrink-0 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <Scan className="w-[1.1vw] h-[1.1vw]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[0.8vw] text-gray-900">인쇄물 워터마크 감지</h4>
                      <p className="text-[0.65vw] text-gray-500">비가시성 코드 추출 완료</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-[0.6vw] rounded-[0.4vw] font-mono text-[0.6vw] leading-tight text-[#0046FF] break-all">
                    USER: EMP_49201<br/>
                    PRINT: HP_CLJ_3F_07<br/>
                    PAGES: 3 / WM: DETECTED<br/>
                    TIME: 2026.03.07 14:23
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
