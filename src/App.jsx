// src/App.jsx
import React, { useState, useEffect, useCallback } from 'react';
import './ui/missionDeck.css';
import Parallax2D from './scene/Parallax2D';
import SpriteActor from './scene/SpriteActor';
import MissionHUD from './ui/MissionHUD.jsx';
import WelcomeScreen from './ui/WelcomeScreen.jsx';
import useFpsMonitor from './engine/useFpsMonitor';

const O2_CYCLE = ['LOW', 'NORMAL', 'HIGH'];
const LEVEL_SOLS = { 1: 14, 2: 21, 3: 28 };

export default function App() {
  // Mission flow state (Starts on WelcomeScreen first!)
  const [missionStarted, setMissionStarted] = useState(false);
  const [level, setLevel] = useState(1);
  const [sol, setSol] = useState(1);
  const [countdown, setCountdown] = useState(30);

  // Station states
  const [solarExtended, setSolarExtended] = useState(true);
  const [shieldActive, setShieldActive] = useState(false);
  const [oxygenLevel, setOxygenLevel] = useState('NORMAL');
  const [greenhouseActive, setGreenhouseActive] = useState(false);
  const [commsQueued, setCommsQueued] = useState(false);
  const [activeStation, setActiveStation] = useState('OXYGEN');

  // Space-Weather Alert & Accessibility states
  const [alertModal, setAlertModal] = useState(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [graphicsPreset, setGraphicsPreset] = useState('HIGH');

  const fps = useFpsMonitor(graphicsPreset, setGraphicsPreset);
  const maxSol = LEVEL_SOLS[level] || 14;

  const handleStartMission = () => {
    setSol(1);
    setCountdown(30);
    setMissionStarted(true);
  };

  const handleAdvanceSol = useCallback(() => {
    setSol((prev) => Math.min(prev + 1, maxSol));
    setCountdown(30);
  }, [maxSol]);

  // Countdown only runs AFTER the player clicks "Start Mission ->" and when Reduced Motion is OFF
  useEffect(() => {
    if (!missionStarted || reducedMotion) return;
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
  }, [missionStarted, reducedMotion, handleAdvanceSol]);

  return (
    <main
      className={`mission-root ${alertModal ? 'shake-active' : ''} ${
        reducedMotion ? 'reduced-motion' : ''
      }`}
    >
      {/* Keep the 2D Lunar Base rendered behind the Welcome Screen for a cool animated backdrop */}
      <Parallax2D
        graphicsPreset={graphicsPreset}
        solarExtended={solarExtended}
        shieldActive={shieldActive}
        greenhouseActive={greenhouseActive}
        commsQueued={commsQueued}
      />

      {!missionStarted ? (
        <WelcomeScreen
          selectedLevel={level}
          onSelectLevel={setLevel}
          onStartMission={handleStartMission}
          reducedMotion={reducedMotion}
          onToggleReducedMotion={() => setReducedMotion((v) => !v)}
          graphicsPreset={graphicsPreset}
          onChangeGraphics={setGraphicsPreset}
        />
      ) : (
        <>
          <SpriteActor activeStation={activeStation} reducedMotion={reducedMotion} />

          <MissionHUD
            sol={sol}
            maxSol={maxSol}
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
        </>
      )}
    </main>
  );
}
