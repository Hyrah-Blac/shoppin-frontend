'use client';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap');

  .cart-page * { box-sizing: border-box; margin: 0; padding: 0; }
  .cart-page { font-family: system-ui, sans-serif; background: var(--bg-tertiary); min-height: 100vh; }

  .cart-item {
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 20px;
    padding: 16px;
    display: flex;
    gap: 16px;
    align-items: center;
    transition: box-shadow .2s;
  }
  .cart-item:hover { box-shadow: 0 4px 20px rgba(0,0,0,.08); }

  .cart-qty-btn {
    width: 32px; height: 32px; border-radius: 50%;
    border: 1px solid var(--border-color);
    background: var(--bg-secondary);
    color: var(--text-primary);
    font-size: 16px; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: background .15s, border-color .15s;
  }
  .cart-qty-btn:hover { background: var(--bg-tertiary); border-color: var(--text-tertiary); }

  .cart-remove-btn {
    width: 32px; height: 32px; border-radius: 50%;
    border: none; background: none;
    color: var(--text-tertiary);
    font-size: 20px; line-height: 1;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: color .15s, background .15s;
    flex-shrink: 0;
  }
  .cart-remove-btn:hover { color: var(--accent); background: var(--bg-secondary); }

  .cart-cta {
    width: 100%; height: 52px; border: none; border-radius: 999px;
    background: var(--accent); color: #fff;
    font-size: 16px; font-weight: 700; letter-spacing: .3px;
    cursor: pointer; transition: background .18s, transform .18s, box-shadow .18s;
    box-shadow: 0 4px 18px rgba(230,0,35,.28);
  }
  .cart-cta:hover { background: #ad081b; transform: translateY(-2px); box-shadow: 0 8px 26px rgba(230,0,35,.35); }

  .cart-clear-btn {
    width: 100%; height: 44px; border-radius: 999px;
    border: 1.5px solid var(--border-color);
    background: transparent; color: var(--text-secondary);
    font-size: 14px; font-weight: 600; cursor: pointer;
    transition: border-color .18s, color .18s, background .18s;
  }
  .cart-clear-btn:hover { border-color: var(--text-secondary); color: var(--text-primary); background: var(--bg-secondary); }

  .cart-browse-btn {
    display: inline-block;
    background: var(--accent); color: #fff;
    padding: 14px 32px; border-radius: 999px;
    font-weight: 700; font-size: 15px; text-decoration: none;
    box-shadow: 0 4px 18px rgba(230,0,35,.28);
    transition: background .18s, transform .18s;
  }
  .cart-browse-btn:hover { background: #ad081b; transform: translateY(-2px); }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
  .fu { animation: fadeUp .4s ease both; }
  .fu1 { animation-delay: .04s; }
  .fu2 { animation-delay: .08s; }
  .fu3 { animation-delay: .12s; }
`;

function injectStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('cart-page-styles')) return;
  const s = document.createElement('style');
  s.id = 'cart-page-styles';
  s.textContent = STYLES;
  document.head.appendChild(s);
}

import { useEffect } from 'react';

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

  if (cart.length === 0) return (
    <div className="cart-page">
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '100px 20px', textAlign: 'center',
      }}>
        {/* Empty cart illustration */}
        <div style={{
          width: 96, height: 96, borderRadius: '50%',
          background: 'var(--bg-secondary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 24,
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
        </div>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 26, fontWeight: 900, color: 'var(--text-primary)',
          marginBottom: 10,
        }}>
          Your cart is empty
        </h2>
        <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 32, maxWidth: 280, lineHeight: 1.6 }}>
          Browse products and add something you love
        </p>
        <Link href="/" className="cart-browse-btn">Browse products</Link>
      </div>
    </div>
  );

  return (
    <div className="cart-page">
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '36px 16px 80px' }}>

        {/* HEADER */}
        <div className="fu" style={{ marginBottom: 28 }}>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 30, fontWeight: 900,
            color: 'var(--text-primary)', letterSpacing: '-.3px',
          }}>
            Your Cart
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 6, fontWeight: 500 }}>
            {itemCount} item{itemCount !== 1 ? 's' : ''}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>

          {/* ITEMS LIST */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {cart.map((item, idx) => (
              <div
                key={item._id}
                className="cart-item fu"
                style={{ animationDelay: `${0.05 + idx * 0.04}s` }}
              >
                {/* IMAGE */}
                <div style={{
                  width: 80, height: 80, borderRadius: 14,
                  overflow: 'hidden', flexShrink: 0,
                  background: 'var(--bg-secondary)',
                }}>
                  {item.images?.[0]?.url
                    ? <img src={item.images[0].url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    : <div style={{ width: '100%', height: '100%', background: 'var(--bg-secondary)' }} />
                  }
                </div>

                {/* TITLE + PRICE */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontWeight: 600, fontSize: 14,
                    color: 'var(--text-primary)',
                    marginBottom: 5,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {item.title}
                  </p>
                  <p style={{ color: 'var(--accent)', fontWeight: 700, fontSize: 14 }}>
                    KSh {item.price?.toLocaleString()}
                  </p>
                </div>

                {/* QTY CONTROLS */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                  <button
                    className="cart-qty-btn"
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  >−</button>
                  <span style={{ fontWeight: 700, fontSize: 15, minWidth: 22, textAlign: 'center', color: 'var(--text-primary)' }}>
                    {item.quantity}
                  </span>
                  <button
                    className="cart-qty-btn"
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  >+</button>
                </div>

                {/* LINE TOTAL */}
                <p style={{
                  fontWeight: 700, fontSize: 14,
                  color: 'var(--text-primary)',
                  minWidth: 90, textAlign: 'right', flexShrink: 0,
                }}>
                  KSh {(item.price * item.quantity).toLocaleString()}
                </p>

                {/* REMOVE */}
                <button
                  className="cart-remove-btn"
                  onClick={() => removeFromCart(item._id)}
                  title="Remove item"
                >×</button>
              </div>
            ))}
          </div>

          {/* ORDER SUMMARY */}
          <div
            className="fu fu2"
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: 24, padding: 24,
              position: 'sticky', top: 24,
            }}
          >
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 20, fontWeight: 900,
              color: 'var(--text-primary)', marginBottom: 20,
            }}>
              Order Summary
            </h2>

            {/* LINE ITEMS SUMMARY */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {cart.map((item) => (
                <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)', flex: 1, marginRight: 8, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.title} × {item.quantity}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', flexShrink: 0 }}>
                    KSh {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* DIVIDER */}
            <div style={{ height: 1, background: 'var(--border-color)', marginBottom: 20 }} />

            {/* TOTAL */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24 }}>
              <span style={{ fontSize: 15, color: 'var(--text-secondary)', fontWeight: 500 }}>Total</span>
              <span style={{ fontSize: 26, fontWeight: 900, color: 'var(--accent)', fontFamily: "'Playfair Display', serif" }}>
                KSh {total.toLocaleString()}
              </span>
            </div>

            {/* CHECKOUT */}
            <button className="cart-cta" onClick={handleCheckout}>
              Proceed to Checkout
            </button>

            {/* CLEAR */}
            <button className="cart-clear-btn" onClick={clearCart} style={{ marginTop: 10 }}>
              Clear cart
            </button>

            {/* CONTINUE SHOPPING */}
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <Link href="/" style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500, textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
              >
                ← Continue shopping
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* responsive stacking */}
      <style>{`
        @media (max-width: 700px) {
          .cart-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}