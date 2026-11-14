// src/App.jsx
import React, { useState, useEffect, useCallback } from 'react';
import './ui/missionDeck.css';
import Parallax2D from './scene/Parallax2D.jsx';
import SpriteActor from './scene/SpriteActor.jsx';
import MissionHUD from './ui/MissionHUD.jsx';
import WelcomeScreen from './ui/WelcomeScreen.jsx';
import BriefingScreen, { CREW_ROSTER } from './ui/BriefingScreen.jsx';
import useFpsMonitor from './engine/useFpsMonitor.js';

const O2_CYCLE = ['LOW', 'NORMAL', 'HIGH'];
const LEVEL_SOLS = { 1: 14, 2: 21, 3: 28 };

export default function App() {
  // 3-step screen flow: 'WELCOME' -> 'BRIEFING' -> 'PLAYING'
  const [screen, setScreen] = useState('WELCOME');
  const [level, setLevel] = useState(1);
  const [selectedCharacter, setSelectedCharacter] = useState(CREW_ROSTER[0]);

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

  const handleStartGame = () => {
    setSol(1);
    setCountdown(30);
    setScreen('PLAYING');
  };

  const handleAdvanceSol = useCallback(() => {
    setSol((prev) => Math.min(prev + 1, maxSol));
    setCountdown(30);
  }, [maxSol]);

  useEffect(() => {
    if (screen !== 'PLAYING' || reducedMotion) return;
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
  }, [screen, reducedMotion, handleAdvanceSol]);

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

      {screen === 'WELCOME' && (
        <WelcomeScreen
          selectedLevel={level}
          onSelectLevel={setLevel}
          onStartMission={() => setScreen('BRIEFING')}
          reducedMotion={reducedMotion}
          onToggleReducedMotion={() => setReducedMotion((v) => !v)}
          graphicsPreset={graphicsPreset}
          onChangeGraphics={setGraphicsPreset}
        />
      )}

      {screen === 'BRIEFING' && (
        <BriefingScreen
          selectedLevel={level}
          selectedCharacter={selectedCharacter}
          onSelectCharacter={setSelectedCharacter}
          onBackToWelcome={() => setScreen('WELCOME')}
          onStartGame={handleStartGame}
        />
      )}

      {screen === 'PLAYING' && (
        <>
          <SpriteActor
            activeStation={activeStation}
            reducedMotion={reducedMotion}
            character={selectedCharacter}
          />

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
