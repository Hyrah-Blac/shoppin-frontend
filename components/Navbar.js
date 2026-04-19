'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import SearchBar from './SearchBar';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@900&display=swap');

  .nb-nav {
    position: sticky;
    top: 0;
    z-index: 100;
    background: var(--bg-primary);
    border-bottom: 1px solid var(--border-color);
    padding: 0 16px;
    height: 62px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  /* LOGO */
  .nb-logo {
    font-family: 'Playfair Display', serif;
    font-size: 24px;
    font-weight: 900;
    color: var(--accent);
    text-decoration: none;
    letter-spacing: -.5px;
    white-space: nowrap;
    flex-shrink: 0;
    line-height: 1;
  }
  .nb-logo-dot {
    display: inline-block;
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--accent);
    margin-left: 1px;
    margin-bottom: 8px;
    vertical-align: bottom;
  }

  /* ACTIONS */
  .nb-actions {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
    margin-left: auto;
  }

  /* ICON BUTTON */
  .nb-icon-btn {
    width: 40px; height: 40px;
    border-radius: 50%; border: none;
    background: none;
    color: var(--text-primary);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; position: relative;
    text-decoration: none;
    transition: background .18s;
    -webkit-tap-highlight-color: transparent;
    flex-shrink: 0;
  }
  .nb-icon-btn:hover { background: var(--bg-secondary); }
  .nb-icon-btn:active { transform: scale(.93); }

  /* CART BADGE */
  .nb-badge {
    position: absolute;
    top: 4px; right: 4px;
    min-width: 16px; height: 16px;
    border-radius: 999px;
    background: var(--accent); color: #fff;
    font-size: 9px; font-weight: 800;
    display: flex; align-items: center; justify-content: center;
    padding: 0 3px;
    border: 2px solid var(--bg-primary);
    pointer-events: none;
  }

  /* ADMIN UPLOAD BUTTON */
  .nb-upload-btn {
    display: flex; align-items: center; gap: 6px;
    padding: 8px 16px;
    border-radius: 999px;
    background: var(--accent); color: #fff;
    font-size: 13px; font-weight: 700;
    text-decoration: none;
    border: none; cursor: pointer;
    box-shadow: 0 2px 10px rgba(230,0,35,.22);
    transition: background .18s, transform .18s, box-shadow .18s;
    white-space: nowrap;
    -webkit-tap-highlight-color: transparent;
    flex-shrink: 0;
  }
  .nb-upload-btn:hover {
    background: #ad081b;
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(230,0,35,.3);
  }
  .nb-upload-btn:active { transform: scale(.96); }

  /* AUTH BUTTONS */
  .nb-login {
    padding: 8px 16px;
    border-radius: 999px;
    border: 1.5px solid var(--border-color);
    color: var(--text-primary);
    font-size: 13px; font-weight: 600;
    text-decoration: none;
    transition: border-color .18s, background .18s;
    white-space: nowrap;
    -webkit-tap-highlight-color: transparent;
    flex-shrink: 0;
  }
  .nb-login:hover { border-color: var(--text-secondary); background: var(--bg-secondary); }

  .nb-signup {
    padding: 8px 16px;
    border-radius: 999px;
    background: var(--text-primary); color: var(--bg-primary);
    font-size: 13px; font-weight: 700;
    text-decoration: none;
    transition: opacity .18s, transform .18s;
    white-space: nowrap;
    -webkit-tap-highlight-color: transparent;
    flex-shrink: 0;
  }
  .nb-signup:hover { opacity: .85; transform: translateY(-1px); }

  /* AVATAR */
  .nb-avatar {
    width: 36px; height: 36px;
    border-radius: 50%;
    background: var(--accent);
    display: flex; align-items: center; justify-content: center;
    font-weight: 800; font-size: 14px; color: #fff;
    overflow: hidden; flex-shrink: 0;
    text-decoration: none;
    border: 2px solid transparent;
    transition: border-color .18s, transform .18s;
    -webkit-tap-highlight-color: transparent;
  }
  .nb-avatar:hover { border-color: var(--accent); transform: scale(1.06); }
  .nb-avatar img { width: 100%; height: 100%; object-fit: cover; }

  /* AUTH WRAP */
  .nb-auth-wrap { display: flex; align-items: center; gap: 6px; }

  @media (max-width: 480px) {
    .nb-nav { padding: 0 10px; gap: 8px; }
    .nb-logo { font-size: 20px; }
    .nb-upload-label { display: none; }
    .nb-upload-btn { padding: 8px 10px; }
    .nb-login { display: none; }
  }

  @media (max-width: 360px) {
    .nb-logo { font-size: 18px; }
    .nb-signup { display: none; }
  }
`;

function injectStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('nb-styles')) return;
  const s = document.createElement('style');
  s.id = 'nb-styles';
  s.textContent = STYLES;
  document.head.appendChild(s);
}

export default function Navbar() {
  const { user } = useAuth();
  const { count } = useCart();

  useEffect(() => { injectStyles(); }, []);

  const isAdmin = user?.role === 'admin';

  return (
    <nav className="nb-nav">

      {/* LOGO */}
      <Link href="/" className="nb-logo">
        ShopPin<span className="nb-logo-dot" />
      </Link>

      {/* SEARCH */}
      <SearchBar />

      {/* ACTIONS */}
      <div className="nb-actions">

        {/* ADMIN UPLOAD BUTTON */}
        {isAdmin && (
          <Link href="/upload" className="nb-upload-btn">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5"  y1="12" x2="19" y2="12"/>
            </svg>
            <span className="nb-upload-label">Upload</span>
          </Link>
        )}

        {/* CART */}
        <Link href="/cart" className="nb-icon-btn" aria-label="Cart">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          {count > 0 && (
            <span className="nb-badge">
              {count > 99 ? '99+' : count}
            </span>
          )}
        </Link>

        {/* USER */}
        {user ? (
          /* Avatar links directly to profile page */
          <Link href="/profile" className="nb-avatar" aria-label="Go to profile">
            {user.avatar
              ? <img src={user.avatar} alt="" />
              : user.name?.[0]?.toUpperCase()
            }
          </Link>
        ) : (
          <div className="nb-auth-wrap">
            <Link href="/login"  className="nb-login">Log in</Link>
            <Link href="/register" className="nb-signup">Sign up</Link>
          </div>
        )}
      </div>
    </nav>
  );
}