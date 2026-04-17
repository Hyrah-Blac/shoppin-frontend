export default function SkeletonCard() {
  return (
    <div style={{ breakInside: 'avoid', marginBottom: 12 }}>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        .skeleton {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }
      `}</style>
      <div
        className="skeleton"
        style={{
          width: '100%', height: '200px',
          borderRadius: 16, marginBottom: 8,
        }}
      />
      <div className="skeleton" style={{ height: 14, marginBottom: 6, borderRadius: 8, width: '80%' }} />
      <div className="skeleton" style={{ height: 12, borderRadius: 8, width: '60%' }} />
    </div>
  );
}