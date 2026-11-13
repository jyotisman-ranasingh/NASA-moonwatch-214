import { useEffect, useRef, useState } from 'react';

const PRESET_ORDER = ['HIGH', 'MEDIUM', 'LOW'];

export function useFpsMonitor(graphicsPreset, setGraphicsPreset, autoDowngrade = true) {
  const [fps, setFps] = useState(60);
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const lowFpsStreak = useRef(0);

  useEffect(() => {
    let animationFrameId;

    const tick = (now) => {
      frameCount.current += 1;
      const elapsed = now - lastTime.current;

      if (elapsed >= 1000) {
        const currentFps = Math.round((frameCount.current * 1000) / elapsed);
        setFps(currentFps);
        frameCount.current = 0;
        lastTime.current = now;

        if (autoDowngrade && currentFps < 30) {
          lowFpsStreak.current += 1;
          if (lowFpsStreak.current >= 3) {
            setGraphicsPreset((prev) => {
              const idx = PRESET_ORDER.indexOf(prev);
              return idx < PRESET_ORDER.length - 1 ? PRESET_ORDER[idx + 1] : prev;
            });
            lowFpsStreak.current = 0;
          }
        } else {
          lowFpsStreak.current = 0;
        }
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, [autoDowngrade, setGraphicsPreset]);

  return fps;
}
