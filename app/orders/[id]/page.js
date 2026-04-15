'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

const STATUS_COLORS = {
  pending: '#f59e0b',
  confirmed: '#3b82f6',
  shipped: '#8b5cf6',
  delivered: '#10b981',
  cancelled: '#ef4444',
};

export default function OrderPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then((r) => setOrder(r.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ textAlign: 'center', padding: 60 }}>Loading...</div>;
  if (!order) return <div style={{ textAlign: 'center', padding: 60 }}>Order not found</div>;

  return (
    <div style={{ maxWidth: 700, margin: '32px auto', padding: '0 16px' }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Order confirmed!</h1>
            <p style={{ fontSize: 13, color: '#888' }}>Order ID: {order._id}</p>
          </div>
          <span style={{
            background: STATUS_COLORS[order.status] + '20',
            color: STATUS_COLORS[order.status],
            padding: '6px 14px', borderRadius: 20,
            fontSize: 13, fontWeight: 600,
          }}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          {order.items.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
              {item.image && (
                <img src={item.image} alt={item.title} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }} />
              )}
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 500 }}>{item.title}</p>
                <p style={{ fontSize: 13, color: '#888' }}>Qty: {item.quantity}</p>
              </div>
              <p style={{ fontWeight: 600 }}>KSh {(item.price * item.quantity).toLocaleString()}</p>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid #eee', paddingTop: 16, marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: '#666' }}>Total</span>
            <span style={{ fontWeight: 700, fontSize: 18 }}>KSh {order.totalAmount?.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#666' }}>Payment</span>
            <span style={{
              color: order.paymentStatus === 'paid' ? '#10b981' : '#f59e0b',
              fontWeight: 600,
            }}>
              {order.paymentStatus === 'paid' ? 'Paid' : 'Pending verification'}
            </span>
          </div>
          {order.mpesaRef && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <span style={{ color: '#666' }}>M-Pesa ref</span>
              <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{order.mpesaRef}</span>
            </div>
          )}
        </div>

        <div style={{ background: '#f9f9f9', borderRadius: 12, padding: 16, marginBottom: 20 }}>
          <p style={{ fontWeight: 600, marginBottom: 4 }}>Shipping to</p>
          <p style={{ fontSize: 14, color: '#444' }}>
            {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.country}
          </p>
          <p style={{ fontSize: 14, color: '#444' }}>{order.shippingAddress?.phone}</p>
        </div>

        <Link href="/" style={{
          display: 'block', textAlign: 'center',
          background: '#e60023', color: '#fff',
          padding: '14px 28px', borderRadius: 16,
          fontWeight: 700, fontSize: 15,
        }}>
          Continue shopping
        </Link>
      </div>
    </div>
  );
}