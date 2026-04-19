'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import api from '@/lib/api';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap');

  .ck * { box-sizing: border-box; margin: 0; padding: 0; }
  .ck {
    min-height: 100vh;
    background: var(--bg-tertiary);
    font-family: system-ui, -apple-system, sans-serif;
    padding: 32px 16px 80px;
    color: var(--text-primary);
  }

  .ck-inner {
    max-width: 620px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
    animation: ckFadeUp .4s ease both;
  }

  .ck-title {
    font-family: 'Playfair Display', serif;
    font-size: 28px; font-weight: 900;
    color: var(--text-primary); letter-spacing: -.4px;
    margin-bottom: 4px;
  }
  .ck-sub {
    font-size: 13px; color: var(--text-secondary);
  }

  /* CARD */
  .ck-card {
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 24px;
    overflow: hidden;
  }
  .ck-card-head {
    padding: 18px 22px;
    border-bottom: 1px solid var(--border-color);
    display: flex; align-items: center; gap: 10px;
  }
  .ck-card-head-icon {
    width: 32px; height: 32px; border-radius: 50%;
    background: var(--bg-secondary);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    color: var(--text-secondary);
  }
  .ck-card-head-title {
    font-size: 14px; font-weight: 700;
    color: var(--text-primary); letter-spacing: -.1px;
  }
  .ck-card-body { padding: 18px 22px; }

  /* ORDER SUMMARY ROWS */
  .ck-item-row {
    display: flex; justify-content: space-between;
    align-items: center; padding: 7px 0;
    font-size: 13px; color: var(--text-secondary);
    border-bottom: 1px solid var(--border-color);
  }
  .ck-item-row:last-child { border-bottom: none; }
  .ck-item-name {
    flex: 1; min-width: 0;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    margin-right: 12px; font-weight: 500;
  }
  .ck-item-price { font-weight: 700; color: var(--text-primary); flex-shrink: 0; }
  .ck-total-row {
    display: flex; justify-content: space-between; align-items: baseline;
    padding-top: 14px; margin-top: 6px;
    border-top: 1.5px solid var(--border-color);
  }
  .ck-total-label { font-size: 14px; font-weight: 700; color: var(--text-primary); }
  .ck-total-amount {
    font-family: 'Playfair Display', serif;
    font-size: 22px; font-weight: 900; color: var(--accent);
  }

  /* ERROR */
  .ck-error {
    display: flex; align-items: center; gap: 8px;
    background: rgba(230,0,35,.07);
    border: 1px solid rgba(230,0,35,.2);
    color: var(--accent);
    padding: 11px 14px; border-radius: 14px;
    font-size: 13px; font-weight: 500;
  }

  /* FORM */
  .ck-form { display: flex; flex-direction: column; gap: 0; }
  .ck-field { display: flex; flex-direction: column; gap: 6px; }
  .ck-label {
    font-size: 11px; font-weight: 700;
    color: var(--text-tertiary);
    text-transform: uppercase; letter-spacing: .6px;
  }
  .ck-input {
    width: 100%; height: 48px;
    background: var(--bg-secondary);
    border: 1.5px solid var(--border-color);
    border-radius: 14px;
    padding: 0 16px;
    font-size: 14px; color: var(--text-primary);
    font-family: system-ui, sans-serif;
    outline: none;
    transition: border-color .18s, box-shadow .18s;
  }
  .ck-input::placeholder { color: var(--text-tertiary); }
  .ck-input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(230,0,35,.1);
  }

  .ck-form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  /* MPESA BOX */
  .ck-mpesa {
    background: var(--bg-secondary);
    border: 1.5px solid var(--border-color);
    border-radius: 16px;
    padding: 18px;
  }
  .ck-mpesa-title {
    display: flex; align-items: center; gap: 8px;
    font-size: 14px; font-weight: 700;
    color: var(--text-primary); margin-bottom: 10px;
  }
  .ck-mpesa-logo {
    width: 28px; height: 28px; border-radius: 8px;
    background: #00a651;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 900; color: #fff;
    flex-shrink: 0;
  }
  .ck-mpesa-inst {
    font-size: 13px; color: var(--text-secondary);
    line-height: 1.65; margin-bottom: 14px;
  }
  .ck-mpesa-inst strong { color: var(--text-primary); font-weight: 700; }
  .ck-mpesa-amount {
    display: inline-block;
    background: rgba(0,166,81,.1);
    color: #00a651;
    padding: 4px 12px; border-radius: 999px;
    font-size: 13px; font-weight: 700;
    margin-bottom: 14px;
  }

  /* SUBMIT */
  .ck-submit {
    width: 100%; height: 52px;
    background: var(--accent); color: #fff;
    border: none; border-radius: 999px;
    font-size: 15px; font-weight: 700; letter-spacing: .3px;
    cursor: pointer; font-family: inherit;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    box-shadow: 0 4px 18px rgba(230,0,35,.28);
    transition: background .18s, transform .18s, box-shadow .18s, opacity .18s;
  }
  .ck-submit:hover:not(:disabled) {
    background: #ad081b;
    transform: translateY(-2px);
    box-shadow: 0 8px 26px rgba(230,0,35,.35);
  }
  .ck-submit:disabled { opacity: .6; cursor: not-allowed; }

  /* SECURITY NOTE */
  .ck-secure {
    display: flex; align-items: center; justify-content: center;
    gap: 6px; font-size: 12px; color: var(--text-tertiary);
    font-weight: 500;
  }

  @keyframes ckFadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes ckSpin { to { transform: rotate(360deg); } }
  .ck-spin { animation: ckSpin .7s linear infinite; }

  @media (max-width: 520px) {
    .ck { padding: 20px 12px 60px; }
    .ck-title { font-size: 24px; }
    .ck-form-grid { grid-template-columns: 1fr; }
    .ck-card { border-radius: 20px; }
    .ck-card-head, .ck-card-body { padding: 16px; }
  }
  @media (max-width: 360px) {
    .ck-title { font-size: 20px; }
  }
