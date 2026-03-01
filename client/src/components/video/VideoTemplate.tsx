// Video Template - Wires up scenes with useVideoPlayer

import { motion, AnimatePresence } from 'framer-motion';
import { useVideoPlayer } from '@/lib/video';
import { Scene0 } from './video_scenes/Scene0';
import { Scene1 } from './video_scenes/Scene1';
import { Scene2 } from './video_scenes/Scene2';
import { Scene3 } from './video_scenes/Scene3';
import { Scene4 } from './video_scenes/Scene4';
import { Scene5 } from './video_scenes/Scene5';

// Define scene durations in milliseconds
const SCENE_DURATIONS = {
  intro: 3000,
  office_scenario: 4000,
  warning_alert: 3500,
  scanner_reveal: 5500,
  protection: 4000,
  outro_logo: 4500,
};

export default function VideoTemplate() {
  const { currentScene } = useVideoPlayer({
    durations: SCENE_DURATIONS,
  });

  return (
    <div
      className="w-full h-screen overflow-hidden relative"
      style={{ backgroundColor: 'var(--color-bg-dark)' }}
    >
      {/* 
        Persistent background/midground elements can go here.
        They live outside AnimatePresence so they transform smoothly across scenes
        instead of unmounting.
      */}
      <motion.div 
        className="absolute pointer-events-none z-50 w-[40vw] h-[40vw] rounded-full blur-[100px] opacity-20 mix-blend-screen"
        animate={{
          x: ['-20vw', '50vw', '20vw', '80vw', '30vw', '10vw'][currentScene],
          y: ['-20vh', '40vh', '-10vh', '60vh', '-10vh', '20vh'][currentScene],
          background: [
            'radial-gradient(circle, #0046FF 0%, transparent 70%)',
            'radial-gradient(circle, #0046FF 0%, transparent 70%)',
            'radial-gradient(circle, #EF4444 0%, transparent 70%)',
            'radial-gradient(circle, #00D2FF 0%, transparent 70%)',
            'radial-gradient(circle, #0046FF 0%, transparent 70%)',
            'radial-gradient(circle, #002B99 0%, transparent 70%)',
          ][currentScene]
        }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* mode="popLayout" = new snaps in while old animates out */}
      <AnimatePresence mode="popLayout">
        {currentScene === 0 && <Scene0 key="scene0" />}
        {currentScene === 1 && <Scene1 key="scene1" />}
        {currentScene === 2 && <Scene2 key="scene2" />}
        {currentScene === 3 && <Scene3 key="scene3" />}
        {currentScene === 4 && <Scene4 key="scene4" />}
        {currentScene === 5 && <Scene5 key="scene5" />}
      </AnimatePresence>
    </div>
  );
}
