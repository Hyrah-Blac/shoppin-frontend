export default function Spinner() {
  return (
    <div style={{
      display: 'flex', gap: 6, alignItems: 'center',
      justifyContent: 'center', padding: '20px 0',
    }}>
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 1; }
          40% { transform: translateY(-12px); opacity: 0.7; }
        }
        .spinner-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #e60023;
          animation: bounce 1.4s infinite;
        }
        .spinner-dot:nth-child(1) { animation-delay: 0s; }
        .spinner-dot:nth-child(2) { animation-delay: 0.2s; }
        .spinner-dot:nth-child(3) { animation-delay: 0.4s; }
      `}</style>
      <div className="spinner-dot"></div>
      <div className="spinner-dot"></div>
      <div className="spinner-dot"></div>
    </div>
  );
}