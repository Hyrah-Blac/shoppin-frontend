'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');

  .rp * { box-sizing: border-box; margin: 0; padding: 0; }
  .rp {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f9f9f9;
    padding: 16px;
    font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
  }

  .rp-card {
    background: #ffffff;
    border-radius: 24px;
    padding: 44px 40px 40px;
    width: 100%;
    max-width: 380px;
    text-align: center;
    border: 1px solid #ebebeb;
    animation: rpFadeUp .38s cubic-bezier(.22,.68,0,1.2) both;
  }

  .rp-logo {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 24px;
    text-decoration: none;
  }

  .rp-logo-icon {
    width: 36px;
    height: 36px;
    background: #e60023;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .rp-logo-icon svg {
    width: 18px;
    height: 18px;
    fill: none;
    stroke: #fff;
    stroke-width: 2.2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .rp-logo-name {
    font-size: 20px;
    font-weight: 700;
    color: #111;
    letter-spacing: -0.4px;
  }

  .rp-logo-name span { color: #e60023; }

  .rp-headline {
    font-size: 24px;
    font-weight: 700;
    color: #111;
    letter-spacing: -0.5px;
    margin-bottom: 6px;
    line-height: 1.25;
  }

  .rp-sub {
    font-size: 14px;
    color: #767676;
    margin-bottom: 28px;
    font-weight: 400;
    line-height: 1.5;
  }

  .rp-error {
    background: #fff5f5;
    border: 1px solid #ffd7d7;
    color: #cc0000;
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
    height: 52px;
    background: #f9f9f9;
    border: 1.5px solid #ebebeb;
    border-radius: 14px;
    padding: 0 46px 0 16px;
    font-size: 15px;
    color: #111;
    outline: none;
    transition: border-color .15s, background .15s;
    font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    font-weight: 400;
  }
  .rp-input.no-icon { padding-right: 16px; }
  .rp-input::placeholder { color: #aaa; }
  .rp-input:focus {
    border-color: #111;
    background: #fff;
  }
  .rp-input:disabled { opacity: .55; }

  .rp-eye {
    position: absolute;
    right: 14px;
    width: 22px;
    height: 22px;
    border: none;
    background: none;
    cursor: pointer;
    color: #aaa;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    transition: color .15s;
    flex-shrink: 0;
  }
  .rp-eye:hover { color: #555; }

  .rp-strength {
    display: flex;
    gap: 4px;
    margin-top: -4px;
  }
  .rp-strength-seg {
    flex: 1;
    height: 3px;
    border-radius: 999px;
    background: #ebebeb;
    transition: background .25s;
  }
  .rp-strength-label {
    text-align: left;
    font-size: 11px;
    font-weight: 600;
    margin-top: -6px;
    transition: color .25s;
  }

  .rp-cta {
    width: 100%;
    height: 52px;
    background: #e60023;
    color: #fff;
    border: none;
    border-radius: 999px;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: .1px;
    cursor: pointer;
    margin-top: 4px;
    transition: background .15s, transform .12s, opacity .15s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
  }
  .rp-cta:hover:not(:disabled) {
    background: #c0001e;
    transform: scale(1.015);
  }
  .rp-cta:active:not(:disabled) { transform: scale(0.985); }
  .rp-cta:disabled { opacity: .5; cursor: not-allowed; }

  .rp-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 22px 0;
    color: #bbb;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: .4px;
    text-transform: uppercase;
  }
  .rp-divider::before,
  .rp-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #ebebeb;
  }

  .rp-footer {
    font-size: 13.5px;
    color: #767676;
    margin-top: 4px;
  }
  .rp-link {
    color: #111;
    font-weight: 700;
    text-decoration: none;
    transition: color .15s;
  }
  .rp-link:hover { color: #e60023; }

  .rp-terms {
    font-size: 11.5px;
    color: #aaa;
    margin-top: 16px;
    line-height: 1.6;
  }
  .rp-terms a {
    color: #767676;
    text-decoration: underline;
    transition: color .15s;
  }
  .rp-terms a:hover { color: #111; }

  @keyframes rpFadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes rpSpin { to { transform: rotate(360deg); } }
  .rp-spin { animation: rpSpin .7s linear infinite; }

  @media (max-width: 420px) {
    .rp-card { padding: 32px 22px 28px; border-radius: 20px; }
    .rp-headline { font-size: 21px; }
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

function ShoppingBagIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  );
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

        <div className="rp-logo">
          <div className="rp-logo-icon">
            <ShoppingBagIcon />
          </div>
          <span className="rp-logo-name">Shop<span>Pin</span></span>
        </div>

        <h1 className="rp-headline">Create your account</h1>
        <p className="rp-sub">Join ShopPin and shoppin'</p>

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

          <div className="rp-field">
            <input
              className="rp-input no-icon"
              type="text"
              placeholder="Full name"
              required
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="rp-field">
            <input
              className="rp-input no-icon"
              type="email"
              placeholder="Email address"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

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
              disabled={loading}
            />
            <button
              type="button"
              className="rp-eye"
              onClick={() => setShowPw(v => !v)}
              aria-label={showPw ? 'Hide password' : 'Show password'}
              disabled={loading}
            >
              {showPw ? <EyeOff /> : <EyeOpen />}
            </button>
          </div>

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