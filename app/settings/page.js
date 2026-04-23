 'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useToast } from '@/context/ToastContext';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Inter:wght@400;500;600;700&display=swap');

  .st * { box-sizing: border-box; margin: 0; padding: 0; }
  .st {
    min-height: 100vh;
    background: var(--bg-tertiary);
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    color: var(--text-primary);
    padding: 0 0 100px;
  }

  /* ── HERO BANNER ── */
  .st-hero {
    background: var(--bg-primary);
    border-bottom: 1px solid var(--border-color);
    padding: 36px 24px 0;
    margin-bottom: 28px;
    position: relative;
    overflow: hidden;
  }
  .st-hero-inner { max-width: 640px; margin: 0 auto; position: relative; z-index: 1; }
  .st-hero-bg {
    position: absolute; inset: 0;
    background: radial-gradient(ellipse 80% 60% at 110% -10%, rgba(230,0,35,.07) 0%, transparent 70%),
                radial-gradient(ellipse 60% 80% at -10% 110%, rgba(230,0,35,.05) 0%, transparent 70%);
    pointer-events: none;
  }
  .st-back {
    display: inline-flex; align-items: center; gap: 7px;
    font-size: 13px; font-weight: 600;
    color: var(--text-secondary);
    background: none; border: none;
    cursor: pointer; font-family: 'Inter', inherit;
    margin-bottom: 20px; padding: 0;
    transition: color .18s;
    -webkit-tap-highlight-color: transparent;
  }
  .st-back:hover { color: var(--text-primary); }
  .st-hero-meta {
    display: flex; align-items: flex-end;
    justify-content: space-between; gap: 16px;
    padding-bottom: 24px;
  }
  .st-hero-tag {
    display: inline-block;
    font-size: 10px; font-weight: 700; letter-spacing: .8px;
    text-transform: uppercase;
    background: rgba(230,0,35,.1); color: var(--accent);
    padding: 4px 12px; border-radius: 999px;
    margin-bottom: 10px;
  }
  .st-hero-title {
    font-family: 'Playfair Display', serif;
    font-size: 36px; font-weight: 900;
    color: var(--text-primary); letter-spacing: -.6px;
    line-height: 1.1;
  }
  .st-hero-sub {
    font-size: 13px; color: var(--text-secondary);
    margin-top: 6px; font-weight: 400; line-height: 1.5;
  }
  .st-hero-avatar {
    width: 64px; height: 64px; border-radius: 50%;
    background: var(--accent);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Playfair Display', serif;
    font-size: 26px; font-weight: 900; color: #fff;
    overflow: hidden; flex-shrink: 0;
    border: 3px solid var(--bg-primary);
    box-shadow: 0 4px 16px rgba(0,0,0,.12);
  }
  .st-hero-avatar img { width: 100%; height: 100%; object-fit: cover; }

  /* ── CONTENT ── */
  .st-inner { max-width: 640px; margin: 0 auto; padding: 0 24px; }

  /* ── SECTION HEADING ── */
  .st-section-head {
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 14px; margin-top: 28px;
  }
  .st-section-head:first-child { margin-top: 0; }
  .st-section-icon {
    width: 32px; height: 32px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .st-section-title {
    font-family: 'Playfair Display', serif;
    font-size: 17px; font-weight: 700;
    color: var(--text-primary); letter-spacing: -.2px;
  }

  /* ── CARD ── */
  .st-card {
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 22px;
    overflow: hidden;
    margin-bottom: 14px;
  }

  /* ── TOGGLE ROW ── */
  .st-row {
    display: flex; align-items: center;
    justify-content: space-between; gap: 16px;
    padding: 18px 20px;
    border-bottom: 1px solid var(--border-color);
    transition: background .15s;
  }
  .st-row:last-child { border-bottom: none; }
  .st-row:hover { background: var(--bg-secondary); }
  .st-row-left { display: flex; align-items: center; gap: 14px; min-width: 0; }
  .st-row-dot {
    width: 8px; height: 8px; border-radius: 50%;
    flex-shrink: 0;
  }
  .st-row-label {
    font-size: 14px; font-weight: 600;
    color: var(--text-primary); margin-bottom: 2px;
  }
  .st-row-sub { font-size: 12px; color: var(--text-secondary); }

  /* ── TOGGLE ── */
  .st-toggle {
    width: 52px; height: 30px; border-radius: 15px;
    border: none; cursor: pointer; flex-shrink: 0;
    position: relative;
    transition: background .28s;
    -webkit-tap-highlight-color: transparent;
  }
  .st-toggle-thumb {
    position: absolute; top: 3px;
    width: 24px; height: 24px;
    background: #fff; border-radius: 50%;
    transition: left .28s cubic-bezier(.34,1.56,.64,1);
    box-shadow: 0 1px 5px rgba(0,0,0,.2);
  }

  /* ── FORM FIELDS ── */
  .st-field { padding: 16px 20px; border-bottom: 1px solid var(--border-color); }
  .st-field:last-child { border-bottom: none; }
  .st-field-full { padding: 16px 20px 0; }
  .st-label {
    display: block;
    font-size: 11px; font-weight: 700;
    color: var(--text-tertiary); letter-spacing: .5px;
    text-transform: uppercase; margin-bottom: 8px;
  }
  .st-input {
    width: 100%; height: 44px;
    border: 1.5px solid var(--border-color);
    border-radius: 12px;
    padding: 0 14px;
    font-size: 14px; font-weight: 500;
    outline: none;
    background: var(--bg-secondary);
    color: var(--text-primary);
    font-family: 'Inter', inherit;
    transition: border-color .18s, box-shadow .18s, background .18s;
  }
  .st-input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(230,0,35,.1);
    background: var(--bg-primary);
  }
  .st-input::placeholder { color: var(--text-tertiary); font-weight: 400; }
  .st-input-row {
    display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
  }

  /* ── ADDRESS SUB-HEADER ── */
  .st-addr-head {
    padding: 14px 20px 0;
    font-size: 11px; font-weight: 700;
    color: var(--text-tertiary); letter-spacing: .5px;
    text-transform: uppercase;
    display: flex; align-items: center; gap: 8px;
  }
  .st-addr-head::after {
    content: ''; flex: 1; height: 1px; background: var(--border-color);
  }

  /* ── UNSAVED PILL ── */
  .st-unsaved {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 11px; font-weight: 700;
    color: #b37700; background: rgba(255,170,0,.15);
    padding: 3px 10px; border-radius: 999px;
    margin-left: 10px; vertical-align: middle;
    animation: stPop .2s ease both;
  }
  @keyframes stPop {
    from { opacity: 0; transform: scale(.8); }
    to   { opacity: 1; transform: scale(1); }
  }

  /* ── SAVE BUTTON ── */
  .st-save-wrap { padding: 16px 20px; }
  .st-save {
    width: 100%; height: 50px;
    background: var(--accent); color: #fff;
    border: none; border-radius: 14px;
    font-family: 'Playfair Display', serif;
    font-size: 16px; font-weight: 700;
    cursor: pointer;
    box-shadow: 0 4px 18px rgba(230,0,35,.28);
    transition: background .18s, transform .15s, opacity .18s, box-shadow .18s;
    -webkit-tap-highlight-color: transparent;
    letter-spacing: -.1px;
  }
  .st-save:hover:not(:disabled) {
    background: #ad081b;
    transform: translateY(-1px);
    box-shadow: 0 6px 22px rgba(230,0,35,.35);
  }
  .st-save:active:not(:disabled) { transform: scale(.98); }
  .st-save:disabled { opacity: .5; cursor: not-allowed; transform: none; box-shadow: none; }

  /* ── DANGER ZONE ── */
  .st-danger-card {
    background: var(--bg-primary);
    border: 1px solid rgba(230,0,35,.2);
    border-radius: 22px; overflow: hidden;
    margin-bottom: 14px;
    position: relative;
  }
  .st-danger-strip {
    height: 4px;
    background: linear-gradient(90deg, #e60023, #ff6b7a);
  }
  .st-danger-body { padding: 20px; }
  .st-danger-title {
    font-family: 'Playfair Display', serif;
    font-size: 16px; font-weight: 900;
    color: #e60023; margin-bottom: 6px;
  }
  .st-danger-sub {
    font-size: 13px; color: var(--text-secondary);
    line-height: 1.6; margin-bottom: 18px;
  }
  .st-danger-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 11px 22px; border-radius: 999px;
    background: rgba(230,0,35,.08);
    border: 1.5px solid rgba(230,0,35,.25);
    color: #e60023;
    font-size: 13px; font-weight: 700;
    cursor: pointer; font-family: 'Inter', inherit;
    transition: background .18s, border-color .18s, transform .15s;
    -webkit-tap-highlight-color: transparent;
  }
  .st-danger-btn:hover { background: rgba(230,0,35,.16); border-color: rgba(230,0,35,.5); transform: translateY(-1px); }
  .st-danger-btn:active { transform: scale(.97); }

  /* ── SKELETON ── */
  @keyframes stShimmer {
    0%   { background-position: -700px 0; }
    100% { background-position:  700px 0; }
  }
  .st-skeleton {
    background: linear-gradient(90deg,
      var(--bg-secondary) 25%, var(--border-color) 50%, var(--bg-secondary) 75%
    );
    background-size: 700px 100%;
    animation: stShimmer 1.4s infinite linear;
  }

  /* ── MODAL ── */
  .st-modal-backdrop {
    position: fixed; inset: 0; z-index: 300;
    background: rgba(0,0,0,.5);
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
    animation: stFadeIn .18s ease both;
    backdrop-filter: blur(2px);
  }
  .st-modal {
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 26px; padding: 32px 28px 28px;
    max-width: 380px; width: 100%;
    animation: stSlideUp .24s cubic-bezier(.34,1.56,.64,1) both;
  }
  .st-modal-icon {
    width: 52px; height: 52px; border-radius: 16px;
    background: rgba(230,0,35,.1);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 18px;
  }
  .st-modal-title {
    font-family: 'Playfair Display', serif;
    font-size: 22px; font-weight: 900;
    color: var(--text-primary); margin-bottom: 8px; letter-spacing: -.3px;
  }
  .st-modal-sub {
    font-size: 13px; color: var(--text-secondary);
    line-height: 1.65; margin-bottom: 22px;
  }
  .st-modal-input {
    width: 100%; height: 46px;
    border: 1.5px solid var(--border-color);
    border-radius: 12px; padding: 0 14px;
    font-size: 14px; font-weight: 600;
    background: var(--bg-secondary);
    color: var(--text-primary);
    font-family: 'Inter', inherit; outline: none;
    margin-bottom: 20px;
    letter-spacing: .5px;
    transition: border-color .18s, box-shadow .18s;
  }
  .st-modal-input:focus {
    border-color: #e60023;
    box-shadow: 0 0 0 3px rgba(230,0,35,.12);
  }
  .st-modal-actions { display: flex; gap: 8px; }
  .st-modal-cancel {
    flex: 1; height: 46px; border-radius: 12px;
    background: var(--bg-secondary);
    border: 1.5px solid var(--border-color);
    color: var(--text-primary);
    font-size: 14px; font-weight: 700;
    cursor: pointer; font-family: 'Inter', inherit;
    transition: background .18s;
  }
  .st-modal-cancel:hover { background: var(--bg-tertiary); }
  .st-modal-confirm {
    flex: 1; height: 46px; border-radius: 12px;
    background: #e60023; color: #fff; border: none;
    font-size: 14px; font-weight: 700;
    cursor: pointer; font-family: 'Inter', inherit;
    transition: background .18s, transform .15s;
  }
  .st-modal-confirm:hover:not(:disabled) { background: #ad081b; }
  .st-modal-confirm:disabled { opacity: .5; cursor: not-allowed; }

  /* ── ANIMATIONS ── */
  @keyframes stFadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes stFadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes stSlideUp {
    from { opacity: 0; transform: translateY(24px) scale(.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .st-inner { animation: stFadeUp .4s ease both; }

  /* ── RESPONSIVE ── */
  @media (max-width: 520px) {
    .st-hero { padding: 28px 16px 0; }
    .st-hero-title { font-size: 28px; }
    .st-inner { padding: 0 16px; }
    .st-input-row { grid-template-columns: 1fr; }
    .st-hero-avatar { width: 52px; height: 52px; font-size: 20px; }
    .st-modal { padding: 24px 20px 20px; }
    .st-modal-actions { flex-direction: column-reverse; }
  }
`;

function injectStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('st-styles')) return;
  const s = document.createElement('style');
  s.id = 'st-styles';
  s.textContent = STYLES;
  document.head.appendChild(s);
}

function Toggle({ on, onToggle, label }) {
  return (
    <button
      className="st-toggle"
      onClick={onToggle}
      role="switch"
      aria-checked={on}
      aria-label={label}
      style={{ background: on ? '#e60023' : 'var(--border-color)' }}
    >
      <span className="st-toggle-thumb" style={{ left: on ? 25 : 3 }} />
    </button>
  );
}

function DeleteAccountModal({ onConfirm, onCancel, loading }) {
  const [confirmText, setConfirmText] = useState('');
  const valid = confirmText === 'DELETE';
  return (
    <div className="st-modal-backdrop" onClick={onCancel} role="dialog" aria-modal="true" aria-labelledby="del-title">
      <div className="st-modal" onClick={e => e.stopPropagation()}>
        <div className="st-modal-icon" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke="#e60023" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
        <h2 className="st-modal-title" id="del-title">Delete account?</h2>
        <p className="st-modal-sub">
          This will permanently delete your account, all saved items, and your full order history. This <strong>cannot be undone</strong>. Type <strong>DELETE</strong> below to confirm.
        </p>
        <input
          className="st-modal-input"
          placeholder="Type DELETE to confirm"
          value={confirmText}
          onChange={e => setConfirmText(e.target.value.toUpperCase())}
          autoFocus
          aria-label="Type DELETE to confirm"
        />
        <div className="st-modal-actions">
          <button className="st-modal-cancel" onClick={onCancel} disabled={loading}>Cancel</button>
          <button className="st-modal-confirm" onClick={onConfirm} disabled={!valid || loading}>
            {loading ? 'Deleting…' : 'Delete account'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { user, loading, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const { addToast } = useToast();

  const [form, setForm] = useState({ name: '', street: '', city: '', country: '', phone: '' });
  const [original, setOriginal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  useEffect(() => { injectStyles(); }, []);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      const initial = {
        name:    user.name || '',
        street:  user.address?.street  || '',
        city:    user.address?.city    || '',
        country: user.address?.country || '',
        phone:   user.address?.phone   || '',
      };
      setForm(initial);
      setOriginal(initial);
    }
  }, [user]);

  const isDirty = original && Object.keys(form).some(k => form[k] !== original[k]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!isDirty) return;
    setSaving(true);
    try {
      await api.put('/users/me', {
        name: form.name,
        address: { street: form.street, city: form.city, country: form.country, phone: form.phone },
      });
      setOriginal({ ...form });
      addToast('Settings saved!', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeletingAccount(true);
    try {
      await api.delete('/users/me');
      logout();
      router.push('/');
    } catch {
      addToast('Failed to delete account', 'error');
      setDeletingAccount(false);
      setShowDeleteModal(false);
    }
  };

  if (loading || !user) return (
    <div className="st">
      <div style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-color)', padding: '36px 24px 24px', marginBottom: 28 }}>
        <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="st-skeleton" style={{ width: 60, height: 14, borderRadius: 8 }} />
          <div className="st-skeleton" style={{ width: 200, height: 36, borderRadius: 10 }} />
          <div className="st-skeleton" style={{ width: 260, height: 14, borderRadius: 8 }} />
        </div>
      </div>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div className="st-skeleton" style={{ height: 90, borderRadius: 22 }} />
        <div className="st-skeleton" style={{ height: 340, borderRadius: 22 }} />
      </div>
    </div>
  );

  return (
    <div className="st">

      {/* ── HERO ── */}
      <div className="st-hero">
        <div className="st-hero-bg" aria-hidden="true" />
        <div className="st-hero-inner">
          <button className="st-back" onClick={() => router.back()} aria-label="Go back">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Back
          </button>
          <div className="st-hero-meta">
            <div>
              <span className="st-hero-tag">Your account</span>
              <h1 className="st-hero-title">Settings</h1>
              <p className="st-hero-sub">Manage your profile, address and preferences</p>
            </div>
            <div className="st-hero-avatar" aria-hidden="true">
              {user.avatar
                ? <img src={user.avatar} alt="" />
                : user.name?.[0]?.toUpperCase()
              }
            </div>
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="st-inner">

        {/* APPEARANCE */}
        <div className="st-section-head">
          <div className="st-section-icon" style={{ background: 'rgba(120,0,255,.1)' }} aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="#7c3aed" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          </div>
          <h2 className="st-section-title">Appearance</h2>
        </div>

        <div className="st-card">
          <div className="st-row">
            <div className="st-row-left">
              <div className="st-row-dot" style={{ background: theme === 'dark' ? '#e60023' : 'var(--border-color)' }} />
              <div>
                <p className="st-row-label">Dark mode</p>
                <p className="st-row-sub">Currently {theme === 'dark' ? 'enabled' : 'disabled'}</p>
              </div>
            </div>
            <Toggle on={theme === 'dark'} onToggle={toggleTheme} label="Toggle dark mode" />
          </div>
        </div>

        {/* ACCOUNT */}
        <div className="st-section-head">
          <div className="st-section-icon" style={{ background: 'rgba(0,120,255,.1)' }} aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="#1d4ed8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <h2 className="st-section-title">
            Account
            {isDirty && <span className="st-unsaved">Unsaved changes</span>}
          </h2>
        </div>

        <form onSubmit={handleSave}>
          <div className="st-card">
            <div className="st-field">
              <label className="st-label" htmlFor="st-name">Full name</label>
              <input
                id="st-name"
                className="st-input"
                placeholder="Your full name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <p className="st-addr-head">Shipping address</p>

            <div className="st-field">
              <label className="st-label" htmlFor="st-street">Street</label>
              <input
                id="st-street"
                className="st-input"
                placeholder="123 Moi Avenue"
                value={form.street}
                onChange={e => setForm({ ...form, street: e.target.value })}
              />
            </div>

            <div className="st-field">
              <div className="st-input-row">
                <div>
                  <label className="st-label" htmlFor="st-city">City</label>
                  <input
                    id="st-city"
                    className="st-input"
                    placeholder="Nairobi"
                    value={form.city}
                    onChange={e => setForm({ ...form, city: e.target.value })}
                  />
                </div>
                <div>
                  <label className="st-label" htmlFor="st-country">Country</label>
                  <input
                    id="st-country"
                    className="st-input"
                    placeholder="Kenya"
                    value={form.country}
                    onChange={e => setForm({ ...form, country: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="st-field">
              <label className="st-label" htmlFor="st-phone">Phone number</label>
              <input
                id="st-phone"
                className="st-input"
                placeholder="+254 700 000 000"
                type="tel"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
              />
            </div>

            <div className="st-save-wrap">
              <button
                type="submit"
                className="st-save"
                disabled={saving || !isDirty}
              >
                {saving ? 'Saving…' : isDirty ? 'Save changes' : 'All changes saved'}
              </button>
            </div>
          </div>
        </form>

        {/* DANGER ZONE */}
        <div className="st-section-head">
          <div className="st-section-icon" style={{ background: 'rgba(230,0,35,.1)' }} aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="#e60023" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <h2 className="st-section-title" style={{ color: '#e60023' }}>Danger zone</h2>
        </div>

        <div className="st-danger-card">
          <div className="st-danger-strip" aria-hidden="true" />
          <div className="st-danger-body">
            <p className="st-danger-title">Delete my account</p>
            <p className="st-danger-sub">
              Permanently removes your account, all saved products, and your full order history. Once deleted, this cannot be recovered.
            </p>
            <button className="st-danger-btn" onClick={() => setShowDeleteModal(true)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M10 11v6M14 11v6"/>
                <path d="M9 6V4h6v2"/>
              </svg>
              Delete my account
            </button>
          </div>
        </div>

      </div>

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <DeleteAccountModal
          onConfirm={handleDeleteAccount}
          onCancel={() => !deletingAccount && setShowDeleteModal(false)}
          loading={deletingAccount}
        />
      )}
    </div>
  );
}