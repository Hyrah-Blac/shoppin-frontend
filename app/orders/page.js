'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

const STATUS_COLORS = {
  pending: '#f59e0b',
  confirmed: '#3b82f6',
  shipped: '#8b5cf6',
  delivered: '#10b981',
  cancelled: '#ef4444',
};

export default function OrdersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      api.get('/orders/my')
        .then((r) => setOrders(r.data))
        .finally(() => setFetching(false));
    }
  }, [user]);

  if (loading || fetching) return <div style={{ textAlign: 'center', padding: 60 }}>Loading...</div>;

  if (orders.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <p style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>No orders yet</p>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Start shopping and place your first order</p>
        <Link href="/" style={{
          background: '#e60023', color: '#fff',
          padding: '12px 28px', borderRadius: 24,
          fontWeight: 600, fontSize: 15,
        }}>Browse products</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: '32px auto', padding: '0 16px 60px' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Order history</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {orders.map((order) => (
          <Link key={order._id} href={`/orders/${order._id}`} style={{
            background: 'var(--bg-primary)', borderRadius: 16, padding: 16,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            border: '1px solid var(--border-color)',
            textDecoration: 'none',
          }}>
            <div>
              <p style={{ fontWeight: 600, marginBottom: 2 }}>Order {order._id?.slice(-6)}</p>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                {new Date(order.createdAt).toLocaleDateString()} · {order.items?.length} items
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontWeight: 700, color: '#e60023', marginBottom: 4 }}>
                KSh {order.totalAmount?.toLocaleString()}
              </p>
              <span style={{
                background: STATUS_COLORS[order.status] + '20',
                color: STATUS_COLORS[order.status],
                padding: '4px 12px', borderRadius: 16,
                fontSize: 12, fontWeight: 600,
              }}>
                {order.status}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}