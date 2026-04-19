'use client';
import { useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap');

  .cp * { box-sizing: border-box; margin: 0; padding: 0; }
  .cp {
    font-family: system-ui, -apple-system, sans-serif;
    background: var(--bg-tertiary);
    min-height: 100vh;
    color: var(--text-primary);
  }

  /* ── HEADER ── */
  .cp-header {
    position: sticky;
    top: 0;
    z-index: 10;
    background: var(--bg-primary);
    border-bottom: 1px solid var(--border-color);
    padding: 0 16px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .cp-header-title {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    font-weight: 900;
    color: var(--text-primary);
    letter-spacing: -.3px;
  }
  .cp-header-count {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-secondary);
  }

  /* ── LAYOUT ── */
  .cp-body {
    max-width: 1000px;
    margin: 0 auto;
    padding: 24px 16px 60px;
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 20px;
    align-items: start;
  }

  /* ── ITEM CARD ── */
  .cp-item {
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 20px;
    padding: 14px;
    display: grid;
    grid-template-columns: 72px 1fr auto;
    gap: 12px;
    align-items: center;
    transition: box-shadow .2s;
  }
  .cp-item:hover { box-shadow: 0 4px 20px rgba(0,0,0,.07); }

  .cp-item-img {
    width: 72px;
    height: 72px;
    border-radius: 14px;
    object-fit: cover;
    display: block;
    background: var(--bg-secondary);
    flex-shrink: 0;
  }

  .cp-item-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 3px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .cp-item-price {
    font-size: 13px;
    font-weight: 700;
    color: var(--accent);
  }

  .cp-item-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 10px;
    flex-shrink: 0;
  }
  .cp-item-total {
    font-size: 14px;
    font-weight: 700;
    color: var(--text-primary);
  }

  /* QTY PILL */
  .cp-qty {
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 999px;
    padding: 4px 6px;
  }
  .cp-qty-btn {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: none;
    background: var(--bg-primary);
    color: var(--text-primary);
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background .15s;
    flex-shrink: 0;
  }
  .cp-qty-btn:hover { background: var(--bg-tertiary); }
  .cp-qty-num {
    font-size: 14px;
    font-weight: 700;
    color: var(--text-primary);
    min-width: 20px;
    text-align: center;
  }

  /* REMOVE */
  .cp-remove {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: none;
    background: none;
    color: var(--text-tertiary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color .15s, background .15s;
  }
  .cp-remove:hover { color: var(--accent); background: var(--bg-secondary); }

  /* ── SUMMARY PANEL ── */
  .cp-summary {
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 24px;
    padding: 22px;
    position: sticky;
    top: 76px;
  }
  .cp-summary-title {
    font-family: 'Playfair Display', serif;
    font-size: 18px;
    font-weight: 900;
    color: var(--text-primary);
    margin-bottom: 18px;
  }
  .cp-summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    color: var(--text-secondary);
    margin-bottom: 8px;
  }
  .cp-summary-row span:last-child { color: var(--text-primary); font-weight: 600; }
  .cp-divider { height: 1px; background: var(--border-color); margin: 14px 0; }
  .cp-total-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 20px;
  }
  .cp-total-label { font-size: 15px; font-weight: 600; color: var(--text-secondary); }
  .cp-total-amount {
    font-family: 'Playfair Display', serif;
    font-size: 26px;
    font-weight: 900;
    color: var(--accent);
  }

  /* BUTTONS */
  .cp-cta {
    width: 100%;
    height: 50px;
    border: none;
    border-radius: 999px;
    background: var(--accent);
    color: #fff;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: .3px;
    cursor: pointer;
    box-shadow: 0 4px 18px rgba(230,0,35,.25);
    transition: background .18s, transform .18s, box-shadow .18s;
  }
  .cp-cta:hover {
    background: #ad081b;
    transform: translateY(-2px);
    box-shadow: 0 8px 26px rgba(230,0,35,.33);
  }

  .cp-clear {
    width: 100%;
    height: 42px;
    margin-top: 10px;
    border-radius: 999px;
    border: 1.5px solid var(--border-color);
    background: transparent;
    color: var(--text-secondary);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: border-color .18s, color .18s, background .18s;
  }
  .cp-clear:hover {
    border-color: var(--text-secondary);
    color: var(--text-primary);
    background: var(--bg-secondary);
  }

  .cp-continue {
    display: block;
    text-align: center;
    margin-top: 14px;
    font-size: 13px;
    font-weight: 500;
    color: var(--text-secondary);
    text-decoration: none;
    transition: color .15s;
  }
  .cp-continue:hover { color: var(--text-primary); }

  /* ── MOBILE BOTTOM BAR ── */
  /* No bottom nav anymore — sits flush at screen bottom with safe area */
  .cp-mobile-bar {
    display: none;
    position: fixed;
    bottom: 0; left: 0; right: 0;
    background: var(--bg-primary);
    border-top: 1px solid var(--border-color);
    padding: 12px 16px env(safe-area-inset-bottom, 16px);
    z-index: 20;
  }
  .cp-mobile-bar-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  .cp-mobile-total-label { font-size: 13px; color: var(--text-secondary); font-weight: 500; }
  .cp-mobile-total {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    font-weight: 900;
    color: var(--accent);
  }

  /* ── EMPTY STATE ── */
  .cp-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 100px 20px;
    text-align: center;
  }
  .cp-empty-icon {
    width: 88px;
    height: 88px;
    border-radius: 50%;
    background: var(--bg-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 22px;
  }
  .cp-empty-title {
    font-family: 'Playfair Display', serif;
    font-size: 24px;
    font-weight: 900;
    color: var(--text-primary);
    margin-bottom: 10px;
  }
  .cp-empty-sub {
    font-size: 15px;
    color: var(--text-secondary);
    margin-bottom: 28px;
    max-width: 260px;
    line-height: 1.6;
  }
  .cp-browse {
    display: inline-block;
    background: var(--accent);
    color: #fff;
    padding: 14px 32px;
    border-radius: 999px;
    font-weight: 700;
    font-size: 15px;
    text-decoration: none;
    box-shadow: 0 4px 18px rgba(230,0,35,.25);
    transition: background .18s, transform .18s;
  }
  .cp-browse:hover { background: #ad081b; transform: translateY(-2px); }

  /* ── ANIMATIONS ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .fu { animation: fadeUp .38s ease both; }

  /* ── RESPONSIVE ── */

  /* Tablet */
  @media (max-width: 800px) {
    .cp-body {
      grid-template-columns: 1fr 260px;
      gap: 16px;
      padding: 20px 12px 40px;
    }
  }

  /* Mobile — single column, hide sidebar, show bottom bar */
  @media (max-width: 640px) {
    .cp-body {
      grid-template-columns: 1fr;
      /* enough room for the fixed bottom bar (~120px) */
      padding: 16px 12px 130px;
      gap: 10px;
    }
    .cp-summary { display: none; }
    .cp-mobile-bar { display: block; }

    .cp-item {
      grid-template-columns: 64px 1fr;
      grid-template-rows: auto auto;
      border-radius: 16px;
      padding: 12px;
      gap: 10px;
    }
    .cp-item-img { width: 64px; height: 64px; border-radius: 12px; }
    .cp-item-right {
      grid-column: 1 / -1;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid var(--border-color);
      padding-top: 10px;
      margin-top: 2px;
    }
  }

  /* Very small screens */
  @media (max-width: 360px) {
    .cp-header-title { font-size: 18px; }
    .cp-item { padding: 10px; }
  }
`;

function injectStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('cp-styles')) return;
  const s = document.createElement('style');
  s.id = 'cp-styles';
  s.textContent = STYLES;
  document.head.appendChild(s);
}

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, total, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => { injectStyles(); }, []);

  const handleCheckout = () => {
    if (!user) { router.push('/login'); return; }
    router.push('/orders/new');
  };

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  /* ── EMPTY STATE ── */
  if (cart.length === 0) return (
    <div className="cp">
      <div className="cp-empty">
        <div className="cp-empty-icon">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
            stroke="var(--text-tertiary)" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
        </div>
        <h2 className="cp-empty-title">Your cart is empty</h2>
        <p className="cp-empty-sub">Browse products and add something you love</p>
        <Link href="/" className="cp-browse">Browse products</Link>
      </div>
    </div>
  );

  return (
    <div className="cp">

      {/* ── STICKY HEADER ── */}
      <div className="cp-header">
        <span className="cp-header-title">Cart</span>
        <span className="cp-header-count">{itemCount} item{itemCount !== 1 ? 's' : ''}</span>
      </div>

      <div className="cp-body">

        {/* ── ITEMS ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {cart.map((item, idx) => (
            <div
              key={item._id}
              className="cp-item fu"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              {/* IMAGE */}
              {item.images?.[0]?.url
                ? <img className="cp-item-img" src={item.images[0].url} alt={item.title} />
                : <div className="cp-item-img" />
              }

              {/* INFO */}
              <div style={{ minWidth: 0 }}>
                <p className="cp-item-title">{item.title}</p>
                <p className="cp-item-price">KSh {item.price?.toLocaleString()}</p>
              </div>

              {/* RIGHT: qty + total + remove */}
              <div className="cp-item-right">
                <p className="cp-item-total">
                  KSh {(item.price * item.quantity).toLocaleString()}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div className="cp-qty">
                    <button
                      className="cp-qty-btn"
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      aria-label="Decrease"
                    >−</button>
                    <span className="cp-qty-num">{item.quantity}</span>
                    <button
                      className="cp-qty-btn"
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      aria-label="Increase"
                    >+</button>
                  </div>
                  <button
                    className="cp-remove"
                    onClick={() => removeFromCart(item._id)}
                    aria-label="Remove item"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── DESKTOP SUMMARY ── */}
        <div className="cp-summary fu" style={{ animationDelay: '.1s' }}>
          <p className="cp-summary-title">Order Summary</p>

          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 4 }}>
            {cart.map((item) => (
              <div key={item._id} className="cp-summary-row">
                <span style={{
                  overflow: 'hidden', textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap', maxWidth: 150,
                }}>
                  {item.title} ×{item.quantity}
                </span>
                <span>KSh {(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="cp-divider" />

          <div className="cp-total-row">
            <span className="cp-total-label">Total</span>
            <span className="cp-total-amount">KSh {total.toLocaleString()}</span>
          </div>

          <button className="cp-cta" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
          <button className="cp-clear" onClick={clearCart}>
            Clear cart
          </button>
          <Link href="/" className="cp-continue">← Continue shopping</Link>
        </div>
      </div>

      {/* ── MOBILE BOTTOM BAR ── */}
      <div className="cp-mobile-bar">
        <div className="cp-mobile-bar-inner">
          <div>
            <p className="cp-mobile-total-label">Total</p>
            <p className="cp-mobile-total">KSh {total.toLocaleString()}</p>
          </div>
          <button
            onClick={clearCart}
            style={{
              border: 'none', background: 'none',
              fontSize: 13, fontWeight: 600,
              color: 'var(--text-tertiary)', cursor: 'pointer',
              padding: '6px 10px',
            }}
          >
            Clear
          </button>
        </div>
        <button className="cp-cta" onClick={handleCheckout}>
          Proceed to Checkout
        </button>
      </div>

    </div>
  );
}