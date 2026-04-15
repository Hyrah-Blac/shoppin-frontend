'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) router.push('/');
  }, [user, loading, router]);

  useEffect(() => {
    if (user?.role === 'admin') {
      api.get('/admin/stats').then((r) => setStats(r.data));
    }
  }, [user]);

  if (loading || !user) return <div style={{ textAlign: 'center', padding: 60 }}>Loading...</div>;
  if (user.role !== 'admin') return null;

  const statCard = (label, value, color = '#111') => (
    <div style={{ background: '#fff', borderRadius: 16, padding: 24, flex: 1, minWidth: 140 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>{label}</p>
      <p style={{ fontSize: 28, fontWeight: 700, color }}>{value ?? '...'}</p>
    </div>
  );

  return (
    <div style={{ maxWidth: 1100, margin: '32px auto', padding: '0 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700 }}>Admin dashboard</h1>
        <Link href="/admin/products/new" style={{
          background: '#e60023', color: '#fff',
          padding: '10px 20px', borderRadius: 24,
          fontWeight: 600, fontSize: 14,
        }}>+ Add product</Link>
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 32 }}>
        {statCard('Total users', stats?.totalUsers)}
        {statCard('Total products', stats?.totalProducts)}
        {statCard('Total orders', stats?.totalOrders)}
        {statCard('Revenue (KSh)', stats?.totalRevenue?.toLocaleString(), '#e60023')}
        {statCard('Pending orders', stats?.pendingOrders, '#f59e0b')}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        {[
          { href: '/admin/products', label: 'Manage products', icon: '📦' },
          { href: '/admin/orders', label: 'Manage orders', icon: '🛍️' },
          { href: '/admin/users', label: 'Manage users', icon: '👥' },
        ].map((item) => (
          <Link key={item.href} href={item.href} style={{
            background: '#fff', borderRadius: 16, padding: 24,
            display: 'flex', alignItems: 'center', gap: 16,
            fontWeight: 600, fontSize: 15,
          }}>
            <span style={{ fontSize: 28 }}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </div>

      {stats?.recentOrders?.length > 0 && (
        <div style={{ background: '#fff', borderRadius: 16, padding: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Recent orders</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {stats.recentOrders.map((order) => (
              <Link key={order._id} href={`/orders/${order._id}`} style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', padding: '10px 0',
                borderBottom: '1px solid #f0f0f0',
              }}>
                <div>
                  <p style={{ fontWeight: 500, fontSize: 14 }}>{order.user?.name}</p>
                  <p style={{ fontSize: 12, color: '#888' }}>{order.user?.email}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: 600 }}>KSh {order.totalAmount?.toLocaleString()}</p>
                  <p style={{ fontSize: 12, color: '#888' }}>{order.status}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}