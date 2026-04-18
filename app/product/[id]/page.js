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

  .pin-page * { box-sizing: border-box; margin: 0; padding: 0; }
  .pin-page { font-family: system-ui, sans-serif; background: var(--bg-tertiary); }

  .pin-fab {
    width: 44px; height: 44px; border-radius: 50%; border: none;
    background: var(--bg-primary); display: flex; align-items: center;
    justify-content: center; box-shadow: 0 2px 10px rgba(0,0,0,.18);
    transition: transform .18s; cursor: pointer;
  }
  .pin-fab:hover { transform: scale(1.1); }

  .pin-badge {
    display: inline-flex; align-items: center;
    background: var(--accent); color: #fff;
    border-radius: 999px; padding: 4px 11px;
    font-size: 11px; font-weight: 700; letter-spacing: .3px;
  }

  .pin-seller-pill {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 9px 14px; border-radius: 999px;
    border: 1px solid var(--border-color);
    transition: border-color .2s, box-shadow .2s; width: fit-content;
  }
  .pin-seller-pill:hover { border-color: var(--text-secondary); box-shadow: 0 2px 8px rgba(0,0,0,.1); }

  .pin-thumb {
    width: 66px; height: 66px; object-fit: cover;
    border-radius: 12px; cursor: pointer; flex-shrink: 0;
    border: 2.5px solid transparent; opacity: .55; transition: all .18s;
  }
  .pin-thumb.active { border-color: var(--accent); opacity: 1; transform: scale(1.04); }
  .pin-thumb:not(.active):hover { opacity: .9; }

  .pin-qty-pill {
    display: flex; align-items: center;
    background: var(--bg-secondary); border: 1px solid var(--border-color);
    border-radius: 999px; overflow: hidden; height: 50px;
  }
  .pin-qty-btn {
    width: 48px; height: 50px; border: none; background: none;
    font-size: 20px; font-weight: 700; color: var(--text-primary);
    cursor: pointer; transition: background .15s;
  }
  .pin-qty-btn:hover { background: var(--bg-tertiary); }

  .pin-cta {
    flex: 1; height: 50px; border: none; border-radius: 999px;
    background: var(--accent); color: #fff;
    font-size: 15px; font-weight: 700; letter-spacing: .3px;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: background .18s, transform .18s, box-shadow .18s;
    box-shadow: 0 4px 18px rgba(230,0,35,.28); cursor: pointer;
  }
  .pin-cta:hover:not(:disabled) { background: #ad081b; transform: translateY(-2px); box-shadow: 0 8px 26px rgba(230,0,35,.35); }
  .pin-cta:disabled { background: var(--text-tertiary); box-shadow: none; cursor: not-allowed; }

  .pin-cta-outline {
    width: 100%; padding: 14px; border: 1.5px solid var(--border-color);
    border-radius: 999px; background: transparent; color: var(--text-primary);
    font-size: 14px; font-weight: 600; cursor: pointer;
    transition: border-color .18s, background .18s;
  }
  .pin-cta-outline:hover { border-color: var(--text-secondary); background: var(--bg-secondary); }
  .pin-cta-outline.wishlisted { border-color: var(--accent); color: var(--accent); }

  .pin-ext-link {
    display: flex; align-items: center; justify-content: center; gap: 7px;
    padding: 13px; border: 1px solid var(--border-color);
    border-radius: 999px; font-size: 13px; font-weight: 600;
    color: var(--text-secondary); text-decoration: none;
    transition: border-color .18s, color .18s;
  }
  .pin-ext-link:hover { border-color: var(--text-secondary); color: var(--text-primary); }

  .pin-tab-btn {
    padding: 11px 22px; border: none; border-radius: 999px;
    font-size: 13px; font-weight: 600;
    background: var(--bg-secondary); color: var(--text-secondary);
    transition: background .18s, color .18s; white-space: nowrap; cursor: pointer;
  }
  .pin-tab-btn.active { background: var(--text-primary); color: var(--bg-primary); }

  .pin-feat-card {
    padding: 16px 18px; background: var(--bg-secondary);
    border-radius: 14px; border-left: 3px solid var(--accent);
  }

  .pin-detail-row {
    display: grid; grid-template-columns: 140px 1fr;
    padding: 13px 18px; font-size: 13px;
    border-bottom: 1px solid var(--border-color);
  }
  .pin-detail-row:last-child { border-bottom: none; }
  .pin-detail-row:nth-child(odd) { background: var(--bg-secondary); }
  .pin-detail-row:nth-child(even) { background: var(--bg-primary); }

  .pin-toast {
    align-items: center; gap: 10px;
    background: var(--bg-secondary); border: 1px solid var(--border-color);
    border-radius: 14px; padding: 14px 18px;
    font-size: 13px; font-weight: 600; color: var(--text-primary);
  }

  .pin-owner-notice {
    padding: 14px 18px; border-radius: 14px;
    background: var(--bg-secondary); border: 1px solid var(--border-color);
    font-size: 13px; color: var(--text-secondary); text-align: center;
  }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  .fu  { animation: fadeUp .42s ease both; }
  .fu1 { animation-delay: .05s; }
  .fu2 { animation-delay: .12s; }
  .fu3 { animation-delay: .20s; }
  .fu4 { animation-delay: .28s; }

  @keyframes heartBeat { 0%{transform:scale(1);} 30%{transform:scale(1.4);} 60%{transform:scale(.92);} 100%{transform:scale(1);} }
  .hb { animation: heartBeat .38s ease; }

  @keyframes spin { to { transform: rotate(360deg); } }
  .spin-anim { animation: spin .7s linear infinite; }

  @media (max-width: 680px) {
    .pin-grid { grid-template-columns: 1fr !important; gap: 28px !important; }
  }
`;

function injectStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('pin-product-styles')) return;
  const s = document.createElement('style');
  s.id = 'pin-product-styles';
  s.textContent = STYLES;
  document.head.appendChild(s);
}

function Stars({ rating, count }) {
  const full = Math.round(rating);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ color: '#f59e0b', fontSize: 14, letterSpacing: 1 }}>
        {'★'.repeat(full)}{'☆'.repeat(5 - full)}
      </span>
      <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>
        {rating.toFixed(1)} · {count} reviews
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

  const [product, setProduct] = useState(null);
  const [wishlisted, setWishlisted] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [addingCart, setAddingCart] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [heartAnim, setHeartAnim] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [cartCount, setCartCount] = useState(0);

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
      const newCount = cartCount + quantity;
      setCartCount(newCount);
      setQuantity(1);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      addToast(`${quantity} item${quantity > 1 ? 's' : ''} added to cart!`, 'success');
    } finally {
      setAddingCart(false);
    }
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: 80, color: 'var(--text-secondary)', fontFamily: 'system-ui' }}>
      Loading…
    </div>
  );
  if (!product) return null;

  // Compare as strings to handle ObjectId vs string mismatch
  const isOwner = user && String(user._id) === String(product.user?._id);

  const discount = product.originalPrice && product.price < product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'features',    label: 'Features'     },
    { id: 'details',     label: 'Details'       },
  ];

  // Cart section rendered separately for clarity
  const CartSection = () => {
    if (isOwner) {
      return (
        <div className="pin-owner-notice">
          This is your listing — <Link href={`/products/edit/${id}`} style={{ color: 'var(--accent)', fontWeight: 700 }}>Edit product</Link>
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {product.stock > 0 ? (
          <>
            {/* QTY + ADD TO CART */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="pin-qty-pill">
                <button
                  className="pin-qty-btn"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                >−</button>
                <span style={{
                  minWidth: 42, textAlign: 'center', fontSize: 15,
                  fontWeight: 700, color: 'var(--text-primary)',
                  borderLeft: '1px solid var(--border-color)',
                  borderRight: '1px solid var(--border-color)',
                  lineHeight: '50px',
                }}>
                  {quantity}
                </span>
                <button
                  className="pin-qty-btn"
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                >+</button>
              </div>

              <button
                className="pin-cta"
                onClick={handleAddToCart}
                disabled={addingCart}
              >
                {addingCart ? (
                  <>
                    <svg className="spin-anim" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                    </svg>
                    Adding…
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                    </svg>
                    Add to Cart
                  </>
                )}
              </button>
            </div>

            {/* TOAST CONFIRMATION */}
            {showToast && (
              <div className="pin-toast" style={{ display: 'flex' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00875a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {cartCount} item{cartCount !== 1 ? 's' : ''} in your cart
              </div>
            )}

            {/* SAVE TO WISHLIST */}
            <button
              className={`pin-cta-outline${wishlisted ? ' wishlisted' : ''}`}
              onClick={handleWishlist}
              disabled={adding}
            >
              {wishlisted ? '♥ Saved to Wishlist' : '♡ Save to Wishlist'}
            </button>
          </>
        ) : (
          /* OUT OF STOCK STATE */
          <>
            <div style={{
              padding: '16px 20px', borderRadius: 14,
              background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
              textAlign: 'center', fontSize: 14, fontWeight: 600,
              color: 'var(--text-secondary)',
            }}>
              Currently out of stock
            </div>
            <button
              className={`pin-cta-outline${wishlisted ? ' wishlisted' : ''}`}
              onClick={handleWishlist}
              disabled={adding}
            >
              {wishlisted ? '♥ Saved — We\'ll notify you' : '♡ Notify me when back in stock'}
            </button>
          </>
        )}

        {/* EXTERNAL LINK */}
        {product.link && (
          <a href={product.link} target="_blank" rel="noopener noreferrer" className="pin-ext-link">
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
    <div className="pin-page">

      {/* BREADCRUMB */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '20px 24px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-tertiary)' }}>
          <Link href="/" style={{ fontWeight: 500, color: 'var(--text-tertiary)' }}>Home</Link>
          <span>›</span>
          {product.category && <><span>{product.category}</span><span>›</span></>}
          <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
            {product.title?.slice(0, 48)}{product.title?.length > 48 ? '…' : ''}
          </span>
        </div>
      </div>

      {/* MAIN GRID */}
      <div
        className="pin-grid"
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '28px 24px 60px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 56,
          alignItems: 'start',
        }}
      >

        {/* LEFT — IMAGES */}
        <div className="fu" style={{ position: 'sticky', top: 24 }}>
          <div style={{
            borderRadius: 24, overflow: 'hidden', position: 'relative',
            aspectRatio: '4/5', background: 'var(--bg-secondary)',
            boxShadow: '0 20px 60px rgba(0,0,0,.15)',
          }}>
            {product.images?.[activeImg]?.url
              ? <img src={product.images[activeImg].url} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              : (
                <div style={{
                  width: '100%', height: '100%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'var(--bg-secondary)', color: 'var(--text-tertiary)',
                  fontSize: 48,
                }}>
                  🖼
                </div>
              )
            }

            {/* FABs */}
            <div style={{ position: 'absolute', top: 14, right: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                className={`pin-fab${heartAnim ? ' hb' : ''}`}
                onClick={handleWishlist}
                disabled={adding}
                style={{ opacity: adding ? .6 : 1 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24"
                  fill={wishlisted ? '#e60023' : 'none'}
                  stroke={wishlisted ? '#e60023' : 'var(--text-secondary)'}
                  strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
              <button
                className="pin-fab"
                onClick={() => navigator.share?.({ title: product.title, url: window.location.href })}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
              </button>
            </div>

            {discount > 0 && (
              <div style={{ position: 'absolute', top: 14, left: 14 }}>
                <span className="pin-badge">−{discount}%</span>
              </div>
            )}

            {product.stock === 0 && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: '#fff', background: 'rgba(0,0,0,.6)', padding: '10px 24px', borderRadius: 999 }}>
                  Sold Out
                </span>
              </div>
            )}
          </div>

          {product.images?.length > 1 && (
            <div style={{ display: 'flex', gap: 8, marginTop: 12, overflowX: 'auto', paddingBottom: 4 }}>
              {product.images.map((img, i) => (
                <img
                  key={i}
                  src={img.url}
                  alt=""
                  onClick={() => setActiveImg(i)}
                  className={`pin-thumb${activeImg === i ? ' active' : ''}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT — INFO */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

          {product.user && (
            <div className="fu fu1">
              <Link href="/profile" style={{ textDecoration: 'none' }}>
                <div className="pin-seller-pill">
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: 'var(--accent)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: 14, color: '#fff',
                    overflow: 'hidden', flexShrink: 0,
                  }}>
                    {product.user.avatar
                      ? <img src={product.user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : product.user.name?.[0]?.toUpperCase()
                    }
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{product.user.name}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 1 }}>View profile →</p>
                  </div>
                </div>
              </Link>
            </div>
          )}

          <h1 className="fu fu1" style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 32, fontWeight: 900, lineHeight: 1.2,
            color: 'var(--text-primary)', letterSpacing: '-.4px',
          }}>
            {product.title}
          </h1>

          {product.averageRating > 0 && (
            <div className="fu fu2">
              <Stars rating={product.averageRating} count={product.reviewCount} />
            </div>
          )}

          <div className="fu fu2" style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 18, padding: '20px 22px',
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
              <span style={{ fontSize: 38, fontWeight: 900, color: 'var(--accent)', lineHeight: 1 }}>
                KSh {product.price?.toLocaleString()}
              </span>
              {discount > 0 && (
                <>
                  <span style={{ fontSize: 16, color: 'var(--text-tertiary)', textDecoration: 'line-through' }}>
                    KSh {product.originalPrice?.toLocaleString()}
                  </span>
                  <span className="pin-badge">Save {discount}%</span>
                </>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                width: 9, height: 9, borderRadius: '50%', flexShrink: 0,
                background: product.stock > 0 ? '#00875a' : 'var(--accent)',
                boxShadow: product.stock > 0 ? '0 0 0 3px rgba(0,135,90,.15)' : '0 0 0 3px rgba(230,0,35,.15)',
              }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: product.stock > 0 ? '#00875a' : 'var(--accent)' }}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>
          </div>

          {product.tags?.length > 0 && (
            <div className="fu fu2" style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {product.tags.map((t) => (
                <span key={t} style={{
                  background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
                  padding: '4px 12px', borderRadius: 999,
                  fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)',
                }}>
                  #{t}
                </span>
              ))}
            </div>
          )}

          {product.description && (
            <p className="fu fu3" style={{
              fontSize: 14, lineHeight: 1.75, color: 'var(--text-secondary)',
              display: '-webkit-box', WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
              {product.description}
            </p>
          )}

          {/* CART SECTION — always rendered, handles owner/non-owner/stock inside */}
          <div className="fu fu4">
            <CartSection />
          </div>

        </div>
      </div>

      {/* TABS */}
      <div style={{ borderTop: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 24px 64px' }}>

          <div style={{ display: 'flex', gap: 8, marginBottom: 32, overflowX: 'auto' }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`pin-tab-btn${activeTab === tab.id ? ' active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'description' && (
            <div style={{ maxWidth: 780 }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 18 }}>
                About this product
              </h2>
              <p style={{ fontSize: 15, lineHeight: 1.9, color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {product.description || 'No description provided.'}
              </p>
            </div>
          )}

          {activeTab === 'features' && (
            <div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 22 }}>
                Features &amp; Specifications
              </h2>
              {product.features?.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12, maxWidth: 860 }}>
                  {product.features.map((f, i) => (
                    <div key={i} className="pin-feat-card">
                      <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: typeof f === 'object' && f.value ? 6 : 0 }}>
                        {typeof f === 'string' ? f : f.name}
                      </p>
                      {typeof f === 'object' && f.value && (
                        <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{f.value}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: 15, color: 'var(--text-secondary)' }}>No features specified.</p>
              )}
            </div>
          )}

          {activeTab === 'details' && (
            <div style={{ maxWidth: 600 }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 22 }}>
                Product Details
              </h2>
              <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                {[
                  { label: 'Title',         value: product.title },
                  { label: 'Price',         value: `KSh ${product.price?.toLocaleString()}`, accent: true },
                  product.originalPrice && { label: 'Original Price', value: `KSh ${product.originalPrice?.toLocaleString()}`, strike: true },
                  { label: 'Availability',  value: product.stock > 0 ? `${product.stock} units in stock` : 'Out of stock', green: product.stock > 0, red: product.stock === 0 },
                  { label: 'Seller',        value: product.user?.name },
                  product.category && { label: 'Category', value: product.category },
                  { label: 'Listed on',     value: new Date(product.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
                ].filter(Boolean).map((row, i) => (
                  <div key={i} className="pin-detail-row">
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