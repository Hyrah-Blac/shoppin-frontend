'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Masonry from 'react-masonry-css';
import ProductCard from '@/components/ProductCard';
import api from '@/lib/api';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { useToast } from '@/context/ToastContext';

const breakpoints = { default: 4, 1100: 3, 700: 2, 480: 2 };

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap');

  .pf * { box-sizing: border-box; margin: 0; padding: 0; }
  .pf {
    min-height: 100vh;
    background: var(--bg-tertiary);
    font-family: system-ui, -apple-system, sans-serif;
    color: var(--text-primary);
  }

  /* ── HERO ── */
  .pf-hero {
    background: var(--bg-primary);
    border-bottom: 1px solid var(--border-color);
    padding: 40px 20px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .pf-hero-inner { max-width: 560px; width: 100%; margin: 0 auto; position: relative; }

  /* SETTINGS */
  .pf-settings {
    position: absolute;
    top: 0; right: 0;
    width: 40px; height: 40px;
    border-radius: 50%;
    background: var(--bg-secondary);
    border: none;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: var(--text-secondary);
    text-decoration: none;
    transition: background .18s, color .18s;
    -webkit-tap-highlight-color: transparent;
  }
  .pf-settings:hover { background: var(--border-color); color: var(--text-primary); }

  /* AVATAR */
  .pf-avatar-wrap {
    position: relative;
    display: inline-block;
    margin-bottom: 16px;
    cursor: pointer;
  }
  .pf-avatar {
    width: 108px; height: 108px;
    border-radius: 50%;
    background: var(--accent);
    display: flex; align-items: center; justify-content: center;
    font-size: 42px; font-weight: 900; color: #fff;
    overflow: hidden;
    border: 4px solid var(--bg-primary);
    box-shadow: 0 4px 20px rgba(0,0,0,.12);
    transition: opacity .2s;
  }
  .pf-avatar img { width: 100%; height: 100%; object-fit: cover; }
  .pf-avatar-overlay {
    position: absolute; inset: 0;
    border-radius: 50%;
    background: rgba(0,0,0,.38);
    display: flex; align-items: center; justify-content: center;
    opacity: 0; transition: opacity .18s;
  }
  .pf-avatar-wrap:hover .pf-avatar-overlay { opacity: 1; }
  .pf-avatar-cam {
    position: absolute; bottom: 4px; right: 4px;
    width: 30px; height: 30px; border-radius: 50%;
    background: var(--text-primary);
    border: 2.5px solid var(--bg-primary);
    display: flex; align-items: center; justify-content: center;
  }

  /* NAME */
  .pf-name {
    font-family: 'Playfair Display', serif;
    font-size: 26px; font-weight: 900;
    color: var(--text-primary); letter-spacing: -.4px;
    margin-bottom: 4px;
  }
  .pf-email {
    font-size: 13px; color: var(--text-secondary);
    margin-bottom: 12px;
  }

  /* ADMIN BADGE */
  .pf-admin-badge {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 10px; font-weight: 800; letter-spacing: .8px;
    background: rgba(230,0,35,.1); color: var(--accent);
    padding: 3px 10px; border-radius: 999px;
    margin-bottom: 16px;
  }

  /* STATS ROW */
  .pf-stats {
    display: flex; justify-content: center;
    gap: 0; margin-bottom: 24px;
    border: 1px solid var(--border-color);
    border-radius: 16px; overflow: hidden;
    background: var(--bg-secondary);
  }
  .pf-stat {
    flex: 1; padding: 14px 8px; text-align: center;
    border-right: 1px solid var(--border-color);
  }
  .pf-stat:last-child { border-right: none; }
  .pf-stat-num {
    font-family: 'Playfair Display', serif;
    font-size: 20px; font-weight: 900;
    color: var(--text-primary); line-height: 1;
    margin-bottom: 3px;
  }
  .pf-stat-label {
    font-size: 11px; font-weight: 600;
    color: var(--text-tertiary); letter-spacing: .2px;
  }

  /* ACTION BUTTONS */
  .pf-actions {
    display: flex; align-items: center;
    justify-content: center; gap: 8px;
    flex-wrap: wrap; margin-bottom: 28px;
  }
  .pf-btn-red {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 9px 22px; border-radius: 999px;
    background: var(--accent); color: #fff;
    font-size: 13px; font-weight: 700;
    text-decoration: none; border: none;
    cursor: pointer; font-family: inherit;
    box-shadow: 0 3px 12px rgba(230,0,35,.25);
    transition: background .18s, transform .18s;
    -webkit-tap-highlight-color: transparent;
  }
  .pf-btn-red:hover { background: #ad081b; transform: translateY(-1px); }

  .pf-btn-ghost {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 9px 22px; border-radius: 999px;
    background: var(--bg-secondary);
    border: 1.5px solid var(--border-color);
    color: var(--text-primary);
    font-size: 13px; font-weight: 700;
    cursor: pointer; font-family: inherit;
    transition: border-color .18s, background .18s;
    -webkit-tap-highlight-color: transparent;
  }
  .pf-btn-ghost:hover { border-color: var(--text-secondary); background: var(--bg-tertiary); }

  /* ── TABS ── */
  .pf-tabs {
    border-bottom: 1px solid var(--border-color);
    position: sticky; top: 61px; z-index: 90;
    background: var(--bg-primary);
  }
  .pf-tabs-inner {
    display: flex; justify-content: center;
    max-width: 1200px; margin: 0 auto;
    padding: 0 16px; overflow-x: auto;
    scrollbar-width: none;
  }
  .pf-tabs-inner::-webkit-scrollbar { display: none; }
  .pf-tab-btn {
    padding: 14px 24px;
    font-size: 13px; font-weight: 700;
    border: none; background: transparent;
    color: var(--text-secondary);
    border-bottom: 2.5px solid transparent;
    cursor: pointer; white-space: nowrap;
    font-family: inherit; margin-bottom: -1px;
    transition: color .18s, border-color .18s;
    -webkit-tap-highlight-color: transparent;
  }
  .pf-tab-btn.active {
    color: var(--text-primary);
    border-bottom-color: var(--accent);
  }

  /* ── CONTENT ── */
  .pf-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 28px 16px 80px;
  }

  /* Masonry */
  .masonry-grid { display: flex; gap: 12px; width: 100%; }
  .masonry-col  { display: flex; flex-direction: column; gap: 12px; }

  /* ── EMPTY STATES ── */
  .pf-empty {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 80px 20px; text-align: center;
  }
  .pf-empty-icon {
    width: 72px; height: 72px; border-radius: 50%;
    background: var(--bg-secondary);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 18px;
  }
  .pf-empty-title {
    font-family: 'Playfair Display', serif;
    font-size: 20px; font-weight: 900;
    color: var(--text-primary); margin-bottom: 7px;
  }
  .pf-empty-sub {
    font-size: 14px; color: var(--text-secondary);
    margin-bottom: 22px; line-height: 1.6; max-width: 240px;
  }

  /* ── ORDER CARDS ── */
  .pf-order-card {
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 20px; padding: 16px 20px;
    display: flex; align-items: center; gap: 14px;
    text-decoration: none;
    transition: box-shadow .18s, transform .18s;
  }
  .pf-order-card:hover {
    box-shadow: 0 6px 24px rgba(0,0,0,.08);
    transform: translateY(-2px);
  }
  .pf-order-img {
    width: 62px; height: 62px;
    border-radius: 14px; object-fit: cover; flex-shrink: 0;
    background: var(--bg-secondary);
  }
  .pf-order-id {
    font-size: 10px; font-weight: 700;
    color: var(--text-tertiary); letter-spacing: .4px;
    margin-bottom: 3px; text-transform: uppercase;
  }
  .pf-order-name {
    font-size: 14px; font-weight: 700;
    color: var(--text-primary);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    margin-bottom: 3px;
  }
  .pf-order-date {
    font-size: 12px; color: var(--text-tertiary);
  }
  .pf-order-total {
    font-size: 15px; font-weight: 800;
    color: var(--text-primary); margin-bottom: 6px;
    text-align: right;
  }

  /* STATUS BADGE */
  .pf-status {
    display: inline-block;
    font-size: 10px; font-weight: 700;
    padding: 3px 10px; border-radius: 999px;
    letter-spacing: .3px;
  }

  /* ── ADMIN TILES ── */
  .pf-admin-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
    gap: 14px; max-width: 820px; margin: 0 auto;
  }
  .pf-admin-tile {
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 20px; padding: 22px 18px;
    text-decoration: none;
    display: flex; flex-direction: column; gap: 10px;
    transition: box-shadow .18s, transform .18s;
  }
  .pf-admin-tile:hover {
    box-shadow: 0 6px 24px rgba(0,0,0,.09);
    transform: translateY(-3px);
  }
  .pf-admin-tile-icon {
    width: 46px; height: 46px;
    border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px;
  }
  .pf-admin-tile-title {
    font-size: 14px; font-weight: 700;
    color: var(--text-primary);
  }
  .pf-admin-tile-desc {
    font-size: 12px; color: var(--text-secondary); line-height: 1.45;
  }

  /* ── ANIMATIONS ── */
  @keyframes pfFadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .pf-hero  { animation: pfFadeUp .38s ease both; }
  .pf-content { animation: pfFadeUp .42s ease .06s both; }

  /* ── RESPONSIVE ── */
  @media (max-width: 600px) {
    .pf-hero { padding: 32px 16px 0; }
    .pf-name { font-size: 22px; }
    .pf-avatar { width: 90px; height: 90px; font-size: 34px; }
    .pf-tab-btn { padding: 12px 16px; font-size: 12px; }
    .pf-content { padding: 20px 12px 60px; }
    .masonry-grid { gap: 8px; }
    .masonry-col  { gap: 8px; }
  }
  @media (max-width: 360px) {
    .pf-stat-num { font-size: 17px; }
    .pf-actions { gap: 6px; }
    .pf-btn-red, .pf-btn-ghost { padding: 8px 16px; font-size: 12px; }
  }
