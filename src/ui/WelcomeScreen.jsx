// src/ui/WelcomeScreen.jsx
import React, { useState } from 'react';
import SciFiFrame from './SciFiFrame.jsx';

const CAMPAIGN_LEVELS = [
  {
    id: 1,
    rank: 'CADET',
    title: 'Power Basics',
    sols: 14,
    stars: '★ ★ ☆',
    goal: 'Charge solar batteries and raise the Shield Dome when NASA flares hit.',
    unlockedKeys: ['[1/P] Solar Panels', '[2/S] Shield Dome', '[3/O] Oxygen'],
  },
  {
    id: 2,
    rank: 'PILOT',
    title: 'Life Support & Greenhouse',
    sols: 21,
    stars: '★ ★ ★',
    goal: 'Grow space crops inside the Hydroponic Dome and scrub cabin CO₂.',
    unlockedKeys: ['All Level 1 Keys', '[4/G] Water Greenhouse'],
  },
  {
    id: 3,
    rank: 'COMMANDER',
    title: 'Deep Space Comms',
    sols: 28,
    stars: '★ ★ ★',
    goal: 'Command all 5 lunar stations and beam weather telemetry to Earth.',
    unlockedKeys: ['All Level 1 & 2 Keys', '[5/C] Queue Earth Comms'],
  },
];

const GFX_LEVELS = ['LOW', 'MEDIUM', 'HIGH'];

