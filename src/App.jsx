// src/App.jsx
import React, { useState, useEffect, useCallback } from 'react';
import './ui/missionDeck.css';
import Parallax2D from './scene/Parallax2D';
import SpriteActor from './scene/SpriteActor';
import MissionHUD from './ui/MissionHUD';
import useFpsMonitor from './engine/useFpsMonitor';

const O2_CYCLE = ['LOW', 'NORMAL', 'HIGH'];

export default function App() {
  const [sol, setSol] = useState(1);
  const [level, setLevel] = useState(1);
  const [countdown, setCountdown] = useState(30);

  // Station states
  const [solarExtended, setSolarExtended] = useState(true);
  const [shieldActive, setShieldActive] = useState(false);
  const [oxygenLevel, setOxygenLevel] = useState('NORMAL');
  const [greenhouseActive, setGreenhouseActive] = useState(false);
  const [commsQueued, setCommsQueued] = useState(false);
  const [activeStation, setActiveStation] = useState('OXYGEN');

  // Space-Weather Alert & Accessibility states
  const [alertModal, setAlertModal] = useState({
    active: true,
    message: 'CME Warning from NASA DONKI! Press [2/S] for Shields or [Esc] to dismiss.',
  });
  const [reducedMotion, setReducedMotion] = useState(false);
  const [graphicsPreset, setGraphicsPreset] = useState('HIGH');

  const fps = useFpsMonitor(graphicsPreset, setGraphicsPreset);

  const handleAdvanceSol = useCallback(() => {
    setSol((prev) => {
      const next = Math.min(prev + 1, 214);
      if (next >= 5 && level < 2) setLevel(2);
      if (next >= 12 && level < 3) setLevel(3);
      return next;
    });
    setCountdown(30);
  }, [level]);

  // Sol 214 Countdown Timer (Automatically pauses in Reduced Motion mode)
  useEffect(() => {
    if (reducedMotion) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          handleAdvanceSol();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [reducedMotion, handleAdvanceSol]);

  return (
    <main
      className={`mission-root ${alertModal ? 'shake-active' : ''} ${
        reducedMotion ? 'reduced-motion' : ''
      }`}
    >
      <Parallax2D
        graphicsPreset={graphicsPreset}
        solarExtended={solarExtended}
        shieldActive={shieldActive}
        greenhouseActive={greenhouseActive}
        commsQueued={commsQueued}
      />

      <SpriteActor activeStation={activeStation} reducedMotion={reducedMotion} />

      <MissionHUD
        sol={sol}
        maxSol={214}
        countdown={countdown}
        level={level}
        solarExtended={solarExtended}
        shieldActive={shieldActive}
        oxygenLevel={oxygenLevel}
        greenhouseActive={greenhouseActive}
        commsQueued={commsQueued}
        alertModal={alertModal}
        reducedMotion={reducedMotion}
        graphicsPreset={graphicsPreset}
        fps={fps}
        onToggleSolar={() => {
          setSolarExtended((v) => !v);
          setActiveStation('SOLAR');
        }}
        onToggleShield={() => {
          setShieldActive((v) => !v);
          setActiveStation('SHIELD');
        }}
        onCycleOxygen={() => {
          setOxygenLevel((curr) => O2_CYCLE[(O2_CYCLE.indexOf(curr) + 1) % O2_CYCLE.length]);
          setActiveStation('OXYGEN');
        }}
        onToggleGreenhouse={() => {
          if (level >= 2) {
            setGreenhouseActive((v) => !v);
            setActiveStation('GREENHOUSE');
          }
        }}
        onToggleComms={() => {
          if (level >= 3) {
            setCommsQueued((v) => !v);
            setActiveStation('COMMS');
          }
        }}
        onAdvanceSol={handleAdvanceSol}
        onDismissAlert={() => setAlertModal(null)}
        onToggleReducedMotion={() => setReducedMotion((v) => !v)}
        onChangeGraphics={setGraphicsPreset}
      />
    </main>
  );
}
