'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

const STATUSES = ['pending','confirmed','shipped','delivered','cancelled'];
const STATUS_COLORS = { pending:'#f59e0b', confirmed:'#3b82f6', shipped:'#8b5cf6', delivered:'#10b981', cancelled:'#ef4444' };

export default function AdminOrdersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('');
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) router.push('/');
  }, [user, loading, router]);

  useEffect(() => {
    if (user?.role === 'admin') {
      const params = filter ? `?status=${filter}` : '';
      api.get(`/orders${params}`)
        .then((r) => setOrders(r.data.orders))
        .finally(() => setFetching(false));
    }
  }, [user, filter]);

  const updateStatus = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status });
    setOrders((prev) => prev.map((o) => o._id === id ? { ...o, status } : o));
  };

  if (loading || fetching) return <div style={{ textAlign: 'center', padding: 60 }}>Loading...</div>;

  return (
    <div style={{ maxWidth: 1100, margin: '32px auto', padding: '0 16px' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20 }}>Orders ({orders.length})</h1>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        <button onClick={() => setFilter('')} style={{
          padding: '7px 16px', borderRadius: 20, border: 'none',
          background: filter === '' ? '#111' : '#efefef',
          color: filter === '' ? '#fff' : '#333', fontSize: 13, fontWeight: 500,
        }}>All</button>
        {STATUSES.map((s) => (
          <button key={s} onClick={() => setFilter(s)} style={{
            padding: '7px 16px', borderRadius: 20, border: 'none',
            background: filter === s ? STATUS_COLORS[s] : '#efefef',
            color: filter === s ? '#fff' : '#333', fontSize: 13, fontWeight: 500,
          }}>{s}</button>
        ))}
      </div>

      <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden' }}>
        {orders.map((order, i) => (
          <div key={order._id} style={{
            padding: '16px 20px',
            borderBottom: i < orders.length - 1 ? '1px solid #f0f0f0' : 'none',
            display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
          }}>
            <div style={{ flex: 1, minWidth: 160 }}>
              <p style={{ fontWeight: 600, fontSize: 14 }}>{order.user?.name}</p>
              <p style={{ fontSize: 12, color: '#888' }}>{order.user?.email}</p>
              <p style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div style={{ minWidth: 120 }}>
              <p style={{ fontWeight: 700 }}>KSh {order.totalAmount?.toLocaleString()}</p>
              <p style={{ fontSize: 12, color: order.paymentStatus === 'paid' ? '#10b981' : '#f59e0b', fontWeight: 600 }}>
                {order.paymentStatus}
              </p>
            </div>
            <select
              value={order.status}
              onChange={(e) => updateStatus(order._id, e.target.value)}
              style={{
                padding: '6px 12px', borderRadius: 20,
                border: `1.5px solid ${STATUS_COLORS[order.status]}`,
                color: STATUS_COLORS[order.status],
                fontWeight: 600, fontSize: 13, outline: 'none', cursor: 'pointer',
              }}
            >
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <Link href={`/orders/${order._id}`} style={{
              padding: '6px 14px', borderRadius: 20,
              border: '1px solid #ddd', fontSize: 13,
            }}>View</Link>
          </div>
        ))}
        {orders.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: '#888' }}>No orders found</div>}
      </div>
    </div>
  );
}