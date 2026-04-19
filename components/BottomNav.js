'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { usePathname } from 'next/navigation';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap');

  .bn-nav {
    position: fixed;
    bottom: 0; left: 0; right: 0;
    z-index: 200;
    background: var(--bg-primary);
    border-top: 1px solid var(--border-color);
    padding-bottom: env(safe-area-inset-bottom, 0px);
    display: none;
  }

  .bn-inner {
    display: flex;
    align-items: stretch;
    height: 60px;
    max-width: 500px;
    margin: 0 auto;
  }

  .bn-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    text-decoration: none;
    color: var(--text-tertiary);
    position: relative;
    cursor: pointer;
    border: none;
    background: none;
    padding: 0;
    -webkit-tap-highlight-color: transparent;
    transition: color .18s;
  }
  .bn-item.active { color: var(--accent); }
  .bn-item:not(.active):hover { color: var(--text-secondary); }

  /* Active pill indicator at top */
  .bn-indicator {
    position: absolute;
    top: 0; left: 50%;
    transform: translateX(-50%);
    width: 24px; height: 3px;
    border-radius: 0 0 3px 3px;
    background: var(--accent);
    animation: bnSlideIn .2s ease;
  }

  /* Icon wrapper — subtle bg on active */
  .bn-icon-wrap {
    width: 40px; height: 30px;
    border-radius: 999px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background .18s, transform .15s;
    position: relative;
  }
  .bn-item.active .bn-icon-wrap {
    background: rgba(230,0,35,.1);
  }
  .bn-item:active .bn-icon-wrap {
    transform: scale(.88);
  }

  .bn-label {
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: .2px;
    line-height: 1;
  }

  /* Cart badge */
  .bn-badge {
    position: absolute;
    top: -3px; right: -3px;
    min-width: 16px; height: 16px;
    border-radius: 999px;
    background: var(--accent);
    color: #fff;
    font-family: system-ui, sans-serif;
    font-size: 9px;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 3px;
    border: 2px solid var(--bg-primary);
    animation: bnPop .2s cubic-bezier(.34,1.56,.64,1);
  }

  /* Spacer that pushes page content up */
  .bn-spacer { height: 60px; }

  @keyframes bnSlideIn {
    from { opacity: 0; transform: translateX(-50%) scaleX(.4); }
    to   { opacity: 1; transform: translateX(-50%) scaleX(1); }
  }
  @keyframes bnPop {
    from { transform: scale(0); }
    to   { transform: scale(1); }
  }

  /* Only show on mobile */
  @media (max-width: 700px) {
    .bn-nav  { display: flex; flex-direction: column; }
    .bn-spacer { display: block; }
  }
  @media (min-width: 701px) {
    .bn-spacer { display: none; }
  }
`;

function injectStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('bn-styles')) return;
  const s = document.createElement('style');
  s.id = 'bn-styles';
  s.textContent = STYLES;
  document.head.appendChild(s);
}

/* ── SVG ICONS ── */
const HomeIcon = ({ filled }) => filled ? (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
  </svg>
) : (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const HeartIcon = ({ filled }) => filled ? (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
  </svg>
) : (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
  </svg>
);

const CartIcon = ({ filled }) => filled ? (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-9.8-3h11.4c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0023 6H6.21L5.27 4H2v2h2l3.6 7.59L6.25 16H19v-2H7.42l-.22-.42L7.2 15z"/>
  </svg>
) : (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
  </svg>
);

const ProfileIcon = ({ filled }) => filled ? (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
  </svg>
) : (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const LoginIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/>
    <polyline points="10 17 15 12 10 7"/>
    <line x1="15" y1="12" x2="3" y2="12"/>
  </svg>
);

export default function BottomNav() {
  const { user } = useAuth();
  const { count } = useCart();
  const pathname = usePathname();
  const prevCount = useRef(count);

  useEffect(() => { injectStyles(); }, []);

  // Track badge key to re-trigger pop animation on count change
  const badgeKey = count;
  useEffect(() => { prevCount.current = count; }, [count]);

  const isActive = (href) => pathname === href;

  const navItems = [
    {
      href: '/',
      label: 'Home',
      icon: (active) => <HomeIcon filled={active} />,
    },
    {
      href: '/wishlist',
      label: 'Saved',
      icon: (active) => <HeartIcon filled={active} />,
    },
    {
      href: '/cart',
      label: 'Cart',
      icon: (active) => <CartIcon filled={active} />,
      badge: count,
    },
    user
      ? { href: '/profile', label: 'Profile', icon: (active) => <ProfileIcon filled={active} /> }
      : { href: '/login',   label: 'Log in',  icon: ()       => <LoginIcon /> },
  ];

  return (
    <>
      {/* Pushes page content above the nav */}
      <div className="bn-spacer" />

      <nav className="bn-nav" aria-label="Main navigation">
        <div className="bn-inner">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`bn-item${active ? ' active' : ''}`}
                aria-current={active ? 'page' : undefined}
              >
                {/* Top indicator bar */}
                {active && <span className="bn-indicator" />}

                {/* Icon */}
                <div className="bn-icon-wrap">
                  {item.icon(active)}

                  {/* Cart badge */}
                  {item.badge > 0 && (
                    <span className="bn-badge" key={badgeKey}>
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </div>

                {/* Label */}
                <span className="bn-label">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}