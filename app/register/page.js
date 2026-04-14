'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(name, email, password);
      router.push('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: '#f0efef', padding: 16,
    }}>
      <div style={{
        background: '#fff', borderRadius: 20,
        padding: '40px 36px', width: '100%', maxWidth: 380,
        textAlign: 'center',
      }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#e60023', marginBottom: 8 }}>ShopPin</h1>
        <p style={{ color: '#555', marginBottom: 24 }}>Create your account</p>

        {error && (
          <div style={{
            background: '#fff0f0', color: '#c0001e',
            padding: '8px 12px', borderRadius: 8,
            fontSize: 13, marginBottom: 16,
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            placeholder="Full name" required
            value={name} onChange={(e) => setName(e.target.value)}
            style={{
              height: 44, border: '1px solid #ddd', borderRadius: 12,
              padding: '0 14px', fontSize: 14, outline: 'none',
            }}
          />
          <input
            type="email" placeholder="Email" required
            value={email} onChange={(e) => setEmail(e.target.value)}
            style={{
              height: 44, border: '1px solid #ddd', borderRadius: 12,
              padding: '0 14px', fontSize: 14, outline: 'none',
            }}
          />
          <input
            type="password" placeholder="Password" required minLength={6}
            value={password} onChange={(e) => setPassword(e.target.value)}
            style={{
              height: 44, border: '1px solid #ddd', borderRadius: 12,
              padding: '0 14px', fontSize: 14, outline: 'none',
            }}
          />
          <button
            type="submit" disabled={loading}
            style={{
              height: 44, background: '#e60023', color: '#fff',
              border: 'none', borderRadius: 12,
              fontSize: 15, fontWeight: 600, marginTop: 4,
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Creating account...' : 'Sign up'}
          </button>
        </form>

        <p style={{ fontSize: 13, color: '#666', marginTop: 20 }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#e60023', fontWeight: 600 }}>Log in</Link>
        </p>
      </div>
    </div>
  );
}