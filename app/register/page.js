'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap');

  .rp * { box-sizing: border-box; margin: 0; padding: 0; }
  .rp {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-tertiary);
    padding: 16px;
    font-family: system-ui, -apple-system, sans-serif;
  }

  .rp-card {
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 28px;
    padding: 40px 32px 36px;
    width: 100%;
    max-width: 380px;
    text-align: center;
    animation: rpFadeUp .42s ease both;
  }

  .rp-logo {
    font-family: 'Playfair Display', serif;
    font-size: 32px;
    font-weight: 900;
    color: var(--accent);
    letter-spacing: -.5px;
    margin-bottom: 6px;
  }
  .rp-logo-dot {
    display: inline-block;
    width: 7px; height: 7px;
    border-radius: 50%;
    background: var(--accent);
    margin-left: 2px;
    margin-bottom: 6px;
    vertical-align: middle;
  }
  .rp-sub {
    font-size: 14px;
    color: var(--text-secondary);
    margin-bottom: 28px;
  }

  .rp-error {
    background: rgba(230,0,35,.08);
    border: 1px solid rgba(230,0,35,.2);
    color: var(--accent);
    padding: 10px 14px;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 16px;
    text-align: left;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .rp-form {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .rp-field {
    position: relative;
    display: flex;
    align-items: center;
  }

  .rp-input {
    width: 100%;
    height: 50px;
    background: var(--bg-secondary);
    border: 1.5px solid var(--border-color);
    border-radius: 14px;
    padding: 0 46px 0 16px;
    font-size: 14px;
    color: var(--text-primary);
    outline: none;
    transition: border-color .18s, box-shadow .18s;
    font-family: system-ui, -apple-system, sans-serif;
  }
  .rp-input.no-icon { padding-right: 16px; }
  .rp-input::placeholder { color: var(--text-tertiary); }
  .rp-input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(230,0,35,.1);
  }

  .rp-eye {
    position: absolute;
    right: 14px;
    width: 22px; height: 22px;
    border: none; background: none;
    cursor: pointer;
    color: var(--text-tertiary);
    display: flex; align-items: center; justify-content: center;
    padding: 0;
    transition: color .15s;
    flex-shrink: 0;
  }
  .rp-eye:hover { color: var(--text-secondary); }

  /* Password strength bar */
  .rp-strength {
    display: flex;
    gap: 4px;
    margin-top: -4px;
  }
  .rp-strength-seg {
    flex: 1;
    height: 3px;
    border-radius: 999px;
    background: var(--border-color);
    transition: background .3s;
  }
  .rp-strength-label {
    text-align: left;
    font-size: 11px;
    font-weight: 600;
    margin-top: -6px;
    transition: color .3s;
  }

  .rp-cta {
    width: 100%;
    height: 50px;
    background: var(--accent);
    color: #fff;
    border: none;
    border-radius: 999px;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: .3px;
    cursor: pointer;
    margin-top: 4px;
    box-shadow: 0 4px 18px rgba(230,0,35,.25);
    transition: background .18s, transform .18s, box-shadow .18s, opacity .18s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-family: system-ui, -apple-system, sans-serif;
  }
  .rp-cta:hover:not(:disabled) {
    background: #ad081b;
    transform: translateY(-2px);
    box-shadow: 0 8px 26px rgba(230,0,35,.33);
  }
  .rp-cta:disabled { opacity: .6; cursor: not-allowed; }

  .rp-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 20px 0;
    color: var(--text-tertiary);
    font-size: 12px;
    font-weight: 500;
  }
  .rp-divider::before, .rp-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border-color);
  }

  .rp-footer {
    font-size: 13px;
    color: var(--text-secondary);
    margin-top: 20px;
  }
  .rp-link {
    color: var(--accent);
    font-weight: 700;
    text-decoration: none;
    transition: opacity .15s;
  }
  .rp-link:hover { opacity: .8; }

  .rp-terms {
    font-size: 11px;
    color: var(--text-tertiary);
    margin-top: 16px;
    line-height: 1.6;
  }
  .rp-terms a {
    color: var(--text-secondary);
    text-decoration: underline;
    transition: color .15s;
  }
  .rp-terms a:hover { color: var(--text-primary); }

  @keyframes rpFadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes rpSpin { to { transform: rotate(360deg); } }
  .rp-spin { animation: rpSpin .7s linear infinite; }

  @media (max-width: 400px) {
    .rp-card { padding: 32px 20px 28px; border-radius: 24px; }
    .rp-logo { font-size: 28px; }
  }
`;

function injectStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('rp-styles')) return;
  const s = document.createElement('style');
  s.id = 'rp-styles';
  s.textContent = STYLES;
  document.head.appendChild(s);
}

function EyeOpen() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}
function EyeOff() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}
function Spinner() {
  return (
    <svg className="rp-spin" width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
    </svg>
  );
}

/* Password strength scorer */
function getStrength(pw) {
  if (!pw) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pw.length >= 6)  score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { score: 1, label: 'Weak',   color: '#e60023' };
  if (score <= 2) return { score: 2, label: 'Fair',   color: '#f59e0b' };
  if (score <= 3) return { score: 3, label: 'Good',   color: '#3b82f6' };
  return             { score: 4, label: 'Strong', color: '#00875a' };
}

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  useEffect(() => { injectStyles(); }, []);

  const strength = getStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(name, email, password);
      router.push('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rp">
      <div className="rp-card">

        {/* LOGO */}
        <div className="rp-logo">
          ShopPin<span className="rp-logo-dot" />
        </div>
        <p className="rp-sub">Create your account</p>

        {/* ERROR */}
        {error && (
          <div className="rp-error">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}

        <form className="rp-form" onSubmit={handleSubmit}>

          {/* NAME */}
          <div className="rp-field">
            <input
              className="rp-input no-icon"
              type="text"
              placeholder="Full name"
              required
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* EMAIL */}
          <div className="rp-field">
            <input
              className="rp-input no-icon"
              type="email"
              placeholder="Email address"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* PASSWORD */}
          <div className="rp-field">
            <input
              className="rp-input"
              type={showPw ? 'text' : 'password'}
              placeholder="Password (min. 6 characters)"
              required
              minLength={6}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="rp-eye"
              onClick={() => setShowPw(v => !v)}
              aria-label={showPw ? 'Hide password' : 'Show password'}
            >
              {showPw ? <EyeOff /> : <EyeOpen />}
            </button>
          </div>

          {/* STRENGTH METER */}
          {password.length > 0 && (
            <>
              <div className="rp-strength">
                {[1, 2, 3, 4].map((seg) => (
                  <div
                    key={seg}
                    className="rp-strength-seg"
                    style={{ background: seg <= strength.score ? strength.color : undefined }}
                  />
                ))}
              </div>
              <p className="rp-strength-label" style={{ color: strength.color }}>
                {strength.label} password
              </p>
            </>
          )}

          {/* SUBMIT */}
          <button type="submit" className="rp-cta" disabled={loading}>
            {loading ? <><Spinner /> Creating account…</> : 'Create account'}
          </button>
        </form>

        <div className="rp-divider">or</div>

        <p className="rp-footer">
          Already have an account?{' '}
          <Link href="/login" className="rp-link">Log in</Link>
        </p>

        <p className="rp-terms">
          By signing up, you agree to our{' '}
          <a href="/terms">Terms of Service</a> and{' '}
          <a href="/privacy">Privacy Policy</a>.
        </p>

      </div>
    </div>
  );
}