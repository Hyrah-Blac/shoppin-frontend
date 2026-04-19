  'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap');

  .pp * { box-sizing: border-box; margin: 0; padding: 0; }
  .pp {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
    background: var(--bg-tertiary);
    min-height: 100vh;
    color: var(--text-primary);
  }

  /* ── BREADCRUMB ── */
  .pp-crumb {
    max-width: 1100px;
    margin: 0 auto;
    padding: 16px 24px 0;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--text-tertiary);
    flex-wrap: wrap;
  }
  .pp-crumb a {
    color: var(--text-tertiary);
    font-weight: 500;
    text-decoration: none;
    transition: color .15s;
  }
  .pp-crumb a:hover { color: var(--text-primary); }

  /* ── MAIN GRID ── */
  .pp-grid {
    max-width: 1100px;
    margin: 0 auto;
    padding: 24px 24px 60px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 48px;
    align-items: start;
  }

  /* ── IMAGE COLUMN ── */
  .pp-img-col { position: sticky; top: 24px; }

  .pp-main-img {
    border-radius: 24px;
    overflow: hidden;
    position: relative;
    aspect-ratio: 4 / 5;
    background: var(--bg-secondary);
    box-shadow: 0 16px 48px rgba(0,0,0,.13);
  }
  .pp-main-img img {
    width: 100%; height: 100%;
    object-fit: cover; display: block;
    transition: transform .4s ease;
  }
  .pp-main-img:hover img { transform: scale(1.02); }

  .pp-fab-group {
    position: absolute;
    top: 14px; right: 14px;
    display: flex; flex-direction: column; gap: 10px;
  }
  .pp-fab {
    width: 44px; height: 44px;
    border-radius: 50%; border: none;
    background: var(--bg-primary);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 2px 12px rgba(0,0,0,.15);
    cursor: pointer;
    transition: transform .18s, box-shadow .18s;
    -webkit-tap-highlight-color: transparent;
  }
  .pp-fab:hover { transform: scale(1.1); box-shadow: 0 4px 16px rgba(0,0,0,.2); }
  .pp-fab:active { transform: scale(.93); }
  .pp-fab:disabled { opacity: .5; cursor: not-allowed; }

  .pp-badge {
    position: absolute; top: 14px; left: 14px;
    background: var(--accent); color: #fff;
    border-radius: 999px; padding: 5px 12px;
    font-size: 11px; font-weight: 700; letter-spacing: .3px;
  }

  .pp-oos-overlay {
    position: absolute; inset: 0;
    background: rgba(0,0,0,.48);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    display: flex; align-items: center; justify-content: center;
  }
  .pp-oos-label {
    font-family: 'Playfair Display', serif;
    font-size: 20px; font-weight: 900; color: #fff;
    background: rgba(0,0,0,.55);
    padding: 10px 26px; border-radius: 999px;
  }

  /* THUMBNAILS */
  .pp-thumbs {
    display: flex; gap: 8px;
    margin-top: 12px;
    overflow-x: auto;
    padding-bottom: 4px;
    scrollbar-width: none;
  }
  .pp-thumbs::-webkit-scrollbar { display: none; }
  .pp-thumb {
    width: 64px; height: 64px;
    object-fit: cover; border-radius: 12px;
    cursor: pointer; flex-shrink: 0;
    border: 2.5px solid transparent;
    opacity: .55;
    transition: all .18s;
    -webkit-tap-highlight-color: transparent;
  }
  .pp-thumb.active { border-color: var(--accent); opacity: 1; transform: scale(1.05); }
  .pp-thumb:not(.active):hover { opacity: .88; }

  /* ── INFO COLUMN ── */
  .pp-info { display: flex; flex-direction: column; gap: 20px; }

  /* Seller pill */
  .pp-seller {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 8px 14px; border-radius: 999px;
    border: 1px solid var(--border-color);
    text-decoration: none;
    transition: border-color .18s, box-shadow .18s;
    width: fit-content;
  }
  .pp-seller:hover { border-color: var(--text-secondary); box-shadow: 0 2px 10px rgba(0,0,0,.08); }
  .pp-avatar {
    width: 34px; height: 34px; border-radius: 50%;
    background: var(--accent);
    display: flex; align-items: center; justify-content: center;
    font-weight: 800; font-size: 13px; color: #fff;
    overflow: hidden; flex-shrink: 0;
  }
  .pp-avatar img { width: 100%; height: 100%; object-fit: cover; }

  /* Title */
  .pp-title {
    font-family: 'Playfair Display', serif;
    font-size: 30px; font-weight: 900; line-height: 1.2;
    color: var(--text-primary); letter-spacing: -.4px;
  }

  /* Stars */
  .pp-stars { color: #f59e0b; font-size: 14px; letter-spacing: 1px; }

  /* Price block */
  .pp-price-block {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 18px; padding: 18px 20px;
  }
  .pp-price {
    font-size: 36px; font-weight: 900;
    color: var(--accent); line-height: 1;
  }
  .pp-orig {
    font-size: 15px; color: var(--text-tertiary);
    text-decoration: line-through;
  }
  .pp-save {
    background: var(--accent); color: #fff;
    border-radius: 999px; padding: 3px 10px;
    font-size: 11px; font-weight: 700;
  }
  .pp-stock-dot {
    width: 9px; height: 9px;
    border-radius: 50%; flex-shrink: 0;
  }

  /* Tags */
  .pp-tag {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    padding: 4px 12px; border-radius: 999px;
    font-size: 11px; font-weight: 600;
    color: var(--text-secondary);
  }

  /* Qty pill */
  .pp-qty-pill {
    display: flex; align-items: center;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 999px; overflow: hidden; height: 50px;
  }
  .pp-qty-btn {
    width: 50px; height: 50px; border: none; background: none;
    font-size: 20px; font-weight: 700;
    color: var(--text-primary); cursor: pointer;
    transition: background .15s;
    -webkit-tap-highlight-color: transparent;
  }
  .pp-qty-btn:hover { background: var(--bg-tertiary); }
  .pp-qty-btn:active { background: var(--border-color); }
  .pp-qty-num {
    min-width: 40px; text-align: center;
    font-size: 15px; font-weight: 700;
    color: var(--text-primary);
    border-left: 1px solid var(--border-color);
    border-right: 1px solid var(--border-color);
    line-height: 50px; user-select: none;
  }

  /* CTA buttons */
  .pp-cta {
    flex: 1; height: 50px; border: none; border-radius: 999px;
    background: var(--accent); color: #fff;
    font-size: 15px; font-weight: 700; letter-spacing: .3px;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: background .18s, transform .18s, box-shadow .18s;
    box-shadow: 0 4px 18px rgba(230,0,35,.28);
    cursor: pointer; font-family: inherit;
    -webkit-tap-highlight-color: transparent;
  }
  .pp-cta:hover:not(:disabled) { background: #ad081b; transform: translateY(-2px); box-shadow: 0 8px 26px rgba(230,0,35,.35); }
  .pp-cta:active:not(:disabled) { transform: scale(.97); }
  .pp-cta:disabled { background: var(--text-tertiary); box-shadow: none; cursor: not-allowed; }

  .pp-cta-outline {
    width: 100%; padding: 14px;
    border: 1.5px solid var(--border-color);
    border-radius: 999px; background: transparent;
    color: var(--text-primary); font-size: 14px; font-weight: 600;
    cursor: pointer; font-family: inherit;
    transition: border-color .18s, background .18s, color .18s;
    -webkit-tap-highlight-color: transparent;
  }
  .pp-cta-outline:hover { border-color: var(--text-secondary); background: var(--bg-secondary); }
  .pp-cta-outline:active { transform: scale(.98); }
  .pp-cta-outline.wishlisted { border-color: var(--accent); color: var(--accent); }

  /* External link */
  .pp-ext-link {
    display: flex; align-items: center; justify-content: center; gap: 7px;
    padding: 13px; border: 1px solid var(--border-color);
    border-radius: 999px; font-size: 13px; font-weight: 600;
    color: var(--text-secondary); text-decoration: none;
    transition: border-color .18s, color .18s;
    font-family: inherit;
  }
  .pp-ext-link:hover { border-color: var(--text-secondary); color: var(--text-primary); }

  /* Cart confirm toast (inline) */
  .pp-confirm {
    display: flex; align-items: center; gap: 10px;
    background: var(--text-primary); color: var(--bg-primary);
    border-radius: 999px; padding: 12px 18px;
    font-size: 13px; font-weight: 600;
    box-shadow: 0 4px 20px rgba(0,0,0,.18);
    animation: ppFadeUp .3s cubic-bezier(.34,1.56,.64,1) both;
  }

  /* Owner notice */
  .pp-owner {
    padding: 14px 18px; border-radius: 14px;
    background: var(--bg-secondary); border: 1px solid var(--border-color);
    font-size: 13px; color: var(--text-secondary); text-align: center;
  }

  /* OOS notice */
  .pp-oos-notice {
    padding: 14px 20px; border-radius: 14px;
    background: var(--bg-secondary); border: 1px solid var(--border-color);
    text-align: center; font-size: 14px; font-weight: 600;
    color: var(--text-secondary);
  }

  /* ── TABS ── */
  .pp-tabs-bar { border-top: 1px solid var(--border-color); }
  .pp-tabs-inner { max-width: 1100px; margin: 0 auto; padding: 20px 24px 64px; }
  .pp-tab-pills {
    display: flex; gap: 8px; margin-bottom: 28px;
    overflow-x: auto; scrollbar-width: none;
  }
  .pp-tab-pills::-webkit-scrollbar { display: none; }
  .pp-tab-btn {
    padding: 10px 22px; border: none; border-radius: 999px;
    font-size: 13px; font-weight: 600;
    background: var(--bg-secondary); color: var(--text-secondary);
    white-space: nowrap; cursor: pointer; font-family: inherit;
    transition: background .18s, color .18s;
    -webkit-tap-highlight-color: transparent;
  }
  .pp-tab-btn.active { background: var(--text-primary); color: var(--bg-primary); }

  .pp-tab-title {
    font-family: 'Playfair Display', serif;
    font-size: 22px; font-weight: 900;
    color: var(--text-primary); margin-bottom: 18px;
  }
  .pp-tab-body {
    font-size: 15px; line-height: 1.9;
    color: var(--text-secondary);
    white-space: pre-wrap; word-break: break-word;
  }

  /* Feature cards */
  .pp-feat-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 12px; max-width: 860px;
  }
  .pp-feat-card {
    padding: 15px 17px;
    background: var(--bg-secondary);
    border-radius: 14px;
    border-left: 3px solid var(--accent);
  }

  /* Detail table */
  .pp-detail-table {
    border-radius: 16px; overflow: hidden;
    border: 1px solid var(--border-color);
    max-width: 580px;
  }
  .pp-detail-row {
    display: grid; grid-template-columns: 130px 1fr;
    padding: 12px 18px; font-size: 13px;
    border-bottom: 1px solid var(--border-color);
  }
  .pp-detail-row:last-child { border-bottom: none; }
  .pp-detail-row:nth-child(odd)  { background: var(--bg-secondary); }
  .pp-detail-row:nth-child(even) { background: var(--bg-primary); }

  /* ── ANIMATIONS ── */
  @keyframes ppFadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .fu  { animation: ppFadeUp .4s ease both; }
  .fu1 { animation-delay: .05s; }
  .fu2 { animation-delay: .11s; }
  .fu3 { animation-delay: .18s; }
  .fu4 { animation-delay: .25s; }

  @keyframes ppHeartBeat {
    0%   { transform: scale(1); }
    30%  { transform: scale(1.42); }
    60%  { transform: scale(.9); }
    100% { transform: scale(1); }
  }
  .hb { animation: ppHeartBeat .38s ease; }

  @keyframes ppSpin { to { transform: rotate(360deg); } }
  .spin { animation: ppSpin .7s linear infinite; }

  /* ── RESPONSIVE ── */

  /* Tablet */
  @media (max-width: 860px) {
    .pp-grid { gap: 32px; padding: 20px 16px 48px; }
    .pp-title { font-size: 26px; }
    .pp-price { font-size: 30px; }
  }

  /* Mobile — stack layout */
  @media (max-width: 640px) {
    .pp-crumb { padding: 12px 16px 0; }
    .pp-grid {
      grid-template-columns: 1fr;
      gap: 20px;
      padding: 16px 16px 48px;
    }
    /* Un-sticky on mobile — just flows naturally */
    .pp-img-col { position: static; }

    .pp-main-img { border-radius: 18px; aspect-ratio: 1 / 1; }
    .pp-main-img:hover img { transform: none; }

    .pp-fab { width: 40px; height: 40px; }

    .pp-title { font-size: 22px; }
    .pp-price { font-size: 28px; }
    .pp-price-block { padding: 14px 16px; }

    .pp-cta { font-size: 14px; height: 48px; }
    .pp-qty-pill { height: 48px; }
    .pp-qty-btn { width: 46px; height: 48px; }
    .pp-qty-num { line-height: 48px; }

    .pp-tabs-inner { padding: 16px 16px 48px; }
  }

  /* Very small */
  @media (max-width: 360px) {
    .pp-title { font-size: 20px; }
    .pp-price { font-size: 26px; }
    .pp-grid { padding: 12px 12px 40px; }
    .pp-crumb { padding: 10px 12px 0; }
  }

  /* iOS safe area */
  @supports (padding-bottom: env(safe-area-inset-bottom)) {
    .pp-tabs-inner { padding-bottom: calc(64px + env(safe-area-inset-bottom)); }
  }
`;

function injectStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('pp-styles')) return;
  const s = document.createElement('style');
  s.id = 'pp-styles';
  s.textContent = STYLES;
  document.head.appendChild(s);
}

function Stars({ rating, count }) {
  const full = Math.round(rating);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span className="pp-stars">
        {'★'.repeat(full)}{'☆'.repeat(5 - full)}
      </span>
      <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>
        {rating.toFixed(1)} · {count} review{count !== 1 ? 's' : ''}
      </span>
    </div>
  );
}

export default function ProductPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const router = useRouter();

  const [product, setProduct]     = useState(null);
  const [wishlisted, setWishlisted] = useState(false);
  const [activeImg, setActiveImg]   = useState(0);
  const [loading, setLoading]       = useState(true);
  const [quantity, setQuantity]     = useState(1);
  const [adding, setAdding]         = useState(false);
  const [addingCart, setAddingCart] = useState(false);
  const [activeTab, setActiveTab]   = useState('description');
  const [heartAnim, setHeartAnim]   = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [cartCount, setCartCount]   = useState(0);

  useEffect(() => { injectStyles(); }, []);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then((r) => setProduct(r.data))
      .catch(() => router.push('/'))
      .finally(() => setLoading(false));
    if (user) {
      api.get(`/wishlist/check/${id}`)
        .then((r) => setWishlisted(r.data.isWishlisted))
        .catch(() => {});
    }
  }, [id, user, router]);

  const handleWishlist = async () => {
    if (!user) { router.push('/login'); return; }
    setAdding(true);
    setHeartAnim(true);
    setTimeout(() => setHeartAnim(false), 420);
    try {
      if (wishlisted) {
        await api.delete(`/wishlist/${id}`);
        setWishlisted(false);
        addToast('Removed from wishlist', 'info');
      } else {
        await api.post('/wishlist', { productId: id });
        setWishlisted(true);
        addToast('Saved to wishlist!', 'success');
      }
    } catch { addToast('Error updating wishlist', 'error'); }
    finally { setAdding(false); }
  };

  const handleAddToCart = async () => {
    if (product.stock === 0) { addToast('Out of stock', 'error'); return; }
    setAddingCart(true);
    try {
      for (let i = 0; i < quantity; i++) addToCart(product);
      const next = cartCount + quantity;
      setCartCount(next);
      setQuantity(1);
      setShowConfirm(true);
      setTimeout(() => setShowConfirm(false), 3000);
      addToast(`${quantity} item${quantity > 1 ? 's' : ''} added to cart!`, 'success');
    } finally { setAddingCart(false); }
  };

  if (loading) return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '60vh', color: 'var(--text-tertiary)',
      fontFamily: 'system-ui', fontSize: 14,
    }}>
      Loading…
    </div>
  );
  if (!product) return null;

  const isOwner = user && String(user._id) === String(product.user?._id);
  const discount = product.originalPrice && product.price < product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'features',    label: 'Features'     },
    { id: 'details',     label: 'Details'       },
  ];

  const CartSection = () => {
    if (isOwner) return (
      <div className="pp-owner">
        Your listing —{' '}
        <Link href={`/products/edit/${id}`} style={{ color: 'var(--accent)', fontWeight: 700 }}>
          Edit product
        </Link>
      </div>
    );

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {product.stock > 0 ? (
          <>
            {/* QTY + ADD TO CART */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="pp-qty-pill">
                <button className="pp-qty-btn" onClick={() => setQuantity(q => Math.max(1, q - 1))} aria-label="Decrease">−</button>
                <span className="pp-qty-num">{quantity}</span>
                <button className="pp-qty-btn" onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} aria-label="Increase">+</button>
              </div>
              <button className="pp-cta" onClick={handleAddToCart} disabled={addingCart}>
                {addingCart ? (
                  <>
                    <svg className="spin" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                    </svg>
                    Adding…
                  </>
                ) : (
                  <>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                    </svg>
                    Add to Cart
                  </>
                )}
              </button>
            </div>

            {/* INLINE CONFIRM */}
            {showConfirm && (
              <div className="pp-confirm">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {cartCount} item{cartCount !== 1 ? 's' : ''} in your cart
              </div>
            )}

            {/* WISHLIST */}
            <button
              className={`pp-cta-outline${wishlisted ? ' wishlisted' : ''}`}
              onClick={handleWishlist}
              disabled={adding}
            >
              {wishlisted ? '♥ Saved to Wishlist' : '♡ Save to Wishlist'}
            </button>
          </>
        ) : (
          <>
            <div className="pp-oos-notice">Currently out of stock</div>
            <button
              className={`pp-cta-outline${wishlisted ? ' wishlisted' : ''}`}
              onClick={handleWishlist}
              disabled={adding}
            >
              {wishlisted ? "♥ Saved — We'll notify you" : '♡ Notify me when back in stock'}
            </button>
          </>
        )}

        {product.link && (
          <a href={product.link} target="_blank" rel="noopener noreferrer" className="pp-ext-link">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            Visit original listing
          </a>
        )}
      </div>
    );
  };

  return (
    <div className="pp">

      {/* BREADCRUMB */}
      <div className="pp-crumb">
        <Link href="/">Home</Link>
        <span>›</span>
        {product.category && <><span>{product.category}</span><span>›</span></>}
        <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
          {product.title?.slice(0, 44)}{product.title?.length > 44 ? '…' : ''}
        </span>
      </div>

      {/* MAIN GRID */}
      <div className="pp-grid">

        {/* ── LEFT: IMAGES ── */}
        <div className="pp-img-col fu">
          <div className="pp-main-img">
            {product.images?.[activeImg]?.url
              ? <img src={product.images[activeImg].url} alt={product.title} />
              : (
                <div style={{
                  width: '100%', height: '100%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'var(--bg-secondary)', color: 'var(--text-tertiary)', fontSize: 52,
                }}>🖼</div>
              )
            }

            {/* FABs */}
            <div className="pp-fab-group">
              <button
                className={`pp-fab${heartAnim ? ' hb' : ''}`}
                onClick={handleWishlist}
                disabled={adding}
                aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
              >
                <svg width="20" height="20" viewBox="0 0 24 24"
                  fill={wishlisted ? '#e60023' : 'none'}
                  stroke={wishlisted ? '#e60023' : 'var(--text-secondary)'}
                  strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
              <button
                className="pp-fab"
                onClick={() => navigator.share?.({ title: product.title, url: window.location.href })}
                aria-label="Share"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
              </button>
            </div>

            {discount > 0 && <span className="pp-badge">−{discount}%</span>}

            {product.stock === 0 && (
              <div className="pp-oos-overlay">
                <span className="pp-oos-label">Sold Out</span>
              </div>
            )}
          </div>

          {/* THUMBNAILS */}
          {product.images?.length > 1 && (
            <div className="pp-thumbs">
              {product.images.map((img, i) => (
                <img
                  key={i}
                  src={img.url}
                  alt=""
                  onClick={() => setActiveImg(i)}
                  className={`pp-thumb${activeImg === i ? ' active' : ''}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── RIGHT: INFO ── */}
        <div className="pp-info">

          {/* SELLER */}
          {product.user && (
            <div className="fu fu1">
              <Link href="/profile" className="pp-seller">
                <div className="pp-avatar">
                  {product.user.avatar
                    ? <img src={product.user.avatar} alt="" />
                    : product.user.name?.[0]?.toUpperCase()
                  }
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                    {product.user.name}
                  </p>
                  <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 1 }}>
                    View profile →
                  </p>
                </div>
              </Link>
            </div>
          )}

          {/* TITLE */}
          <h1 className="pp-title fu fu1">{product.title}</h1>

          {/* RATING */}
          {product.averageRating > 0 && (
            <div className="fu fu2">
              <Stars rating={product.averageRating} count={product.reviewCount} />
            </div>
          )}

          {/* PRICE */}
          <div className="pp-price-block fu fu2">
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
              <span className="pp-price">KSh {product.price?.toLocaleString()}</span>
              {discount > 0 && (
                <>
                  <span className="pp-orig">KSh {product.originalPrice?.toLocaleString()}</span>
                  <span className="pp-save">Save {discount}%</span>
                </>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                className="pp-stock-dot"
                style={{
                  background: product.stock > 0 ? '#00875a' : 'var(--accent)',
                  boxShadow: product.stock > 0
                    ? '0 0 0 3px rgba(0,135,90,.15)'
                    : '0 0 0 3px rgba(230,0,35,.15)',
                }}
              />
              <span style={{
                fontSize: 13, fontWeight: 600,
                color: product.stock > 0 ? '#00875a' : 'var(--accent)',
              }}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>
          </div>

          {/* TAGS */}
          {product.tags?.length > 0 && (
            <div className="fu fu2" style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {product.tags.map((t) => (
                <span key={t} className="pp-tag">#{t}</span>
              ))}
            </div>
          )}

          {/* SHORT DESC */}
          {product.description && (
            <p className="fu fu3" style={{
              fontSize: 14, lineHeight: 1.75, color: 'var(--text-secondary)',
              display: '-webkit-box', WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
              {product.description}
            </p>
          )}

          {/* CART */}
          <div className="fu fu4"><CartSection /></div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="pp-tabs-bar">
        <div className="pp-tabs-inner">
          <div className="pp-tab-pills">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`pp-tab-btn${activeTab === tab.id ? ' active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* DESCRIPTION */}
          {activeTab === 'description' && (
            <div style={{ maxWidth: 780 }}>
              <h2 className="pp-tab-title">About this product</h2>
              <p className="pp-tab-body">
                {product.description || 'No description provided.'}
              </p>
            </div>
          )}

          {/* FEATURES */}
          {activeTab === 'features' && (
            <div>
              <h2 className="pp-tab-title">Features &amp; Specifications</h2>
              {product.features?.length > 0 ? (
                <div className="pp-feat-grid">
                  {product.features.map((f, i) => (
                    <div key={i} className="pp-feat-card">
                      <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: typeof f === 'object' && f.value ? 5 : 0 }}>
                        {typeof f === 'string' ? f : f.name}
                      </p>
                      {typeof f === 'object' && f.value && (
                        <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>{f.value}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: 15, color: 'var(--text-secondary)' }}>No features specified.</p>
              )}
            </div>
          )}

          {/* DETAILS */}
          {activeTab === 'details' && (
            <div>
              <h2 className="pp-tab-title">Product Details</h2>
              <div className="pp-detail-table">
                {[
                  { label: 'Title',          value: product.title },
                  { label: 'Price',          value: `KSh ${product.price?.toLocaleString()}`, accent: true },
                  product.originalPrice && { label: 'Original Price', value: `KSh ${product.originalPrice?.toLocaleString()}`, strike: true },
                  { label: 'Availability',   value: product.stock > 0 ? `${product.stock} units in stock` : 'Out of stock', green: product.stock > 0, red: product.stock === 0 },
                  { label: 'Seller',         value: product.user?.name },
                  product.category && { label: 'Category', value: product.category },
                  { label: 'Listed on',      value: new Date(product.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
                ].filter(Boolean).map((row, i) => (
                  <div key={i} className="pp-detail-row">
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{row.label}</span>
                    <span style={{
                      color: row.accent ? 'var(--accent)' : row.green ? '#00875a' : row.red ? 'var(--accent)' : 'var(--text-secondary)',
                      fontWeight: row.accent ? 700 : 400,
                      textDecoration: row.strike ? 'line-through' : 'none',
                    }}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}