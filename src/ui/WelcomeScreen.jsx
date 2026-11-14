// src/ui/WelcomeScreen.jsx
import React, { useState } from 'react';

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
      {/* 2D DEEP SPACE & DETAILED MOON BACKGROUND (No Black Hole) */}
      <div className="astracon-space-bg" aria-hidden="true">
        {/* 2D Deep Space Starfield & Crescent/Full Moon SVG */}
        <svg
          className="astracon-moon-svg"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Warm Lunar Surface Gradient */}
            <radialGradient id="lunarSurface" cx="38%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#fef3c7" />
              <stop offset="42%" stopColor="#d6c7b2" />
              <stop offset="78%" stopColor="#78716c" />
              <stop offset="100%" stopColor="#292524" />
            </radialGradient>

            {/* Outer Atmospheric Lunar Glow */}
            <radialGradient id="lunarHalo" cx="50%" cy="50%" r="50%">
              <stop offset="45%" stopColor="#f59e0b" stopOpacity="0.32" />
              <stop offset="72%" stopColor="#d97706" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#040302" stopOpacity="0" />
            </radialGradient>

            {/* Crescent Shadow Mask */}
            <radialGradient id="lunarShadow" cx="72%" cy="58%" r="60%">
              <stop offset="0%" stopColor="#040302" stopOpacity="0.88" />
              <stop offset="55%" stopColor="#040302" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#040302" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Deep Space Starfield */}
          <g fill="#fef3c7">
            <circle cx="120" cy="110" r="1.6" opacity="0.8" />
            <circle cx="240" cy="260" r="1.2" opacity="0.5" />
            <circle cx="330" cy="85" r="2" opacity="0.9" />
            <circle cx="460" cy="190" r="1.4" opacity="0.6" />
            <circle cx="540" cy="65" r="1.5" opacity="0.7" />
            <circle cx="960" cy="95" r="1.8" opacity="0.85" />
            <circle cx="1090" cy="210" r="1.3" opacity="0.6" />
            <circle cx="1210" cy="130" r="2.1" opacity="0.9" />
            <circle cx="1330" cy="290" r="1.5" opacity="0.7" />
            <circle cx="180" cy="490" r="1.7" opacity="0.75" />
            <circle cx="1280" cy="510" r="1.8" opacity="0.8" />
            <circle cx="1140" cy="410" r="1.2" opacity="0.5" />
            <circle cx="290" cy="390" r="1.3" opacity="0.6" />
          </g>

          {/* Soft Warm Halo Behind the Moon */}
          <circle cx="720" cy="370" r="320" fill="url(#lunarHalo)" />

          {/* Main 2D Moon Sphere */}
          <circle
            cx="720"
            cy="370"
            r="195"
            fill="url(#lunarSurface)"
            stroke="#fde68a"
            strokeOpacity="0.35"
            strokeWidth="2"
          />

          {/* Lunar Maria (Dark Basalt Seas) */}
          <g fill="#57534e" opacity="0.38">
            {/* Mare Imbrium */}
            <ellipse cx="665" cy="300" rx="52" ry="42" transform="rotate(-18 665 300)" />
            {/* Mare Serenitatis */}
            <circle cx="745" cy="310" r="34" />
            {/* Mare Tranquillitatis */}
            <ellipse cx="785" cy="365" rx="44" ry="32" transform="rotate(15 785 365)" />
            {/* Oceanus Procellarum */}
            <ellipse cx="605" cy="380" rx="38" ry="62" transform="rotate(-12 605 380)" />
          </g>

          {/* Iconic Lunar Craters (Copernicus, Tycho, Aristarchus) */}
          <g>
            {/* Copernicus Crater */}
            <circle cx="645" cy="365" r="16" fill="#44403c" opacity="0.55" />
            <circle cx="645" cy="365" r="11" fill="#a8a29e" opacity="0.45" />
            {/* Tycho Crater (South) */}
            <circle cx="705" cy="495" r="14" fill="#44403c" opacity="0.6" />
            <circle cx="705" cy="495" r="8" fill="#fef3c7" opacity="0.65" />
            {/* Smaller Impact Craters */}
            <circle cx="760" cy="255" r="9" fill="#57534e" opacity="0.5" />
            <circle cx="825" cy="420" r="12" fill="#44403c" opacity="0.5" />
            <circle cx="620" cy="445" r="10" fill="#57534e" opacity="0.45" />
            <circle cx="730" cy="410" r="7" fill="#57534e" opacity="0.4" />
          </g>

          {/* 2D Terminator Shadow for Depth */}
          <circle cx="720" cy="370" r="195" fill="url(#lunarShadow)" />
        </svg>

        {/* Dot-Matrix LED Halftone Grid Overlay */}
        <div className="astracon-dot-matrix" />
      </div>

      {/* FOREGROUND UI LAYER */}
      <div className="astracon-ui-container">
        {/* TOP ROW — YELLOW ZONE: "MOONWATCH NASA" Logo Badge */}
        <header className="astracon-top-bar">
          <div className="astracon-brand-lockup">
            <div className="astracon-logo-box" aria-hidden="true">
              {/* Mini 2D Crescent Moon & Orbit Icon */}
              <svg width="26" height="26" viewBox="0 0 32 32">
                <circle cx="16" cy="16" r="9" fill="#050505" />
                <circle cx="20" cy="13" r="7" fill="#ffffff" />
                <circle cx="11" cy="20" r="1.5" fill="#ffffff" />
              </svg>
            </div>
            <div className="astracon-brand-text">
              <span>MOONWATCH</span>
              <span>NASA</span>
            </div>
          </div>
        </header>

        {/* GREEN ZONE: Tagline + Giant Pixel Title */}
        <div className="astracon-hero-block">
          <p className="astracon-green-tagline">
            KEEP YOUR CREW ALIVE. REAL NASA FLARES. YOUR CALL.
          </p>
          <h1 className="astracon-pixel-title">MOONWATCH</h1>
        </div>

        {/* BLUE ZONE: Level 1, Level 2 & Level 3 Content Tables */}
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
