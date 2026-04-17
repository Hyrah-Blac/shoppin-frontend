'use client';
import { useToast } from '@/context/ToastContext';

export default function Toast() {
  const { toasts, removeToast } = useToast();

  const typeColors = {
    success: { bg: '#d1fae5', border: '#6ee7b7', text: '#065f46' },
    error: { bg: '#fee2e2', border: '#fca5a5', text: '#7f1d1d' },
    info: { bg: '#dbeafe', border: '#93c5fd', text: '#1e3a8a' },
  };

  return (
    <div style={{
      position: 'fixed', bottom: 20, right: 20, zIndex: 9999,
      display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 400,
    }}>
      {toasts.map((toast) => {
        const colors = typeColors[toast.type] || typeColors.info;
        return (
          <div
            key={toast.id}
            style={{
              background: colors.bg,
              border: `1px solid ${colors.border}`,
              borderRadius: 12,
              padding: '12px 16px',
              color: colors.text,
              fontWeight: 500,
              fontSize: 14,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              animation: 'slideIn 0.3s ease-out',
            }}
          >
            <span>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'none', border: 'none',
                color: colors.text, cursor: 'pointer',
                fontSize: 18, padding: 0, marginLeft: 12,
              }}
            >
              ×
            </button>
          </div>
        );
      })}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(400px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}