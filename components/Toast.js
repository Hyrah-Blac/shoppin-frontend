'use client';
import { useEffect } from 'react';
import { useToast } from '@/context/ToastContext';

const STYLES = `
  @keyframes toast-in {
    from { opacity: 0; transform: translateY(16px) scale(.92); }
    to   { opacity: 1; transform: translateY(0)    scale(1);   }
  }
  @keyframes toast-out {
    from { opacity: 1; transform: translateY(0)    scale(1);   max-height: 80px; margin-bottom: 0; }
    to   { opacity: 0; transform: translateY(16px) scale(.92); max-height: 0;    margin-bottom: -8px; }
  }

  .pin-toast-wrap {
    position: fixed;
    bottom: 28px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 9999;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    width: max-content;
    max-width: calc(100vw - 32px);
    pointer-events: none;
  }

  .pin-toast {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px 12px 12px;
    border-radius: 999px;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.3;
    pointer-events: all;
    animation: toast-in .32s cubic-bezier(.34,1.56,.64,1) both;
    white-space: nowrap;

    /* Pinterest dark pill style */
    background: var(--text-primary);
    color: var(--bg-primary);
    box-shadow: 0 4px 24px rgba(0,0,0,.22), 0 1px 4px rgba(0,0,0,.12);
  }

  .pin-toast-icon {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .pin-toast-msg {
    flex: 1;
    min-width: 0;
  }

  .pin-toast-close {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: none;
    background: rgba(255,255,255,.15);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    margin-left: 4px;
    color: var(--bg-primary);
    opacity: .7;
    transition: opacity .15s, background .15s;
  }
  .pin-toast-close:hover {
    opacity: 1;
    background: rgba(255,255,255,.25);
  }

  /* Coloured left icon circle for type hinting */
  .pin-toast-icon.success { background: #16a34a; color: #fff; }
  .pin-toast-icon.error   { background: #e60023; color: #fff; }
  .pin-toast-icon.info    { background: #2563eb; color: #fff; }
  .pin-toast-icon.warning { background: #d97706; color: #fff; }

  /* Mobile — above bottom nav, stretch edge to edge */
  @media (max-width: 700px) {
    .pin-toast-wrap {
      bottom: 24px;
      left: 12px;
      right: 12px;
      transform: none;
      width: auto;
      max-width: 100%;
      align-items: stretch;
    }
    .pin-toast {
      white-space: normal;
      border-radius: 18px;
    }
  }
`;

const ICONS = {
  success: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  error: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="3" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  info: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="3" strokeLinecap="round">
      <line x1="12" y1="8"  x2="12"   y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  warning: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="3" strokeLinecap="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
      <line x1="12" y1="9"  x2="12"   y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
};

function injectStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('pin-toast-styles')) return;
  const s = document.createElement('style');
  s.id = 'pin-toast-styles';
  s.textContent = STYLES;
  document.head.appendChild(s);
}

export default function Toast() {
  const { toasts, removeToast } = useToast();

  useEffect(() => { injectStyles(); }, []);

  return (
    <div className="pin-toast-wrap" aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => {
        const type = toast.type ?? 'info';
        return (
          <div
            key={toast.id}
            className="pin-toast"
            role="alert"
          >
            {/* Coloured type icon */}
            <div className={`pin-toast-icon ${type}`}>
              {ICONS[type] ?? ICONS.info}
            </div>

            {/* Message */}
            <span className="pin-toast-msg">{toast.message}</span>

            {/* Dismiss */}
            <button
              className="pin-toast-close"
              onClick={() => removeToast(toast.id)}
              aria-label="Dismiss"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6"  y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        );
      })}
    </div>
  );
}