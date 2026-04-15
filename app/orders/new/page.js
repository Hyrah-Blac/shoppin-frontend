'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import api from '@/lib/api';

export default function CheckoutPage() {
  const { user, loading } = useAuth();
  const { cart, total, clearCart } = useCart();
  const router = useRouter();
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('Kenya');
  const [phone, setPhone] = useState('');
  const [mpesaRef, setMpesaRef] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) router.push('/login');
    if (!loading && cart.length === 0) router.push('/cart');
  }, [user, loading, cart, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const items = cart.map((item) => ({
        product: item._id,
        title: item.title,
        image: item.images?.[0]?.url || '',
        price: item.price,
        quantity: item.quantity,
      }));
      const { data } = await api.post('/orders', {
        items,
        shippingAddress: { street, city, country, phone },
        paymentMethod: 'mpesa',
        mpesaRef,
      });
      clearCart();
      router.push(`/orders/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Order failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !user) return <div style={{ textAlign: 'center', padding: 60 }}>Loading...</div>;

  const inputStyle = {
    width: '100%', height: 44, border: '1px solid #ddd',
    borderRadius: 12, padding: '0 14px', fontSize: 14, outline: 'none',
  };

  return (
    <div style={{ maxWidth: 600, margin: '32px auto', padding: '0 16px' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Checkout</h1>

      <div style={{ background: '#fff', borderRadius: 16, padding: 20, marginBottom: 20 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Order summary</h2>
        {cart.map((item) => (
          <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 14 }}>
            <span>{item.title} × {item.quantity}</span>
            <span style={{ fontWeight: 600 }}>KSh {(item.price * item.quantity).toLocaleString()}</span>
          </div>
        ))}
        <div style={{ borderTop: '1px solid #eee', marginTop: 10, paddingTop: 10, display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 700 }}>Total</span>
          <span style={{ fontWeight: 700, color: '#e60023' }}>KSh {total.toLocaleString()}</span>
        </div>
      </div>

      {error && (
        <div style={{ background: '#fff0f0', color: '#c0001e', padding: '8px 12px', borderRadius: 8, fontSize: 13, marginBottom: 16 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600 }}>Shipping address</h2>
        <input placeholder="Street address" required value={street} onChange={(e) => setStreet(e.target.value)} style={inputStyle} />
        <input placeholder="City" required value={city} onChange={(e) => setCity(e.target.value)} style={inputStyle} />
        <input placeholder="Country" required value={country} onChange={(e) => setCountry(e.target.value)} style={inputStyle} />
        <input placeholder="Phone number" required value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle} />

        <h2 style={{ fontSize: 16, fontWeight: 600, marginTop: 8 }}>Payment</h2>
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: 16 }}>
          <p style={{ fontWeight: 600, marginBottom: 4 }}>M-Pesa payment</p>
          <p style={{ fontSize: 13, color: '#444', marginBottom: 12 }}>
            Send KSh {total.toLocaleString()} to <strong>0700 000 000</strong> (Business No: 123456),
            then enter the M-Pesa confirmation code below.
          </p>
          <input
            placeholder="M-Pesa code e.g. QHX7Y8Z9AB"
            value={mpesaRef}
            onChange={(e) => setMpesaRef(e.target.value.toUpperCase())}
            style={inputStyle}
          />
        </div>

        <button type="submit" disabled={submitting} style={{
          height: 52, background: '#e60023', color: '#fff',
          border: 'none', borderRadius: 16, fontSize: 16,
          fontWeight: 700, marginTop: 8, opacity: submitting ? 0.6 : 1,
        }}>
          {submitting ? 'Placing order...' : 'Place order'}
        </button>
      </form>
    </div>
  );
}