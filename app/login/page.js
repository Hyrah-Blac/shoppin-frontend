'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap');

  .lp * { box-sizing: border-box; margin: 0; padding: 0; }
  .lp {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-tertiary);
    padding: 16px;
    font-family: system-ui, -apple-system, sans-serif;
  }

  .lp-card {
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 28px;
    padding: 40px 32px 36px;
    width: 100%;
    max-width: 380px;
    text-align: center;
  }

  .lp-logo {
    font-family: 'Playfair Display', serif;
    font-size: 32px;
    font-weight: 900;
    color: var(--accent);
    letter-spacing: -.5px;
    margin-bottom: 6px;
  }

  .lp-logo-dot {
    display: inline-block;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--accent);
    margin-left: 2px;
    margin-bottom: 6px;
    vertical-align: middle;
  }

  .lp-sub {
    font-size: 14px;
    color: var(--text-secondary);
    margin-bottom: 28px;
    font-weight: 400;
  }

  .lp-error {
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

  .lp-form {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .lp-field {
    position: relative;
    display: flex;
    align-items: center;
  }

  .lp-input {
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
  .lp-input::placeholder { color: var(--text-tertiary); }
  .lp-input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(230,0,35,.1);
  }

  .lp-eye {
    position: absolute;
    right: 14px;
    width: 22px;
    height: 22px;
    border: none;
    background: none;
    cursor: pointer;
    color: var(--text-tertiary);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    transition: color .15s;
    flex-shrink: 0;
  }
  .lp-eye:hover { color: var(--text-secondary); }

  .lp-forgot {
    text-align: right;
    font-size: 12px;
    color: var(--text-secondary);
    text-decoration: none;
    font-weight: 500;
    margin-top: -4px;
    display: block;
    transition: color .15s;
  }
  .lp-forgot:hover { color: var(--accent); }

  .lp-cta {
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
  .lp-cta:hover:not(:disabled) {
    background: #ad081b;
    transform: translateY(-2px);
    box-shadow: 0 8px 26px rgba(230,0,35,.33);
  }
  .lp-cta:disabled { opacity: .6; cursor: not-allowed; }

  .lp-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 20px 0;
    color: var(--text-tertiary);
    font-size: 12px;
    font-weight: 500;
  }
  .lp-divider::before,
  .lp-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border-color);
  }

  .lp-footer {
    font-size: 13px;
    color: var(--text-secondary);
    margin-top: 20px;
  }
  .lp-link {
    color: var(--accent);
    font-weight: 700;
    text-decoration: none;
    transition: opacity .15s;
  }
  .lp-link:hover { opacity: .8; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .lp-card { animation: fadeUp .42s ease both; }

  @keyframes spin { to { transform: rotate(360deg); } }
  .lp-spin { animation: spin .7s linear infinite; }

  @media (max-width: 400px) {
    .lp-card { padding: 32px 20px 28px; border-radius: 24px; }
    .lp-logo { font-size: 28px; }
  }
`;

function injectStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('lp-styles')) return;
  const s = document.createElement('style');
  s.id = 'lp-styles';
  s.textContent = STYLES;
  document.head.appendChild(s);
}

/* Eye icons */
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
    <svg className="lp-spin" width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
    </svg>
  );
}

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  useEffect(() => { injectStyles(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lp">
      <div className="lp-card">

        {/* LOGO */}
        <div className="lp-logo">
          ShopPin<span className="lp-logo-dot" />
        </div>
        <p className="lp-sub">Welcome back</p>

        {/* ERROR */}
        {error && (
          <div className="lp-error">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}

        {/* FORM */}
        <form className="lp-form" onSubmit={handleSubmit}>

          {/* EMAIL */}
          <div className="lp-field">
            <input
              className="lp-input"
              type="email"
              placeholder="Email address"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* PASSWORD */}
          <div className="lp-field">
            <input
              className="lp-input"
              type={showPw ? 'text' : 'password'}
              placeholder="Password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="lp-eye"
              onClick={() => setShowPw(v => !v)}
              aria-label={showPw ? 'Hide password' : 'Show password'}
            >
              {showPw ? <EyeOff /> : <EyeOpen />}
            </button>
          </div>

          {/* FORGOT */}
          <Link href="/forgot-password" className="lp-forgot">
            Forgot password?
          </Link>

          {/* SUBMIT */}
          <button type="submit" className="lp-cta" disabled={loading}>
            {loading ? <><Spinner /> Logging in…</> : 'Log in'}
          </button>
        </form>

        <div className="lp-divider">or</div>

        {/* SIGN UP LINK */}
        <p className="lp-footer">
          No account?{' '}
          <Link href="/register" className="lp-link">Sign up</Link>
        </p>

      </div>
    </div>
  );
}