export default function WelcomeScreen({
  selectedLevel,
  onSelectLevel,
  onStartMission,
  reducedMotion,
  onToggleReducedMotion,
  graphicsPreset,
  onChangeGraphics,
}) {
  const [activeModal, setActiveModal] = useState(null); // 'TUTORIAL' | 'SETTINGS' | null
  const currentCard = CAMPAIGN_LEVELS.find((l) => l.id === selectedLevel) || CAMPAIGN_LEVELS[0];
  const gfxIndex = GFX_LEVELS.indexOf(graphicsPreset);

  return (
    <div className="welcome-overlay">
      <SciFiFrame title="LEVEL SELECT" className="welcome-card">
        <header className="welcome-header">
          <div>
            <h1 className="welcome-title">MOONWATCH: SOL 214</h1>
            <p className="welcome-subtitle">
              Keep your crew alive. Real NASA flares. Your call.
            </p>
          </div>
          <div className="age-pill">AGES 9–14 • {currentCard.sols} SOLS</div>
        </header>

        {/* LEVEL SELECT TILES (Matches Reference Grid) */}
        <div className="level-grid">
          {CAMPAIGN_LEVELS.map((lvl) => {
            const isSelected = selectedLevel === lvl.id;
            return (
              <button
                key={lvl.id}
                type="button"
                onClick={() => onSelectLevel(lvl.id)}
                className={`level-card ${isSelected ? 'selected' : ''}`}
              >
                <div className="level-num-badge">{lvl.id}</div>
                <div className="star-row">{lvl.stars}</div>
                <h2 className="level-name">
                  {lvl.rank}: {lvl.title}
                </h2>
                <p className="level-goal">{lvl.goal}</p>
                <span
                  className={isSelected ? 'scifi-btn-lime' : 'scifi-btn-cyan'}
                  style={{ padding: '5px 14px', fontSize: '0.75rem' }}
                >
                  {isSelected ? '✓ SELECTED' : `${lvl.sols} SOLS`}
                </span>
              </button>
            );
          })}
        </div>

        {/* INSET LOADOUT BAR */}
        <div className="scifi-inset-box loadout-strip">
          <span style={{ fontSize: '0.78rem', fontWeight: 900, color: '#81d4fa' }}>
            🕹️ LEVEL {selectedLevel} CONTROLS:
          </span>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {currentCard.unlockedKeys.map((k) => (
              <span key={k} className="loadout-chip">
                {k}
              </span>
            ))}
            <span className="loadout-chip">[SPACE] Next Sol</span>
          </div>
        </div>

        {/* BOTTOM ACTION BAR (Matches BACK / PLAY Layout) */}
        <footer className="welcome-footer">
          <div className="secondary-actions">
            <button
              type="button"
              className="scifi-btn-cyan menu-btn"
              onClick={() => setActiveModal('SETTINGS')}
            >
              ⚙️ SETTING
            </button>
            <button
              type="button"
              className="scifi-btn-cyan menu-btn"
              onClick={() => setActiveModal('TUTORIAL')}
            >
              ❓ QUEST GUIDE
            </button>
          </div>

          <button
            type="button"
            className="scifi-btn-lime start-mission-btn"
            onClick={onStartMission}
          >
            PLAY →
          </button>
        </footer>
      </SciFiFrame>

      {/* NEW QUEST / HOW TO PLAY MODAL */}
      {activeModal === 'TUTORIAL' && (
        <div className="modal-backdrop" onClick={() => setActiveModal(null)}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 470 }}>
            <SciFiFrame
              title="MISSION QUEST"
              onClose={() => setActiveModal(null)}
              className="modal-box"
            >
              <ul className="tutorial-list">
                <li><strong>☀️ Solar Panels [1/P]:</strong> Extend for power, retract before flares.</li>
                <li><strong>🛡️ Shield Dome [2/S]:</strong> Blocks radiation during NASA CME alerts.</li>
                <li><strong>🫧 Oxygen Core [3/O]:</strong> Cycle Low / Normal / High air levels.</li>
                <li><strong>🌱 Greenhouse [4/G]:</strong> Scrubs CO₂ in Level 2+.</li>
                <li><strong>📡 Earth Comms [5/C]:</strong> Beam data in Level 3.</li>
              </ul>
              <button
                type="button"
                className="scifi-btn-lime"
                style={{ width: '100%', padding: '12px' }}
                onClick={() => setActiveModal(null)}
              >
                GOT IT
              </button>
            </SciFiFrame>
          </div>
        </div>
      )}

      {/* SETTING MODAL (Matches Reference Segmented Meter UI) */}
      {activeModal === 'SETTINGS' && (
        <div className="modal-backdrop" onClick={() => setActiveModal(null)}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 470 }}>
            <SciFiFrame
              title="SETTING"
              onClose={() => setActiveModal(null)}
              className="modal-box"
            >
              {/* Segmented Graphics Quality Meter */}
              <div className="settings-row">
                <span>GRAPHICS</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    type="button"
                    className="scifi-btn-cyan"
                    style={{ width: 30, height: 30 }}
                    onClick={() =>
                      onChangeGraphics(GFX_LEVELS[Math.max(0, gfxIndex - 1)])
                    }
                  >
                    -
                  </button>
                  <div className="segmented-meter">
                    {GFX_LEVELS.map((preset, idx) => (
                      <div
                        key={preset}
                        onClick={() => onChangeGraphics(preset)}
                        className={`meter-cell ${idx <= gfxIndex ? 'filled' : ''}`}
                        style={{ width: 34 }}
                        title={preset}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    className="scifi-btn-cyan"
                    style={{ width: 30, height: 30 }}
                    onClick={() =>
                      onChangeGraphics(GFX_LEVELS[Math.min(2, gfxIndex + 1)])
                    }
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Reduced Motion Toggle */}
              <div className="settings-row">
                <span>REDUCED MOTION</span>
                <button
                  type="button"
                  className={reducedMotion ? 'scifi-btn-lime' : 'scifi-btn-cyan'}
                  style={{ padding: '6px 18px' }}
                  onClick={onToggleReducedMotion}
                >
                  {reducedMotion ? 'ON' : 'OFF'}
                </button>
              </div>

              <button
                type="button"
                className="scifi-btn-lime"
                style={{ width: '100%', padding: '12px', marginTop: 12 }}
                onClick={() => setActiveModal(null)}
              >
                APPLY
              </button>
            </SciFiFrame>
          </div>
        </div>
      )}
    </div>
  );
}
