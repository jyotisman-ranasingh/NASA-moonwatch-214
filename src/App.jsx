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
