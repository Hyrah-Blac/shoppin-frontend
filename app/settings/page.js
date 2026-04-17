'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useToast } from '@/context/ToastContext';

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const { addToast } = useToast();
  const [form, setForm] = useState({ name: '', street: '', city: '', country: '', phone: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        street: user.address?.street || '',
        city: user.address?.city || '',
        country: user.address?.country || '',
        phone: user.address?.phone || '',
      });
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/users/me', {
        name: form.name,
        address: {
          street: form.street,
          city: form.city,
          country: form.country,
          phone: form.phone,
        },
      });
      addToast('Settings saved!', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) return <div style={{ textAlign: 'center', padding: 60 }}>Loading...</div>;

  const inputStyle = {
    width: '100%', height: 44, border: '1px solid var(--border-color)',
    borderRadius: 12, padding: '0 14px', fontSize: 14, outline: 'none',
    background: 'var(--bg-secondary)', color: 'var(--text-primary)',
  };

  return (
    <div style={{ maxWidth: 600, margin: '32px auto', padding: '0 16px 60px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}>←</button>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Settings</h1>
      </div>

      <div style={{ background: 'var(--bg-primary)', borderRadius: 20, padding: 24, marginBottom: 20 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Appearance</h2>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontWeight: 600, marginBottom: 4 }}>Dark mode</p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Currently {theme === 'dark' ? 'on' : 'off'}</p>
          </div>
          <button
            onClick={toggleTheme}
            style={{
              width: 56, height: 32, borderRadius: 16,
              background: theme === 'dark' ? '#e60023' : '#ddd',
              border: 'none', cursor: 'pointer', position: 'relative',
              transition: 'background 0.3s',
            }}
          >
            <span style={{
              position: 'absolute', top: 2, left: theme === 'dark' ? 26 : 2,
              width: 28, height: 28, background: '#fff',
              borderRadius: '50%', transition: 'left 0.3s',
            }} />
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} style={{ background: 'var(--bg-primary)', borderRadius: 20, padding: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Profile</h2>

        <label style={{ display: 'block', marginBottom: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Name</span>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={inputStyle}
          />
        </label>

        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, marginTop: 20 }}>Address</h3>

        <label style={{ display: 'block', marginBottom: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Street</span>
          <input
            value={form.street}
            onChange={(e) => setForm({ ...form, street: e.target.value })}
            style={inputStyle}
          />
        </label>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <label>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>City</span>
            <input
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              style={inputStyle}
            />
          </label>
          <label>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Country</span>
            <input
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              style={inputStyle}
            />
          </label>
        </div>

        <label style={{ display: 'block', marginBottom: 20 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Phone</span>
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            style={inputStyle}
          />
        </label>

        <button
          type="submit"
          disabled={saving}
          style={{
            width: '100%', height: 48, background: '#e60023',
            color: '#fff', border: 'none', borderRadius: 12,
            fontSize: 15, fontWeight: 700, opacity: saving ? 0.6 : 1,
          }}
        >
          {saving ? 'Saving...' : 'Save changes'}
        </button>
      </form>
    </div>
  );
}