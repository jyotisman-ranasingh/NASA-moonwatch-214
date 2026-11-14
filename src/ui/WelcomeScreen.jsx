// src/ui/WelcomeScreen.jsx
import React, { useState, useEffect, useRef } from 'react';

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

// Deterministic pseudo-random helper so stars and craters never flicker on re-render
function seededRandom(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function MoonSpaceBackdrop() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const drawScene = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const rand = seededRandom(2142026);

      // 1. Deep Obsidian Space Background
      const bgGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.42,
        20,
        width * 0.5,
        height * 0.42,
        Math.max(width, height) * 0.85
      );
      bgGrad.addColorStop(0, '#0d1117');
      bgGrad.addColorStop(0.45, '#05070a');
      bgGrad.addColorStop(1, '#010203');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Dense Multi-Layer Starfield (Matches reference starry sky)
      const starCount = Math.floor((width * height) / 2400);
      for (let i = 0; i < starCount; i++) {
        const sx = rand() * width;
        const sy = rand() * height;
        const sizeRoll = rand();
        const radius =
          sizeRoll > 0.97 ? 1.55 : sizeRoll > 0.85 ? 1.05 : 0.6;
        const alpha =
          sizeRoll > 0.95
            ? 0.92
            : 0.25 + rand() * 0.55;

        ctx.beginPath();
        ctx.arc(sx, sy, radius, 0, Math.PI * 2);
        ctx.fillStyle =
          sizeRoll > 0.92
            ? `rgba(226, 238, 255, ${alpha})`
            : `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();
      }

      // Moon center & radius positioned cleanly in the upper-center viewport
      const cx = width * 0.5;
      const cy = height * 0.41;
      const r = Math.min(width, height) * 0.21;

      // 3. Soft Silver-White Atmospheric Halo Behind the Moon
      const haloGrad = ctx.createRadialGradient(cx, cy, r * 0.88, cx, cy, r * 1.65);
      haloGrad.addColorStop(0, 'rgba(225, 232, 240, 0.26)');
      haloGrad.addColorStop(0.4, 'rgba(180, 192, 208, 0.09)');
      haloGrad.addColorStop(1, 'rgba(5, 7, 10, 0)');
      ctx.fillStyle = haloGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.65, 0, Math.PI * 2);
      ctx.fill();

      // Clip to the Moon sphere
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.clip();

      // 4. Base Lunar Regolith Sphere (Crisp silver-grey gradient)
      const baseSphere = ctx.createRadialGradient(
        cx - r * 0.15,
        cy - r * 0.55,
        r * 0.1,
        cx,
        cy,
        r * 1.05
      );
      baseSphere.addColorStop(0, '#f8fafc');
      baseSphere.addColorStop(0.45, '#cbd5e1');
      baseSphere.addColorStop(0.85, '#94a3b8');
      baseSphere.addColorStop(1, '#475569');
      ctx.fillStyle = baseSphere;
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

      // 5. Lunar Maria (Dark Basalt Seas matching the reference texture)
      const maria = [
        { x: -0.26, y: -0.28, rx: 0.34, ry: 0.28, rot: -0.3, a: 0.26 }, // Mare Imbrium
        { x: 0.12, y: -0.32, rx: 0.22, ry: 0.20, rot: 0.2, a: 0.24 },  // Mare Serenitatis
        { x: 0.34, y: -0.15, rx: 0.26, ry: 0.22, rot: 0.4, a: 0.28 },  // Mare Tranquillitatis
        { x: -0.45, y: 0.05, rx: 0.24, ry: 0.42, rot: -0.15, a: 0.32 }, // Oceanus Procellarum
        { x: -0.05, y: 0.18, rx: 0.36, ry: 0.28, rot: 0.1, a: 0.30 },  // Mare Nubium
        { x: 0.28, y: 0.34, rx: 0.32, ry: 0.24, rot: -0.2, a: 0.28 },  // Mare Nectaris
      ];

      maria.forEach((m) => {
        ctx.save();
        ctx.translate(cx + m.x * r, cy + m.y * r);
        ctx.rotate(m.rot);
        const mGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, Math.max(m.rx, m.ry) * r);
        mGrad.addColorStop(0, `rgba(71, 85, 105, ${m.a})`);
        mGrad.addColorStop(0.7, `rgba(51, 65, 85, ${m.a * 0.75})`);
        mGrad.addColorStop(1, 'rgba(51, 65, 85, 0)');
        ctx.fillStyle = mGrad;
        ctx.beginPath();
        ctx.ellipse(0, 0, m.rx * r, m.ry * r, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 6. High-Detail Impact Craters (Concentrated along the bright highlands & terminator)
      for (let i = 0; i < 165; i++) {
        const angle = rand() * Math.PI * 2;
        const dist = Math.sqrt(rand()) * r * 0.94;
        const crX = cx + Math.cos(angle) * dist;
        const crY = cy + Math.sin(angle) * dist;
        const crR = (0.012 + Math.pow(rand(), 2.4) * 0.068) * r;

        // Crater shadow rim (top-lit relief)
        ctx.beginPath();
        ctx.arc(crX, crY - crR * 0.14, crR, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(30, 41, 59, 0.34)';
        ctx.fill();

        // Crater sunlit lower rim
        ctx.beginPath();
        ctx.arc(crX, crY + crR * 0.14, crR * 0.92, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(248, 250, 252, 0.28)';
        ctx.fill();

        // Crater floor
        ctx.beginPath();
        ctx.arc(crX, crY, crR * 0.82, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(148, 163, 184, 0.32)';
        ctx.fill();
      }

      // Prominent Tycho Crater near South Pole
      const tychoX = cx - r * 0.08;
      const tychoY = cy + r * 0.68;
      ctx.beginPath();
      ctx.arc(tychoX, tychoY, r * 0.075, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.55)';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(tychoX, tychoY, r * 0.03, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(226, 232, 240, 0.45)';
      ctx.fill();

      // 7. Exact Half-Lit / Earthshine Terminator Shadow (Bright Top, Dim Earthlit Bottom)
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(0.08); // Slight natural tilt matching reference image
      const terminatorGrad = ctx.createLinearGradient(0, -r * 0.25, 0, r * 0.32);
      terminatorGrad.addColorStop(0, 'rgba(4, 6, 12, 0)');
      terminatorGrad.addColorStop(0.32, 'rgba(4, 6, 12, 0.48)');
      terminatorGrad.addColorStop(0.55, 'rgba(4, 6, 12, 0.80)');
      terminatorGrad.addColorStop(1, 'rgba(3, 5, 10, 0.84)');
      ctx.fillStyle = terminatorGrad;
      ctx.fillRect(-r * 1.2, -r * 0.3, r * 2.4, r * 1.6);
      ctx.restore();

      // 8. Subtle Rim Shadow & Top-Edge Silver Crescent Rim Light
      const limbShadow = ctx.createRadialGradient(cx, cy - r * 0.08, r * 0.72, cx, cy, r);
      limbShadow.addColorStop(0, 'rgba(0, 0, 0, 0)');
      limbShadow.addColorStop(1, 'rgba(2, 4, 8, 0.52)');
      ctx.fillStyle = limbShadow;
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

      ctx.restore();
    };

    drawScene();
    window.addEventListener('resize', drawScene);
    return () => window.removeEventListener('resize', drawScene);
  }, []);

  return (
    <div className="astracon-space-bg" aria-hidden="true">
      <canvas ref={canvasRef} className="astracon-moon-canvas" />
    </div>
  );
}

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
      {/* EXACT 2D HALF-LIT MOON & DEEP SPACE STARFIELD BACKGROUND */}
      <MoonSpaceBackdrop />

      {/* FOREGROUND UI LAYER */}
      <div className="astracon-ui-container">
        {/* TOP ROW — YELLOW ZONE: "MOONWATCH NASA" Logo Badge */}
        <header className="astracon-top-bar">
          <div className="astracon-brand-lockup">
            <div className="astracon-logo-box" aria-hidden="true">
              <svg width="26" height="26" viewBox="0 0 32 32">
                <circle cx="16" cy="16" r="9" fill="#050505" />
                <path d="M 7,16 A 9,9 0 0,0 25,16 Z" fill="#64748b" />
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
