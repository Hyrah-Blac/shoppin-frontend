export default function Spinner({ size = 'md', fullPage = false }) {
  const dims = { sm: 6, md: 8, lg: 11 };
  const dot = dims[size] ?? dims.md;

  const inner = (
    <div style={{
      display: 'flex',
      gap: dot * 0.75,
      alignItems: 'center',
      justifyContent: 'center',
      padding: fullPage ? 0 : '20px 0',
    }}>
      <style>{`
        @keyframes pin-bounce {
          0%, 100% { transform: scale(1);     opacity: 1;   }
          40%       { transform: scale(1.35);  opacity: 1;   }
          60%       { transform: scale(0.65);  opacity: .55; }
        }
        .pin-dot {
          border-radius: 50%;
          background: #e60023;
          animation: pin-bounce 1.2s cubic-bezier(.36,.07,.19,.97) infinite;
          flex-shrink: 0;
        }
        .pin-dot:nth-child(1) { animation-delay: 0s;    }
        .pin-dot:nth-child(2) { animation-delay: 0.15s; }
        .pin-dot:nth-child(3) { animation-delay: 0.30s; }
      `}</style>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="pin-dot"
          style={{ width: dot, height: dot }}
        />
      ))}
    </div>
  );

  if (fullPage) return (
    <div style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary)',
      zIndex: 9999,
    }}>
      {inner}
    </div>
  );

  return inner;
}