`;

function injectStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('ck-styles')) return;
  const s = document.createElement('style');
  s.id = 'ck-styles';
  s.textContent = STYLES;
  document.head.appendChild(s);
}

function Spinner() {
  return (
    <svg className="ck-spin" width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
    </svg>
  );
}

export default function CheckoutPage() {
  const { user, loading } = useAuth();
  const { cart, total, clearCart } = useCart();
  const router = useRouter();

  const [street,   setStreet]   = useState('');
  const [city,     setCity]     = useState('');
  const [country,  setCountry]  = useState('Kenya');
  const [phone,    setPhone]    = useState('');
  const [mpesaRef, setMpesaRef] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error,    setError]    = useState('');

  useEffect(() => { injectStyles(); }, []);

  useEffect(() => {
    if (!loading && !user)            router.push('/login');
    if (!loading && cart.length === 0) router.push('/cart');
  }, [user, loading, cart, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const items = cart.map((item) => ({
        product:  item._id,
        title:    item.title,
        image:    item.images?.[0]?.url || '',
        price:    item.price,
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
      setError(err.response?.data?.message || 'Order failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !user) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <Spinner />
    </div>
  );

  return (
    <div className="ck">
      <div className="ck-inner">

        {/* HEADING */}
        <div>
          <h1 className="ck-title">Checkout</h1>
          <p className="ck-sub">{cart.length} item{cart.length !== 1 ? 's' : ''} in your order</p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="ck-error">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8"  x2="12"   y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}

        {/* ORDER SUMMARY */}
        <div className="ck-card">
          <div className="ck-card-head">
            <div className="ck-card-head-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
            </div>
            <span className="ck-card-head-title">Order Summary</span>
          </div>
          <div className="ck-card-body">
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {cart.map((item) => (
                <div key={item._id} className="ck-item-row">
                  <span className="ck-item-name">
                    {item.title} <span style={{ color: 'var(--text-tertiary)', fontWeight: 500 }}>×{item.quantity}</span>
                  </span>
                  <span className="ck-item-price">
                    KSh {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            <div className="ck-total-row">
              <span className="ck-total-label">Total</span>
              <span className="ck-total-amount">KSh {total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* SHIPPING */}
          <div className="ck-card">
            <div className="ck-card-head">
              <div className="ck-card-head-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <span className="ck-card-head-title">Shipping Address</span>
            </div>
            <div className="ck-card-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

                <div className="ck-field">
                  <label className="ck-label">Street address</label>
                  <input
                    className="ck-input"
                    placeholder="e.g. 123 Kenyatta Avenue"
                    required value={street}
                    onChange={(e) => setStreet(e.target.value)}
                  />
                </div>

                <div className="ck-form-grid">
                  <div className="ck-field">
                    <label className="ck-label">City</label>
                    <input
                      className="ck-input"
                      placeholder="e.g. Nairobi"
                      required value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                  <div className="ck-field">
                    <label className="ck-label">Country</label>
                    <input
                      className="ck-input"
                      placeholder="Kenya"
                      required value={country}
                      onChange={(e) => setCountry(e.target.value)}
                    />
                  </div>
                </div>

                <div className="ck-field">
                  <label className="ck-label">Phone number</label>
                  <input
                    className="ck-input"
                    placeholder="e.g. 0712 345 678"
                    required value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    type="tel"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* PAYMENT */}
          <div className="ck-card">
            <div className="ck-card-head">
              <div className="ck-card-head-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
              </div>
              <span className="ck-card-head-title">Payment</span>
            </div>
            <div className="ck-card-body">
              <div className="ck-mpesa">
                <div className="ck-mpesa-title">
                  <div className="ck-mpesa-logo">M</div>
                  M-Pesa Payment
                </div>
                <p className="ck-mpesa-inst">
                  Send <strong>KSh {total.toLocaleString()}</strong> to{' '}
                  <strong>0700 000 000</strong> (Business No: <strong>123456</strong>),
                  then paste the confirmation code below.
                </p>
                <span className="ck-mpesa-amount">KSh {total.toLocaleString()} due</span>

                <div className="ck-field">
                  <label className="ck-label">M-Pesa confirmation code</label>
                  <input
                    className="ck-input"
                    placeholder="e.g. QHX7Y8Z9AB"
                    value={mpesaRef}
                    onChange={(e) => setMpesaRef(e.target.value.toUpperCase())}
                    style={{ fontFamily: 'monospace', letterSpacing: 1 }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SUBMIT */}
          <button type="submit" className="ck-submit" disabled={submitting}>
            {submitting ? (
              <><Spinner /> Placing order…</>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Place order · KSh {total.toLocaleString()}
              </>
            )}
          </button>

          {/* SECURE NOTE */}
          <div className="ck-secure">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            Your order is secure and encrypted
          </div>
        </form>
      </div>
    </div>
  );
}