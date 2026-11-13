import React, { useState, useEffect, useCallback } from 'react';
import LunarViewport from './components/LunarViewport';
import ControlDeck from './components/ControlDeck';
import { useFpsMonitor } from './hooks/useFpsMonitor';

const OXYGEN_MODES = ['LOW', 'NORMAL', 'HIGH'];

export default function App() {
  // Mission Progression State
  const [sol, setSol] = useState(1);
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(15);

  // Subsystem States
  const [solarExtended, setSolarExtended] = useState(true);
  const [shieldActive, setShieldActive] = useState(false);
  const [oxygenLevel, setOxygenLevel] = useState('NORMAL');
  const [greenhouseActive, setGreenhouseActive] = useState(false);
  const [commsQueued, setCommsQueued] = useState(false);

  // Resource Gauges
  const [power, setPower] = useState(85);
  const [integrity, setIntegrity] = useState(95);
  const [oxygenStore, setOxygenStore] = useState(80);

  // Character X-position inside viewport (moves to whichever station you control)
  const [characterPos, setCharacterPos] = useState(395);

  // Space-Weather Modal & Event Log
  const [activeAlert, setActiveAlert] = useState(null);
  const [eventLog, setEventLog] = useState('Welcome to Lunar Outpost 214. Use hotkeys 1–5 to manage base systems.');

  // Accessibility & Graphics Settings
  const [reducedMotion, setReducedMotion] = useState(false);
  const [graphicsPreset, setGraphicsPreset] = useState('HIGH');
  const fps = useFpsMonitor(graphicsPreset, setGraphicsPreset, true);

  // Action Handlers (also move character to the corresponding station)
  const toggleSolar = useCallback(() => {
    setCharacterPos(130);
    setSolarExtended((prev) => {
      const next = !prev;
      setEventLog(`Solar Panels ${next ? 'EXTENDED' : 'RETRACTED'}.`);
      return next;
    });
  }, []);

  const toggleShield = useCallback(() => {
    setCharacterPos(340);
    setShieldActive((prev) => {
      const next = !prev;
      setEventLog(`Magnetic Shield Dome ${next ? 'ACTIVATED' : 'DEACTIVATED'}.`);
      return next;
    });
  }, []);

  const cycleOxygen = useCallback(() => {
    setCharacterPos(400);
    setOxygenLevel((prev) => {
      const next = OXYGEN_MODES[(OXYGEN_MODES.indexOf(prev) + 1) % OXYGEN_MODES.length];
      setEventLog(`Habitat Oxygen flow set to ${next}.`);
      return next;
    });
  }, []);

  const toggleGreenhouse = useCallback(() => {
    if (level < 2) {
      setEventLog('Greenhouse controls require Clearance Level 2 (Reach Sol 3).');
      return;
    }
    setCharacterPos(555);
    setGreenhouseActive((prev) => {
      const next = !prev;
      setEventLog(`Greenhouse watering & crop tending ${next ? 'STARTED' : 'PAUSED'}.`);
      return next;
    });
  }, [level]);

  const toggleComms = useCallback(() => {
    if (level < 3) {
      setEventLog('Earth Comms array requires Clearance Level 3 (Reach Sol 6).');
      return;
    }
    setCharacterPos(690);
    setCommsQueued((prev) => {
      const next = !prev;
      setEventLog(`Earth telemetry transmission ${next ? 'QUEUED' : 'CANCELLED'}.`);
      return next;
    });
  }, [level]);

  const advanceSol = useCallback(() => {
    setSol((prevSol) => {
      const nextSol = Math.min(214, prevSol + 1);

      // Unlock progressive clearance levels
      if (nextSol >= 6) setLevel(3);
      else if (nextSol >= 3) setLevel(2);

      // Calculate resource shifts per Sol
      const powerDelta = (solarExtended ? 12 : -8) - (shieldActive ? 10 : 0) - (commsQueued ? 5 : 0);
      const o2Delta = oxygenLevel === 'HIGH' ? -10 : oxygenLevel === 'NORMAL' ? -4 : 3;
      const greenBonus = greenhouseActive ? 6 : 0;

      setPower((p) => Math.max(0, Math.min(100, p + powerDelta)));
      setOxygenStore((o) => Math.max(0, Math.min(100, o + o2Delta + greenBonus)));

      // Trigger Space-Weather Alert every 4th Sol
      if (nextSol % 4 === 0) {
        setActiveAlert({
          title: 'SOLAR FLARE CLASS M4.2',
          message:
            'Coronal mass ejection detected! Retract extended solar panels or engage the Shield Dome to prevent hull & array damage.',
        });
        if (!shieldActive) {
          setIntegrity((i) => Math.max(0, i - 15));
        }
      }

      setEventLog(`Advanced to Sol ${nextSol}. Clearance Level ${nextSol >= 6 ? 3 : nextSol >= 3 ? 2 : 1}.`);
      return nextSol;
    });
    setTimeLeft(15);
  }, [solarExtended, shieldActive, commsQueued, oxygenLevel, greenhouseActive]);

  // Sol 214 Countdown Timer (Pauses automatically when Reduced Motion is active)
  useEffect(() => {
    if (reducedMotion || activeAlert) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          advanceSol();
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [reducedMotion, activeAlert, advanceSol]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore shortcuts if typing inside a text input
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      const key = e.key.toLowerCase();

      if (key === 'escape') {
        if (activeAlert) {
          e.preventDefault();
          setActiveAlert(null);
          setEventLog('Space-Weather Alert dismissed.');
        }
        return;
      }

      if (key === '1' || key === 'p') {
        e.preventDefault();
        toggleSolar();
      } else if (key === '2' || key === 's') {
        e.preventDefault();
        toggleShield();
      } else if (key === '3' || key === 'o') {
        e.preventDefault();
        cycleOxygen();
      } else if (key === '4' || key === 'g') {
        e.preventDefault();
        toggleGreenhouse();
      } else if (key === '5' || key === 'c') {
        e.preventDefault();
        toggleComms();
      } else if (e.code === 'Space' || key === 'enter') {
        e.preventDefault();
        advanceSol();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    activeAlert,
    toggleSolar,
    toggleShield,
    cycleOxygen,
    toggleGreenhouse,
    toggleComms,
    advanceSol,
  ]);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#020617',
        color: '#f8fafc',
        padding: '20px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div style={{ maxWidth: '920px', margin: '0 auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h1 style={{ margin: 0, fontSize: '20px', fontFamily: 'monospace', letterSpacing: '1px' }}>
            NASA MOONWATCH-214 // BASE OPERATIONS
          </h1>
          <span style={{ fontSize: '12px', color: '#94a3b8', fontFamily: 'monospace' }}>
            {eventLog}
          </span>
        </header>

        <LunarViewport
          sol={sol}
          level={level}
          solarExtended={solarExtended}
          shieldActive={shieldActive}
          oxygenLevel={oxygenLevel}
          greenhouseActive={greenhouseActive}
          commsQueued={commsQueued}
          activeAlert={activeAlert}
          onDismissAlert={() => setActiveAlert(null)}
          reducedMotion={reducedMotion}
          graphicsPreset={graphicsPreset}
          characterPos={characterPos}
        />

        <ControlDeck
          power={power}
          integrity={integrity}
          oxygenStore={oxygenStore}
          level={level}
          solarExtended={solarExtended}
          shieldActive={shieldActive}
          oxygenLevel={oxygenLevel}
          greenhouseActive={greenhouseActive}
          commsQueued={commsQueued}
          onToggleSolar={toggleSolar}
          onToggleShield={toggleShield}
          onCycleOxygen={cycleOxygen}
          onToggleGreenhouse={toggleGreenhouse}
          onToggleComms={toggleComms}
          onNextSol={advanceSol}
          reducedMotion={reducedMotion}
          setReducedMotion={setReducedMotion}
          graphicsPreset={graphicsPreset}
          setGraphicsPreset={setGraphicsPreset}
          fps={fps}
          timerPaused={reducedMotion || Boolean(activeAlert)}
          timeLeft={timeLeft}
        />
      </div>
    </div>
  );
}

