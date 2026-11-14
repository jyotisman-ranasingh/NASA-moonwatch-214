// src/ui/SciFiFrame.jsx
import React from 'react';

export default function SciFiFrame({
  title,
  onClose,
  className = '',
  children,
}) {
  return (
    <div className={`scifi-window ${className}`}>
      <div className="scifi-header-tab">{title}</div>
      {onClose && (
        <button
          type="button"
          className="scifi-close-btn"
          onClick={onClose}
          aria-label="Close Window"
        >
          ✕
        </button>
      )}
      {children}
    </div>
  );
}
