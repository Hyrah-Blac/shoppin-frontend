'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap');

  .op * { box-sizing: border-box; margin: 0; padding: 0; }
  .op {
    min-height: 100vh;
    background: var(--bg-tertiary);
    font-family: system-ui, -apple-system, sans-serif;
    padding: 32px 16px 80px;
  }

  .op-card {
    max-width: 660px;
    margin: 0 auto;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 28px;
    overflow: hidden;
    animation: opFadeUp .4s ease both;
  }

  /* ── TOP BANNER ── */
  .op-banner {
    background: var(--accent);
    padding: 28px 28px 24px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }
  .op-banner-left {}
  .op-banner-icon {
    width: 44px; height: 44px;
    border-radius: 50%;
    background: rgba(255,255,255,.2);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 12px;
  }
  .op-banner-title {
    font-family: 'Playfair Display', serif;
    font-size: 22px; font-weight: 900;
    color: #fff; margin-bottom: 4px;
    letter-spacing: -.3px;
  }
  .op-banner-id {
    font-size: 11px; font-weight: 600;
    color: rgba(255,255,255,.7);
    letter-spacing: .4px; text-transform: uppercase;
  }

  /* STATUS BADGE */
  .op-status {
    display: inline-block;
    padding: 6px 14px; border-radius: 999px;
    font-size: 11px; font-weight: 700;
    letter-spacing: .3px; flex-shrink: 0;
    background: rgba(255,255,255,.2);
    color: #fff;
  }

  /* ── PROGRESS TRACK ── */
  .op-track {
    padding: 24px 28px;
    border-bottom: 1px solid var(--border-color);
    background: var(--bg-secondary);
  }
  .op-track-steps {
    display: flex; align-items: center; gap: 0;
  }
  .op-track-step {
    display: flex; flex-direction: column; align-items: center;
    flex: 1; position: relative;
  }
  .op-track-dot {
    width: 28px; height: 28px;
    border-radius: 50%;
    border: 2.5px solid var(--border-color);
    background: var(--bg-primary);
    display: flex; align-items: center; justify-content: center;
    z-index: 1; position: relative;
    transition: border-color .3s, background .3s;
    flex-shrink: 0;
  }
  .op-track-dot.done {
    border-color: #10b981;
    background: #10b981;
  }
  .op-track-dot.active {
    border-color: var(--accent);
    background: var(--accent);
  }
  .op-track-label {
    font-size: 10px; font-weight: 600;
    color: var(--text-tertiary);
    margin-top: 6px; text-align: center;
    letter-spacing: .2px;
  }
  .op-track-label.done   { color: #10b981; }
  .op-track-label.active { color: var(--accent); }
  .op-track-line {
    position: absolute;
    top: 14px; left: 50%; right: -50%;
    height: 2px;
    background: var(--border-color);
    z-index: 0;
  }
  .op-track-line.done { background: #10b981; }
  .op-track-step:last-child .op-track-line { display: none; }

  /* ── BODY ── */
  .op-body { padding: 24px 28px; }

  /* ITEMS */
  .op-items { display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; }
  .op-item {
    display: flex; align-items: center; gap: 14px;
    padding: 12px;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 16px;
  }
  .op-item-img {
    width: 58px; height: 58px;
    border-radius: 12px; object-fit: cover;
    flex-shrink: 0; background: var(--bg-tertiary);
    display: block;
  }
  .op-item-title {
    font-size: 14px; font-weight: 600;
    color: var(--text-primary); margin-bottom: 3px;
  }
  .op-item-qty {
    font-size: 12px; color: var(--text-tertiary); font-weight: 500;
  }
  .op-item-price {
    font-size: 14px; font-weight: 700;
    color: var(--text-primary);
    margin-left: auto; flex-shrink: 0;
  }

  /* DIVIDER */
  .op-divider { height: 1px; background: var(--border-color); margin: 0 0 20px; }

  /* SUMMARY ROWS */
  .op-summary { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
  .op-row {
    display: flex; justify-content: space-between; align-items: center;
    font-size: 14px;
  }
  .op-row-label { color: var(--text-secondary); font-weight: 500; }
  .op-row-val   { color: var(--text-primary);   font-weight: 600; }
  .op-row-val.total {
    font-family: 'Playfair Display', serif;
    font-size: 22px; font-weight: 900; color: var(--accent);
  }
  .op-row-val.paid    { color: #10b981; }
  .op-row-val.pending { color: #f59e0b; }
  .op-row-val.mono    { font-family: monospace; font-size: 13px; }

  /* SHIPPING BOX */
  .op-shipping {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    padding: 16px 18px;
    margin-bottom: 24px;
  }
  .op-shipping-title {
    font-size: 11px; font-weight: 700;
    color: var(--text-tertiary); letter-spacing: .6px;
    text-transform: uppercase; margin-bottom: 8px;
  }
  .op-shipping-line {
    font-size: 14px; color: var(--text-secondary);
    line-height: 1.6; font-weight: 500;
  }

  /* CTA */
  .op-cta {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    width: 100%; height: 50px;
    background: var(--accent); color: #fff;
    border: none; border-radius: 999px;
    font-size: 15px; font-weight: 700; letter-spacing: .3px;
    text-decoration: none; font-family: inherit;
    box-shadow: 0 4px 18px rgba(230,0,35,.25);
    transition: background .18s, transform .18s, box-shadow .18s;
  }
  .op-cta:hover {
    background: #ad081b;
    transform: translateY(-2px);
    box-shadow: 0 8px 26px rgba(230,0,35,.33);
  }

  /* LOADING / ERROR */
  .op-center {
    display: flex; align-items: center; justify-content: center;
    min-height: 50vh;
    font-family: system-ui, sans-serif;
    font-size: 14px; color: var(--text-tertiary);
  }

  @keyframes opFadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* RESPONSIVE */
  @media (max-width: 520px) {
    .op { padding: 20px 12px 60px; }
    .op-card { border-radius: 22px; }
    .op-banner { padding: 22px 20px 20px; }
    .op-body { padding: 20px; }
    .op-banner-title { font-size: 19px; }
    .op-track { padding: 20px; }
    .op-track-label { font-size: 9px; }
  }
  @media (max-width: 360px) {
    .op-banner-title { font-size: 17px; }
    .op-item-img { width: 48px; height: 48px; }
  }
`;

function injectStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('op-styles')) return;
  const s = document.createElement('style');
  s.id = 'op-styles';
  s.textContent = STYLES;
  document.head.appendChild(s);
}

const STEPS = ['pending', 'confirmed', 'shipped', 'delivered'];
const STEP_LABELS = ['Placed', 'Confirmed', 'Shipped', 'Delivered'];

function TrackStep({ label, state }) {
  return (
    <div className="op-track-step">
      <div className={`op-track-dot ${state}`}>
        {state === 'done' && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        )}
        {state === 'active' && (
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />
        )}
      </div>
      <span className={`op-track-label ${state}`}>{label}</span>
      <div className={`op-track-line ${state === 'done' ? 'done' : ''}`} />
    </div>
  );
}

const STATUS_COLORS = {
  pending:   '#f59e0b',
  confirmed: '#3b82f6',
  shipped:   '#8b5cf6',
  delivered: '#10b981',
  cancelled: '#ef4444',
};

export default function OrderPage() {
  const { id } = useParams();
  const [order, setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { injectStyles(); }, []);

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then((r) => setOrder(r.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="op"><div className="op-center">Loading…</div></div>;
  if (!order)  return (
    <div className="op">
      <div className="op-center" style={{ flexDirection: 'column', gap: 16 }}>
        <p style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: 18 }}>Order not found</p>
        <Link href="/" className="op-cta" style={{ width: 'auto', padding: '0 28px' }}>Back to home</Link>
      </div>
    </div>
  );

  const isCancelled = order.status === 'cancelled';
  const currentStep = STEPS.indexOf(order.status);

  return (
    <div className="op">
      <div className="op-card">

        {/* ── BANNER ── */}
        <div className="op-banner" style={{ background: isCancelled ? '#1a1a1a' : 'var(--accent)' }}>
          <div className="op-banner-left">
            <div className="op-banner-icon">
              {isCancelled ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
            </div>
            <h1 className="op-banner-title">
              {isCancelled ? 'Order cancelled' : 'Order confirmed!'}
            </h1>
            <p className="op-banner-id">#{order._id?.slice(-10).toUpperCase()}</p>
          </div>
          <span className="op-status">
            {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
          </span>
        </div>

        {/* ── PROGRESS TRACK (hide if cancelled) ── */}
        {!isCancelled && (
          <div className="op-track">
            <div className="op-track-steps">
              {STEPS.map((step, i) => {
                const state = i < currentStep ? 'done' : i === currentStep ? 'active' : '';
                return <TrackStep key={step} label={STEP_LABELS[i]} state={state} />;
              })}
            </div>
          </div>
        )}

        {/* ── BODY ── */}
        <div className="op-body">

          {/* ITEMS */}
          <div className="op-items">
            {order.items?.map((item, i) => (
              <div key={i} className="op-item">
                {item.image && (
                  <img className="op-item-img" src={item.image} alt={item.title} />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className="op-item-title">{item.title}</p>
                  <p className="op-item-qty">Qty: {item.quantity}</p>
                </div>
                <p className="op-item-price">
                  KSh {(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          <div className="op-divider" />

          {/* SUMMARY */}
          <div className="op-summary">
            <div className="op-row">
              <span className="op-row-label">Total</span>
              <span className="op-row-val total">KSh {order.totalAmount?.toLocaleString()}</span>
            </div>
            <div className="op-row">
              <span className="op-row-label">Payment</span>
              <span className={`op-row-val ${order.paymentStatus === 'paid' ? 'paid' : 'pending'}`}>
                {order.paymentStatus === 'paid' ? '✓ Paid' : 'Pending verification'}
              </span>
            </div>
            {order.mpesaRef && (
              <div className="op-row">
                <span className="op-row-label">M-Pesa ref</span>
                <span className="op-row-val mono">{order.mpesaRef}</span>
              </div>
            )}
            <div className="op-row">
              <span className="op-row-label">Placed on</span>
              <span className="op-row-val">
                {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric',
                })}
              </span>
            </div>
          </div>

          <div className="op-divider" />

          {/* SHIPPING */}
          {order.shippingAddress && (
            <div className="op-shipping">
              <p className="op-shipping-title">Shipping to</p>
              <p className="op-shipping-line">
                {order.shippingAddress.street}<br />
                {order.shippingAddress.city}, {order.shippingAddress.country}<br />
                {order.shippingAddress.phone}
              </p>
            </div>
          )}

          {/* CTA */}
          <Link href="/" className="op-cta">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}