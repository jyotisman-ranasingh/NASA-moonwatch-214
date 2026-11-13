'use client';

import React, { useState, useEffect, useCallback } from 'react';

// --- CUSTOM HOOKS ---
const useFpsMonitor = (graphicsPreset, setGraphicsPreset, isActive) => {
  const [fps, setFps] = useState(60);

  useEffect(() => {
    if (!isActive) return;
    let frameCount = 0;
    let lastTime = performance.now();
    let animationFrameId;

    const measureFps = () => {
      const now = performance.now();
      frameCount++;
      if (now - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastTime)));
        frameCount = 0;
        lastTime = now;
      }
      animationFrameId = requestAnimationFrame(measureFps);
    };

    animationFrameId = requestAnimationFrame(measureFps);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isActive]);

  return fps;
};

// --- COMPONENTS ---
const LunarViewport = ({ sol, level, solarExtended, shieldActive, activeAlert, onDismissAlert, characterPos }) => (
  <div style={{
    position: 'relative', height: '200px', backgroundColor: '#0f172a', 
    border: '2px solid #334155', borderRadius: '8px', marginBottom: '20px', overflow: 'hidden'
  }}>
    <div style={{ padding: '10px', color: '#38bdf8', fontFamily: 'monospace' }}>
      VIEWPORT // SOL: {sol} // CLEARANCE: {level} 
      <br/>
      STATUS: {shieldActive ? 'SHIELD UP' : 'SHIELD DOWN'} | {solarExtended ? 'SOLAR EXTENDED' : 'SOLAR RETRACTED'}
    </div>
    
    {/* Character Representation */}
    <div style={{
      position: 'absolute', bottom: '20px', left: `${characterPos}px`, 
      width: '20px', height: '40px', backgroundColor: '#fbbf24', 
      transition: 'left 0.5s ease-in-out', borderRadius: '4px'
    }} />

    {/* Alert Modal */}
    {activeAlert && (
      <div style={{
        position: 'absolute', top: '0', left: '0', right: '0', bottom: '0', 
        backgroundColor: 'rgba(220, 38, 38, 0.9)', color: 'white', 
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: '20px'
      }}>
        <h2 style={{ margin: '0 0 10px 0' }}>{activeAlert.title}</h2>
        <p style={{ textAlign: 'center', maxWidth: '80%' }}>{activeAlert.message}</p>
        <button 
          onClick={onDismissAlert} 
          style={{ padding: '8px 16px', marginTop: '10px', cursor: 'pointer', background: 'white', color: 'red', border: 'none', fontWeight: 'bold' }}
        >
          DISMISS (ESC)
        </button>
      </div>
    )}
  </div>
);

const ControlDeck = ({ power, integrity, oxygenStore, level, solarExtended, shieldActive, oxygenLevel, greenhouseActive, commsQueued, onToggleSolar, onToggleShield, onCycleOxygen, onToggleGreenhouse, onToggleComms, onNextSol, timeLeft, reducedMotion, setReducedMotion, fps }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
    <div style={{ backgroundColor: '#1e293b', padding: '15px', borderRadius: '8px' }}>
      <h3 style={{ marginTop: 0, fontFamily: 'monospace' }}>RESOURCES</h3>
      <p>Power: {power}%</p>
      <p>Hull Integrity: {integrity}%</p>
      <p>Oxygen Storage: {oxygenStore}%</p>
    </div>

    <div style={{ backgroundColor: '#1e293b', padding: '15px', borderRadius: '8px' }}>
      <h3 style={{ marginTop: 0, fontFamily: 'monospace' }}>SYSTEM CONTROLS</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button onClick={onToggleSolar}>[1] Solar Panels: {solarExtended ? 'EXTENDED' : 'RETRACTED'}</button>
        <button onClick={onToggleShield}>[2] Magnetic Shield: {shieldActive ? 'ON' : 'OFF'}</button>
        <button onClick={onCycleOxygen}>[3] O2 Flow: {oxygenLevel}</button>
        <button onClick={onToggleGreenhouse} disabled={level < 2}>[4] Greenhouse: {greenhouseActive ? 'ACTIVE' : 'INACTIVE'} {level < 2 && '(Lvl 2 Req)'}</button>
        <button onClick={onToggleComms} disabled={level < 3}>[5] Earth Comms: {commsQueued ? 'QUEUED' : 'IDLE'} {level < 3 && '(Lvl 3 Req)'}</button>
      </div>
    </div>

    <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1e293b', padding: '15px', borderRadius: '8px' }}>
      <div>
        <label style={{ marginRight: '15px' }}>
          <input type="checkbox" checked={reducedMotion} onChange={(e) => setReducedMotion(e.target.checked)} /> Reduced Motion (Pauses Timer)
        </label>
        <span style={{ fontFamily: 'monospace', color: '#94a3b8' }}>FPS: {fps}</span>
      </div>
      <button onClick={onNextSol} style={{ padding: '10px 20px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
        ADVANCE SOL (SPACE) - {timeLeft}s
      </button>
    </div>
  </div>
);

// --- MAIN APP ---
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

  // Character X-position inside viewport
  const [characterPos, setCharacterPos] = useState(395);

  // Space-Weather Modal & Event Log
  const [activeAlert, setActiveAlert] = useState(null);
  const [eventLog, setEventLog] = useState('Welcome to Lunar Outpost 214. Use hotkeys 1–5 to manage base systems.');

  // Accessibility & Graphics Settings
  const [reducedMotion, setReducedMotion] = useState(false);
  const [graphicsPreset, setGraphicsPreset] = useState('HIGH');
  const fps = useFpsMonitor(graphicsPreset, setGraphicsPreset, true);

  // Action Handlers
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
          message: 'Coronal mass ejection detected! Retract extended solar panels or engage the Shield Dome to prevent hull & array damage.',
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

  // Sol 214 Countdown Timer
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

      if (key === '1' || key === 'p') { e.preventDefault(); toggleSolar(); }
      else if (key === '2' || key === 's') { e.preventDefault(); toggleShield(); }
      else if (key === '3' || key === 'o') { e.preventDefault(); cycleOxygen(); }
      else if (key === '4' || key === 'g') { e.preventDefault(); toggleGreenhouse(); }
      else if (key === '5' || key === 'c') { e.preventDefault(); toggleComms(); }
      else if (e.code === 'Space' || key === 'enter') { e.preventDefault(); advanceSol(); }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeAlert, toggleSolar, toggleShield, cycleOxygen, toggleGreenhouse, toggleComms, advanceSol]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#020617', color: '#f8fafc', padding: '20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
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
