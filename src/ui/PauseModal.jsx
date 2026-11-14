// src/ui/PauseModal.jsx
import React from 'react';
import SciFiFrame from './SciFiFrame.jsx';

export default function PauseModal({
  sol,
  maxSol,
  level,
  characterName,
  onResume,
  onRestart,
  onExit,
}) {
  return (
    <div
      className="pause-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pause-title"
    >
      <SciFiFrame
        title="OPTIONS"
        onClose={onResume}
        className="pause-card"
      >
        <p id="pause-title" className="pause-meta">
          {characterName} • LEVEL {level} (SOL {sol}/{maxSol})
        </p>

        <div className="pause-actions">
          <button
            type="button"
            className="scifi-btn-lime option-row-btn"
            onClick={onResume}
          >
            <span className="option-icon-circle">▶</span>
            <span>RESUME</span>
          </button>

          <button
            type="button"
            className="scifi-btn-cyan option-row-btn"
            onClick={onRestart}
          >
            <span className="option-icon-circle">↻</span>
            <span>RESTART</span>
          </button>

          <button
            type="button"
            className="scifi-btn-cyan option-row-btn"
            onClick={onExit}
          >
            <span className="option-icon-circle">☰</span>
            <span>LEVELS</span>
          </button>

          <button
            type="button"
            className="scifi-btn-cyan option-row-btn"
            onClick={onExit}
          >
            <span className="option-icon-circle">⎋</span>
            <span>QUIT</span>
          </button>
        </div>
      </SciFiFrame>
    </div>
  );
}
