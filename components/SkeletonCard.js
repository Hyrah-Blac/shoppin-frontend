const STYLES = `
  @keyframes pin-shimmer {
    0%   { background-position: -600px 0; }
    100% { background-position:  600px 0; }
  }

  .pin-skel {
    background: linear-gradient(
      90deg,
      var(--bg-secondary) 25%,
      var(--bg-tertiary)  50%,
      var(--bg-secondary) 75%
    );
    background-size: 600px 100%;
    animation: pin-shimmer 1.6s ease-in-out infinite;
  }
`;

function injectStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('pin-skel-styles')) return;
  const s = document.createElement('style');
  s.id = 'pin-skel-styles';
  s.textContent = STYLES;
  document.head.appendChild(s);
}

export default function SkeletonCard({ height }) {
  injectStyles();

  // Randomise card height so masonry looks natural like Pinterest
  const imgH = height ?? (Math.floor(Math.random() * 3) === 0 ? 320 : Math.floor(Math.random() * 2) === 0 ? 240 : 180);

  return (
    <div style={{ breakInside: 'avoid', marginBottom: 16 }}>

      {/* IMAGE BLOCK */}
      <div
        className="pin-skel"
        style={{
          width: '100%',
          height: imgH,
          borderRadius: 18,
          marginBottom: 10,
        }}
      />

      {/* TITLE LINE */}
      <div
        className="pin-skel"
        style={{
          height: 13,
          borderRadius: 999,
          width: `${68 + Math.floor(Math.random() * 24)}%`,
          marginBottom: 7,
        }}
      />

      {/* SUBTITLE / PRICE LINE */}
      <div
        className="pin-skel"
        style={{
          height: 11,
          borderRadius: 999,
          width: `${38 + Math.floor(Math.random() * 22)}%`,
          marginBottom: 10,
        }}
      />

      {/* AVATAR + NAME ROW — mimics Pinterest's seller row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <div
          className="pin-skel"
          style={{ width: 26, height: 26, borderRadius: '50%', flexShrink: 0 }}
        />
        <div
          className="pin-skel"
          style={{ height: 10, borderRadius: 999, width: `${40 + Math.floor(Math.random() * 30)}%` }}
        />
      </div>

    </div>
  );
}