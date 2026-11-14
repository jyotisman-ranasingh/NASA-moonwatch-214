// src/ui/WelcomeScreen.jsx
import React, { useState } from 'react';

// Public-domain high-contrast 2D Moon & Space reference images
const MOON_SPACE_BG =
  'https://images-assets.nasa.gov/image/PIA00405/PIA00405~orig.jpg';
const DEEP_SPACE_STARS =
  'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001955/GSFC_20171208_Archive_e001955~orig.jpg';

const CAMPAIGN_LEVELS = [
  {
    id: 1,
    title: 'Level 1: Power Basics',
    sols: '14 Sols',
    tags: [
      'Solar panels',
      'Battery reserve',
      'Lunar night',
      'Solar flares',
      'Sol 214 choice',
    ],
  },
  {
    id: 2,
    title: 'Level 2: Life Support & Greenhouse',
    sols: '21 Sols',
    tags: [
      'Hydroponic Greenhouse',
      'CO₂ scrubbing',
      'Crew health management',
    ],
  },
  {
    id: 3,
    title: 'Level 3: Communications & Earth Delay',
    sols: '28 Sols',
    tags: [
      'Earth comms delay queue',
      'High-gain antenna sync',
      'Delayed telemetry boosts',
    ],
  },
];

export default function WelcomeScreen({
  selectedLevel = 1,
  onSelectLevel,
  onStartMission,
  reducedMotion = false,
  onToggleReducedMotion,
  graphicsPreset = 'HIGH',
  onChangeGraphics,
}) {
  const [activeModal, setActiveModal] = useState(null); // 'SETTINGS' | 'TUTORIAL' | null

  return (
    <section className="astracon-root">
      {/* 2D SPACE & GLOWING MOON BACKGROUND (Replaces the Black Hole) */}
      <div className="astracon-space-bg">
        <div
          className="astracon-stars-layer"
          style={{ backgroundImage: `url(${DEEP_SPACE_STARS})` }}
        />

        {/* 2D Moon with warm amber/copper atmospheric horizon glow */}
        <div className="astracon-moon-wrapper">
          <div className="astracon-moon-halo" />
          <div className="astracon-horizon-beam" />
          <img
            src={MOON_SPACE_BG}
            alt="2D Lunar Surface"
            className="astracon-moon-img"
          />
        </div>

        {/* Exact Dot-Matrix LED Halftone Grid Overlay from Astracon */}
        <div className="astracon-dot-matrix" />
      </div>

      {/* FOREGROUND UI LAYER */}
      <div className="astracon-ui-container">
        {/* TOP ROW — YELLOW ZONE: "MOONWATCH NASA" Logo Badge (Red top-right nav removed) */}
        <header className="astracon-top-bar">
          <div className="astracon-brand-lockup">
            <div className="astracon-logo-box" aria-hidden="true">
              <svg width="26" height="26" viewBox="0 0 32 32">
                <circle cx="16" cy="16" r="9" fill="#050505" />
                <ellipse
                  cx="16"
                  cy="16"
                  rx="14"
                  ry="5"
                  fill="none"
                  stroke="#050505"
                  strokeWidth="2.5"
                  transform="rotate(-24 16 16)"
                />
                <circle cx="13" cy="13" r="2" fill="#ffffff" />
              </svg>
            </div>
            <div className="astracon-brand-text">
              <span>MOONWATCH</span>
              <span>NASA</span>
            </div>
          </div>
        </header>

        {/* GREEN ZONE: Tagline + Pixelated Copper Title ("MOONWATCH" without Sol 214) */}
        <div className="astracon-hero-block">
          <p className="astracon-green-tagline">
            KEEP YOUR CREW ALIVE. REAL NASA FLARES. YOUR CALL.
          </p>
          <h1 className="astracon-pixel-title">MOONWATCH</h1>
        </div>

        {/* BLUE ZONE: Level 1, Level 2 & Level 3 Content Tables (Middle red-circled text removed) */}
        <div className="astracon-blue-zone">
          <div className="astracon-zone-meta">
            <span>SELECT MISSION CAMPAIGN LEVEL</span>
            <span>AGES 9–14 • 3–8 MIN PER RUN</span>
          </div>

          <div className="astracon-level-grid">
            {CAMPAIGN_LEVELS.map((lvl) => {
              const isSelected = selectedLevel === lvl.id;
              return (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => onSelectLevel(lvl.id)}
                  className={`astracon-level-card ${
                    isSelected ? 'is-selected' : ''
                  }`}
                >
                  <div className="astracon-card-header">
                    <span className="astracon-card-title">{lvl.title}</span>
                    <span className="astracon-sols-pill">{lvl.sols}</span>
                  </div>

                  {/* Only the clean feature pill tags from Picture 1 */}
                  <div className="astracon-tags-table">
                    {lvl.tags.map((tag) => (
                      <span key={tag} className="astracon-tag-chip">
                        {tag}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* BOTTOM BAR — PURPLE ZONE (Settings & Tutorial) + RIGHT CTA (Start Mission) */}
        <footer className="astracon-bottom-bar">
          {/* Purple Zone: Settings & Tutorial in exact Astracon button style */}
          <div className="astracon-purple-actions">
            <button
              type="button"
              className="astracon-btn-white"
              onClick={() => setActiveModal('SETTINGS')}
            >
              <span>⚙ SETTINGS</span>
              <span className="astracon-pixel-arrow">»</span>
            </button>

            <button
              type="button"
              className="astracon-btn-outline"
              onClick={() => setActiveModal('TUTORIAL')}
            >
              ? TUTORIAL
            </button>
          </div>

          {/* Bottom-Right Slot: Start Mission Button */}
          <button
            type="button"
            className="astracon-btn-start"
            onClick={onStartMission}
          >
            <span>START MISSION</span>
            <span className="astracon-pixel-arrow">→</span>
          </button>
        </footer>
      </div>

      {/* SETTINGS MODAL */}
      {activeModal === 'SETTINGS' && (
        <div
          className="astracon-modal-backdrop"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="astracon-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="astracon-modal-header">
              <h2>⚙ SYSTEM SETTINGS</h2>
              <button
                type="button"
                className="astracon-close"
                onClick={() => setActiveModal(null)}
              >
                ✕
              </button>
            </div>

            <div className="astracon-setting-row">
              <span>REDUCED MOTION (PAUSE TIMER & NO SHAKE)</span>
              <button
                type="button"
                className="astracon-btn-outline"
                onClick={onToggleReducedMotion}
              >
                {reducedMotion ? 'ENABLED [ON]' : 'DISABLED [OFF]'}
              </button>
            </div>

            <div className="astracon-setting-row">
              <span>GRAPHICS PRESET (AUTO-FPS DOWNGRADE)</span>
              <select
                value={graphicsPreset}
                onChange={(e) => onChangeGraphics(e.target.value)}
                className="astracon-select"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
              </select>
            </div>

            <button
              type="button"
              className="astracon-btn-white"
              style={{ width: '100%', justifyContent: 'center', marginTop: 18 }}
              onClick={() => setActiveModal(null)}
            >
              SAVE & CLOSE
            </button>
          </div>
        </div>
      )}

      {/* TUTORIAL MODAL */}
      {activeModal === 'TUTORIAL' && (
        <div
          className="astracon-modal-backdrop"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="astracon-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="astracon-modal-header">
              <h2>? TACTICAL KEYBOARD CONTROLS</h2>
              <button
                type="button"
                className="astracon-close"
                onClick={() => setActiveModal(null)}
              >
                ✕
              </button>
            </div>

            <ul className="astracon-tutorial-list">
              <li>
                <strong>[1] or [P]:</strong> Toggle Solar Panels (EXTENDED / RETRACTED)
              </li>
              <li>
                <strong>[2] or [S]:</strong> Toggle Shield Dome (ON / OFF)
              </li>
              <li>
                <strong>[3] or [O]:</strong> Cycle Oxygen Level (LOW / NORMAL / HIGH)
              </li>
              <li>
                <strong>[4] or [G]:</strong> Toggle Greenhouse Watering (Level 2+)
              </li>
              <li>
                <strong>[5] or [C]:</strong> Queue Earth Comms (Level 3)
              </li>
              <li>
                <strong>[SPACE] or [ENTER]:</strong> Advance to Next Sol
              </li>
              <li>
                <strong>[ESC]:</strong> Dismiss Space-Weather Alert Modal
              </li>
            </ul>

            <button
              type="button"
              className="astracon-btn-white"
              style={{ width: '100%', justifyContent: 'center', marginTop: 14 }}
              onClick={() => setActiveModal(null)}
            >
              ACKNOWLEDGE
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
