'use client';
import { useState, useEffect } from 'react';

const STYLES = `
  @keyframes btt-in {
    from { opacity: 0; transform: translateY(16px) scale(.8); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes btt-out {
    from { opacity: 1; transform: translateY(0) scale(1); }
    to   { opacity: 0; transform: translateY(16px) scale(.8); }
  }

  .btt-btn {
    position: fixed;
    right: 20px;
    z-index: 998;
    width: 48px;
    height: 48px;
    border-radius: 999px;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    /* Pinterest style — solid dark pill */
    background: var(--text-primary);
    color: var(--bg-primary);

    box-shadow: 0 4px 16px rgba(0,0,0,.22);
    transition: transform .18s, box-shadow .18s, background .18s;
    -webkit-tap-highlight-color: transparent;
    font-family: system-ui, sans-serif;
  }

  .btt-btn:hover {
    transform: translateY(-3px) scale(1.06);
    box-shadow: 0 8px 24px rgba(0,0,0,.28);
  }
  .btt-btn:active {
    transform: scale(.92);
    box-shadow: 0 2px 8px rgba(0,0,0,.18);
  }

  .btt-btn.show { animation: btt-in .3s cubic-bezier(.34,1.56,.64,1) both; }
  .btt-btn.hide { animation: btt-out .2s ease forwards; }

  /* Tooltip */
  .btt-btn::after {
    content: 'Back to top';
    position: absolute;
    right: calc(100% + 10px);
    top: 50%;
    transform: translateY(-50%);
    background: var(--text-primary);
    color: var(--bg-primary);
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
    padding: 6px 12px;
    border-radius: 999px;
    opacity: 0;
    pointer-events: none;
    transition: opacity .18s;
    font-family: system-ui, sans-serif;
  }
  .btt-btn:hover::after { opacity: 1; }

  /* Mobile — above bottom nav */
  @media (max-width: 700px) {
    .btt-btn {
      bottom: 24px;
      right: 14px;
      width: 44px;
      height: 44px;
    }
    /* Hide tooltip on touch */
    .btt-btn::after { display: none; }
  }

  @media (min-width: 701px) {
    .btt-btn { bottom: 32px; }
  }
`;

function injectStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('btt-styles')) return;
  const s = document.createElement('style');
  s.id = 'btt-styles';
  s.textContent = STYLES;
  document.head.appendChild(s);
}

export default function BackToTop() {
  const [state, setState] = useState('hidden');

  useEffect(() => {
    injectStyles();
    let last = 0;
    const onScroll = () => {
      const y = window.scrollY;
      if (y > 320 && last <= 320) setState('show');
      if (y <= 320 && last > 320) setState('hide');
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleAnimEnd = () => {
    if (state === 'hide') setState('hidden');
  };

  if (state === 'hidden') return null;

  return (
    <button
      className={`btt-btn ${state}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      onAnimationEnd={handleAnimEnd}
      aria-label="Back to top"
    >
      <svg
        width="20" height="20" viewBox="0 0 24 24"
        fill="none" stroke="currentColor"
        strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"
      >
        <polyline points="18 15 12 9 6 15"/>
      </svg>
    </button>
  );
}