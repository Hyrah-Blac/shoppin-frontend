'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import SearchBar from './SearchBar';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();

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
      <Link href="/" style={{ fontSize: 22, fontWeight: 700, color: '#e60023', whiteSpace: 'nowrap' }}>
        ShopPin
      </Link>

      <SearchBar />

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Link href="/cart" style={{ position: 'relative', padding: 8, display: 'flex', textDecoration: 'none', color: 'var(--text-primary)' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
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
              fontSize: 9,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>{count}</span>
          )}
        </Link>

        {user ? (
          <Link 
            href="/profile" 
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
              position: 'relative',
              textDecoration: 'none',
            }}
          >
            {user.avatar
              ? <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : user.name?.[0]?.toUpperCase()}
          </Link>
        ) : (
          <>
            <Link href="/login" style={{
              padding: '8px 16px',
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 500,
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              textDecoration: 'none',
            }}>Log in</Link>
            <Link href="/register" style={{
              background: '#e60023',
              color: '#fff',
              padding: '8px 16px',
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 500,
              textDecoration: 'none',
            }}>Sign up</Link>
          </>
        )}
      </div>
    </nav>
  );
}