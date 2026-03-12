// Video Template - Wires up scenes with useVideoPlayer

import { motion, AnimatePresence } from 'framer-motion';
import { useVideoPlayer } from '@/lib/video';
import { Scene0 } from './video_scenes/Scene0';
import { Scene1 } from './video_scenes/Scene1';
import { Scene2 } from './video_scenes/Scene2';
import { Scene3 } from './video_scenes/Scene3';
import { Scene4 } from './video_scenes/Scene4';
import { Scene5 } from './video_scenes/Scene5';
import { Scene6 } from './video_scenes/Scene6';

// Define scene durations in milliseconds
const SCENE_DURATIONS = {
  intro: 3000,
  office_scenario: 5000,
  warning_alert: 5500,
  scanner_reveal: 7000,
  print_watermark: 7000,
  protection: 5000,
  outro_logo: 5000,
};

export default function VideoTemplate() {
  let { currentScene } = useVideoPlayer({
    durations: SCENE_DURATIONS,
  });

  //currentScene = 6;

  return (
    <div
      className="w-full h-screen overflow-hidden relative"
      style={{ backgroundColor: 'var(--color-bg-dark)' }}
    >
      <motion.div
        className="absolute pointer-events-none z-50 w-[40vw] h-[40vw] rounded-full blur-[100px] opacity-20 mix-blend-screen"
        animate={{
          x: ['-20vw', '50vw', '20vw', '80vw', '64vw', '30vw', '10vw'][currentScene],
          y: ['-20vh', '40vh', '-10vh', '60vh', '18vh', '-10vh', '20vh'][currentScene],
          background: [
            'radial-gradient(circle, #0046FF 0%, transparent 70%)',
            'radial-gradient(circle, #0046FF 0%, transparent 70%)',
            'radial-gradient(circle, #EF4444 0%, transparent 70%)',
            'radial-gradient(circle, #00D2FF 0%, transparent 70%)',
            'radial-gradient(circle, #38BDF8 0%, transparent 70%)',
            'radial-gradient(circle, #0046FF 0%, transparent 70%)',
            'radial-gradient(circle, #002B99 0%, transparent 70%)',
          ][currentScene]
        }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      />

      <AnimatePresence mode="popLayout">
        {currentScene === 0 && <Scene0 key="scene0" />}
        {currentScene === 1 && <Scene1 key="scene1" />}
        {currentScene === 2 && <Scene2 key="scene2" />}
        {currentScene === 3 && <Scene3 key="scene3" />}
        {currentScene === 4 && <Scene4 key="scene4" />}
        {currentScene === 5 && <Scene5 key="scene5" />}
        {currentScene === 6 && <Scene6 key="scene6" />}
      </AnimatePresence>
    </div>
  );
}