import { useEffect, useRef } from 'react';
import soundManager from './audio/soundManager.js';
import { loadSpaceWeatherEvents } from './data/donkiClient.js';
import { saveRunResult } from './data/supabaseClient.js';
import Diorama from './scene/Diorama.jsx';
import useGameStore from './store/useGameStore.js';
import BriefingScreen from './ui/screens/BriefingScreen.jsx';
import DebriefScreen from './ui/screens/DebriefScreen.jsx';
import GameScreen from './ui/screens/GameScreen.jsx';
import SettingsScreen from './ui/screens/SettingsScreen.jsx';
import TitleScreen from './ui/screens/TitleScreen.jsx';
import TutorialScreen from './ui/screens/TutorialScreen.jsx';
import './ui/styles.css';

const OXYGEN_LEVEL_ORDER = ['low', 'normal', 'high'];

export default function App({ SceneComponent = Diorama }) {
  const screen = useGameStore((s) => s.ui?.screen) || 'title';
  const status = useGameStore((s) => s.game?.status) || 'playing';
  const level = useGameStore((s) => s.game?.level) || 1;
  const seed = useGameStore((s) => s.game?.seed) || 2142026;
  const solsSurvived = useGameStore((s) => s.game?.solsSurvived) ?? 0;
  const eventSource = useGameStore((s) => s.data?.eventSource) || 'snapshot';
  const primaryCause = useGameStore((s) => s.debrief?.primaryCause) || 'none';
  const colourBlind = useGameStore((s) => s.settings?.colourBlind) || false;
  const reducedMotion = useGameStore((s) => s.settings?.reducedMotion) || false;
  const volume = useGameStore((s) => s.settings?.volume) ?? 0.8;
  const muted = useGameStore((s) => s.settings?.muted) || false;
  const lastSavedRunKeyRef = useRef(null);

  useEffect(() => {
    soundManager.syncSettings({ volume, muted });
  }, [volume, muted]);

  // Trigger ambient audio on game screen and outcome cues on debrief
  useEffect(() => {
    if (screen === 'game') {
      soundManager.startAmbient();
    } else if (screen === 'title') {
      soundManager.stopAmbient();
    } else if (screen === 'debrief') {
      if (status === 'won') {
        soundManager.play('cheer');
      } else if (status === 'lost') {
        soundManager.play('warning');
      }
    }
  }, [screen, status]);

  // Load NASA DONKI events on startup with 3s timeout fallback to bundled snapshots
  useEffect(() => {
    let active = true;
    loadSpaceWeatherEvents({ timeoutMs: 3000 })
      .then((result) => {
        if (!active || !result) return;
        useGameStore.getState().setExternalEvents(result.events, {
          eventSource: result.source,
          loading: false,
          activeSnapshotName: result.snapshotTitle,
        });
      })
      .catch(() => null);
    return () => {
      active = false;
    };
  }, []);

  // Save anonymous run telemetry when a run finishes (silent fallback when offline/Supabase off)
  useEffect(() => {
    if (screen !== 'debrief' || (status !== 'won' && status !== 'lost')) {
      return;
    }
    const runKey = `${level}:${seed}:${status}:${solsSurvived}`;
    if (lastSavedRunKeyRef.current === runKey) {
      return;
    }
    lastSavedRunKeyRef.current = runKey;
    saveRunResult({
      level,
      seed,
      event_source: eventSource,
      outcome: status,
      sols_survived: solsSurvived,
      primary_cause: primaryCause,
    }).catch(() => null);
  }, [screen, status, level, seed, solsSurvived, eventSource, primaryCause]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const state = useGameStore.getState();
      if (state.ui?.screen !== 'game') return;
      if (state.ui?.sol214Open || state.ui?.activeAlert) return;

      const tag = event.target?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

      const key = event.key;
      const lower = key.toLowerCase();
      const choices = state.game?.choices || {};

      if (key === '1' || lower === 'p') {
        event.preventDefault();
        soundManager.play('motor');
        state.setChoice('panelsOut', !choices.panelsOut);
      } else if (key === '2' || lower === 's') {
        event.preventDefault();
        soundManager.play('click');
        state.setChoice('shieldOn', !choices.shieldOn);
      } else if (key === '3' || lower === 'o') {
        event.preventDefault();
        soundManager.play('click');
        const idx = OXYGEN_LEVEL_ORDER.indexOf(choices.oxygenLevel || 'normal');
        const nextLevel = OXYGEN_LEVEL_ORDER[(idx + 1) % OXYGEN_LEVEL_ORDER.length];
        state.setChoice('oxygenLevel', nextLevel);
      } else if ((key === '4' || lower === 'g') && (state.game?.level || 1) >= 2) {
        event.preventDefault();
        soundManager.play('click');
        const nextActive = !(choices.waterGreenhouse || choices.tendGreenhouse);
        state.setChoice({ waterGreenhouse: nextActive, tendGreenhouse: nextActive });
      } else if ((key === '5' || lower === 'c') && (state.game?.level || 1) >= 3) {
        event.preventDefault();
        soundManager.play('click');
        state.setChoice('queueComms', !choices.queueComms);
      } else if ((key === ' ' || key === 'Enter') && tag !== 'button') {
        event.preventDefault();
        soundManager.play('click');
        state.advanceSol();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const rootClasses = [
    'moonwatch-app',
    colourBlind ? 'colour-blind' : '',
    reducedMotion ? 'reduced-motion' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div id="moonwatch-app" className={rootClasses}>
      {screen === 'title' && <TitleScreen />}
      {screen === 'briefing' && <BriefingScreen />}
      {screen === 'tutorial' && <TutorialScreen />}
      {screen === 'game' && <GameScreen SceneComponent={SceneComponent} />}
      {screen === 'debrief' && <DebriefScreen />}
      {screen === 'settings' && <SettingsScreen />}
    </div>
  );
}







