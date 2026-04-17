'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import SearchBar from './SearchBar';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'var(--bg-primary)',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '10px 16px',
      borderBottom: '1px solid var(--border-color)',
    }}>
      {/* Logo */}
      <Link href="/" style={{
        fontSize: 22,
        fontWeight: 700,
        color: '#e60023',
        whiteSpace: 'nowrap'
      }}>
        ShopPin
      </Link>

      {/* Search */}
      <SearchBar />

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title="Toggle theme"
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'var(--bg-secondary)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
          }}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        {/* Cart */}
        <Link href="/cart" style={{ position: 'relative', padding: 8, display: 'flex' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>

          {count > 0 && (
            <span style={{
              position: 'absolute',
              top: 2,
              right: 2,
              background: '#e60023',
              color: '#fff',
              borderRadius: '50%',
              width: 16,
              height: 16,
              fontSize: 10,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {count}
            </span>
          )}
        </Link>

        {/* Auth */}
        {user ? (
          <>
            {/* Avatar / Menu toggle */}
            <button
              onClick={() => setShowMenu(!showMenu)}
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'var(--bg-secondary)',
                border: 'none',
                fontWeight: 700,
                fontSize: 14,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              {user.avatar
                ? <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : user.name?.[0]?.toUpperCase()}
            </button>

            {/* Dropdown */}
            {showMenu && (
              <div style={{
                position: 'absolute',
                top: 60,
                right: 16,
                background: 'var(--bg-primary)',
                borderRadius: 16,
                border: '1px solid var(--border-color)',
                minWidth: 180,
                zIndex: 50,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}>
                <Link href="/profile" style={{
                  display: 'block',
                  padding: '12px 16px',
                  fontSize: 13,
                  borderBottom: '1px solid var(--border-color)',
                }}>👤 Profile</Link>

                <Link href="/orders" style={{
                  display: 'block',
                  padding: '12px 16px',
                  fontSize: 13,
                  borderBottom: '1px solid var(--border-color)',
                }}>📦 Orders</Link>

                {user.role === 'admin' && (
                  <Link href="/admin" style={{
                    display: 'block',
                    padding: '12px 16px',
                    fontSize: 13,
                    borderBottom: '1px solid var(--border-color)',
                  }}>⚙️ Admin</Link>
                )}

                <Link href="/settings" style={{
                  display: 'block',
                  padding: '12px 16px',
                  fontSize: 13,
                  borderBottom: '1px solid var(--border-color)',
                }}>⚙️ Settings</Link>

                <button
                  onClick={logout}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '12px 16px',
                    background: 'none',
                    border: 'none',
                    fontSize: 13,
                    color: '#e60023',
                    cursor: 'pointer',
                  }}
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <Link href="/login" style={{
              padding: '8px 16px',
              borderRadius: 24,
              fontSize: 13,
              fontWeight: 500,
              border: '1px solid var(--border-color)',
            }}>
              Log in
            </Link>

            <Link href="/register" style={{
              background: '#e60023',
              color: '#fff',
              padding: '8px 16px',
              borderRadius: 24,
              fontSize: 13,
              fontWeight: 500,
            }}>
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}