`;

function injectStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('pf-styles')) return;
  const s = document.createElement('style');
  s.id = 'pf-styles';
  s.textContent = STYLES;
  document.head.appendChild(s);
}

function StatusBadge({ status }) {
  const map = {
    pending:   { bg: 'rgba(255,170,0,.15)',  color: '#b37700'  },
    confirmed: { bg: 'rgba(0,120,255,.12)',  color: '#0057b3'  },
    shipped:   { bg: 'rgba(120,0,255,.12)',  color: '#5500cc'  },
    delivered: { bg: 'rgba(0,180,80,.13)',   color: '#006830'  },
    cancelled: { bg: 'rgba(230,0,35,.1)',    color: '#e60023'  },
  };
  const s = map[status] || map.pending;
  return (
    <span className="pf-status" style={{ background: s.bg, color: s.color }}>
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  );
}

export default function ProfilePage() {
  const { user, loading, logout, setAuthUser } = useAuth();
  const router = useRouter();
  const { addToast } = useToast();

  const [wishlisted, setWishlisted]   = useState([]);
  const [orders, setOrders]           = useState([]);
  const [tab, setTab]                 = useState('saved');
  const [fetching, setFetching]       = useState(true);
  const [uploading, setUploading]     = useState(false);

  useEffect(() => { injectStyles(); }, []);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      api.get('/wishlist/my').then(r => setWishlisted(r.data)),
      api.get('/orders/my').then(r => setOrders(r.data)).catch(() => setOrders([])),
    ]).finally(() => setFetching(false));
  }, [user]);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const uploaded = await uploadToCloudinary(file);
      await api.put('/users/me', { avatar: uploaded.url });
      setAuthUser({ ...user, avatar: uploaded.url });
      addToast('Profile picture updated!', 'success');
    } catch {
      addToast('Failed to upload image', 'error');
    } finally { setUploading(false); }
  };

  if (loading || fetching) return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '60vh', color: 'var(--text-tertiary)',
      fontFamily: 'system-ui', fontSize: 14,
    }}>
      Loading…
    </div>
  );
  if (!user) return null;

  const isAdmin = user.role === 'admin';
  const tabs = [
    { key: 'saved',  label: `Saved (${wishlisted.length})` },
    { key: 'orders', label: `Orders (${orders.length})` },
    ...(isAdmin ? [{ key: 'admin', label: 'Admin' }] : []),
  ];

  return (
    <div className="pf">

      {/* ── HERO ── */}
      <div className="pf-hero">
        <div className="pf-hero-inner">

          {/* SETTINGS */}
          <Link href="/settings" className="pf-settings" aria-label="Settings">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </Link>

          {/* AVATAR */}
          <label className="pf-avatar-wrap" style={{ opacity: uploading ? .6 : 1 }}>
            <div className="pf-avatar">
              {user.avatar
                ? <img src={user.avatar} alt="" />
                : user.name?.[0]?.toUpperCase()
              }
            </div>
            <div className="pf-avatar-overlay">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </div>
            <div className="pf-avatar-cam">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="var(--bg-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </div>
            <input
              type="file" accept="image/*"
              onChange={handleAvatarUpload}
              disabled={uploading}
              style={{ display: 'none' }}
            />
          </label>

          {/* NAME + EMAIL */}
          <h1 className="pf-name">{user.name}</h1>
          <p className="pf-email">{user.email}</p>

          {/* ADMIN BADGE */}
          {isAdmin && (
            <div className="pf-admin-badge">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              ADMIN
            </div>
          )}

          {/* STATS */}
          <div className="pf-stats">
            {[
              { num: wishlisted.length, label: 'Saved' },
              { num: orders.length,     label: 'Orders' },
              { num: orders.filter(o => o.status === 'delivered').length, label: 'Delivered' },
            ].map((s) => (
              <div key={s.label} className="pf-stat">
                <div className="pf-stat-num">{s.num}</div>
                <div className="pf-stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* ACTIONS */}
          <div className="pf-actions">
            {isAdmin && (
              <Link href="/upload" className="pf-btn-red">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.8" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5"  y1="12" x2="19" y2="12"/>
                </svg>
                Upload
              </Link>
            )}
            <button
              className="pf-btn-ghost"
              onClick={() => { logout(); router.push('/'); }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Log out
            </button>
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="pf-tabs">
        <div className="pf-tabs-inner">
          {tabs.map((t) => (
            <button
              key={t.key}
              className={`pf-tab-btn${tab === t.key ? ' active' : ''}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="pf-content">

        {/* SAVED */}
        {tab === 'saved' && (
          wishlisted.length > 0 ? (
            <Masonry breakpointCols={breakpoints} className="masonry-grid" columnClassName="masonry-col">
              {wishlisted.map((p) => (
                <ProductCard
                  key={p._id}
                  product={p}
                  onRemoveWishlist={() => setWishlisted(wishlisted.filter(w => w._id !== p._id))}
                />
              ))}
            </Masonry>
          ) : (
            <div className="pf-empty">
              <div className="pf-empty-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                  stroke="var(--text-tertiary)" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </div>
              <h2 className="pf-empty-title">Nothing saved yet</h2>
              <p className="pf-empty-sub">Tap the heart on any product to save it here.</p>
              <Link href="/" className="pf-btn-red" style={{ textDecoration: 'none' }}>
                Explore products
              </Link>
            </div>
          )
        )}

        {/* ORDERS */}
        {tab === 'orders' && (
          orders.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 700, margin: '0 auto' }}>
              {orders.map((order) => (
                <Link key={order._id} href={`/orders/${order._id}`} className="pf-order-card">
                  {order.items?.[0]?.product?.images?.[0] && (
                    <img
                      className="pf-order-img"
                      src={order.items[0].product.images[0]}
                      alt=""
                    />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p className="pf-order-id">#{order._id?.slice(-8).toUpperCase()}</p>
                    <p className="pf-order-name">
                      {order.items?.map(i => i.product?.name).filter(Boolean).join(', ') || 'Order'}
                    </p>
                    <p className="pf-order-date">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p className="pf-order-total">KSh {order.total?.toLocaleString()}</p>
                    <StatusBadge status={order.status} />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="pf-empty">
              <div className="pf-empty-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                  stroke="var(--text-tertiary)" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
              </div>
              <h2 className="pf-empty-title">No orders yet</h2>
              <p className="pf-empty-sub">When you place an order it will show up here.</p>
              <Link href="/" className="pf-btn-red" style={{ textDecoration: 'none' }}>
                Start shopping
              </Link>
            </div>
          )
        )}

        {/* ADMIN */}
        {tab === 'admin' && isAdmin && (
          <div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24, textAlign: 'center' }}>
              Manage your store from here.
            </p>
            <div className="pf-admin-grid">
              {[
                { href: '/admin',          icon: '📊', label: 'Dashboard',      desc: 'Overview of store activity',     bg: 'rgba(230,0,35,.1)'  },
                { href: '/admin/products', icon: '📦', label: 'Products',       desc: 'Manage and edit listings',       bg: 'rgba(0,120,255,.1)' },
                { href: '/admin/orders',   icon: '🧾', label: 'Orders',         desc: 'View and update order statuses', bg: 'rgba(0,180,80,.1)'  },
                { href: '/admin/users',    icon: '👥', label: 'Users',          desc: 'Browse and manage accounts',     bg: 'rgba(120,0,255,.1)' },
                { href: '/upload',         icon: '⬆️', label: 'Upload Product', desc: 'Add a new product to the store', bg: 'rgba(255,140,0,.1)' },
              ].map((tile) => (
                <Link key={tile.href} href={tile.href} className="pf-admin-tile">
                  <div className="pf-admin-tile-icon" style={{ background: tile.bg }}>
                    {tile.icon}
                  </div>
                  <p className="pf-admin-tile-title">{tile.label}</p>
                  <p className="pf-admin-tile-desc">{tile.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}