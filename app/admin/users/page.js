'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function AdminUsersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) router.push('/');
  }, [user, loading, router]);

  useEffect(() => {
    if (user?.role === 'admin') {
      api.get('/admin/users')
        .then((r) => setUsers(r.data))
        .finally(() => setFetching(false));
    }
  }, [user]);

  const toggleRole = async (id, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!confirm(`Make this user ${newRole}?`)) return;
    const { data } = await api.put(`/admin/users/${id}/role`, { role: newRole });
    setUsers((prev) => prev.map((u) => u._id === id ? data : u));
  };

  const deleteUser = async (id) => {
    if (!confirm('Delete this user permanently?')) return;
    await api.delete(`/admin/users/${id}`);
    setUsers((prev) => prev.filter((u) => u._id !== id));
  };

  if (loading || fetching) return <div style={{ textAlign: 'center', padding: 60 }}>Loading...</div>;

  return (
    <div style={{ maxWidth: 1000, margin: '32px auto', padding: '0 16px' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20 }}>Users ({users.length})</h1>

      <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden' }}>
        {users.map((u, i) => (
          <div key={u._id} style={{
            display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px',
            borderBottom: i < users.length - 1 ? '1px solid #f0f0f0' : 'none',
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%', background: '#efefef',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: 16, flexShrink: 0, overflow: 'hidden',
            }}>
              {u.avatar ? <img src={u.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : u.name?.[0]?.toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, fontSize: 14 }}>{u.name}</p>
              <p style={{ fontSize: 13, color: '#888' }}>{u.email}</p>
            </div>
            <span style={{
              padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
              background: u.role === 'admin' ? '#e60023' : '#efefef',
              color: u.role === 'admin' ? '#fff' : '#555',
            }}>{u.role}</span>
            <p style={{ fontSize: 12, color: '#aaa', minWidth: 80, textAlign: 'right' }}>
              {new Date(u.createdAt).toLocaleDateString()}
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => toggleRole(u._id, u.role)} style={{
                padding: '6px 14px', borderRadius: 20,
                border: '1px solid #ddd', fontSize: 13, background: 'transparent',
              }}>
                {u.role === 'admin' ? 'Make user' : 'Make admin'}
              </button>
              <button onClick={() => deleteUser(u._id)} style={{
                padding: '6px 14px', borderRadius: 20,
                border: '1px solid #ffcdd2', color: '#e60023',
                background: 'transparent', fontSize: 13,
              }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}