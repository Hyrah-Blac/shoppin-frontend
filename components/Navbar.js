'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [search, setSearch] = useState('');
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) router.push(`/?search=${encodeURIComponent(search.trim())}`);
    else router.push('/');
  };

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: '#fff', display: 'flex', alignItems: 'center',
      gap: 12, padding: '10px 16px',
      borderBottom: '1px solid #e0e0e0',
    }}>
      <Link href="/" style={{ fontSize: 22, fontWeight: 700, color: '#e60023', whiteSpace: 'nowrap' }}>
        ShopPin
      </Link>

      <form onSubmit={handleSearch} style={{ flex: 1 }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          style={{
            width: '100%', height: 40, borderRadius: 24,
            border: 'none', background: '#efefef',
            padding: '0 16px', fontSize: 14, outline: 'none',
          }}
        />
      </form>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {user ? (
          <>
            <Link href="/upload" style={{
              background: '#111', color: '#fff',
              padding: '8px 16px', borderRadius: 24,
              fontSize: 13, fontWeight: 500,
            }}>
              + Upload
            </Link>
            <Link href="/profile" style={{
              width: 36, height: 36, borderRadius: '50%',
              background: '#efefef', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: 14, overflow: 'hidden',
            }}>
              {user.avatar
                ? <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : user.name?.[0]?.toUpperCase()}
            </Link>
            <button onClick={logout} style={{
              fontSize: 13, padding: '8px 12px',
              borderRadius: 24, border: '1px solid #ccc',
              background: 'transparent',
            }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" style={{
              padding: '8px 16px', borderRadius: 24,
              fontSize: 13, fontWeight: 500,
              border: '1px solid #ccc',
            }}>
              Log in
            </Link>
            <Link href="/register" style={{
              background: '#e60023', color: '#fff',
              padding: '8px 16px', borderRadius: 24,
              fontSize: 13, fontWeight: 500,
            }}>
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}