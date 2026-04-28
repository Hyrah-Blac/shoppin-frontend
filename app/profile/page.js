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
    background: #0a0a0a;
    font-family: system-ui, -apple-system, sans-serif;
    color: #ffffff;
  }

  .pf-hero {
    background: #111111;
    border-bottom: 1px solid #1a1a1a;
    padding: 40px 20px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .pf-hero-inner { max-width: 560px; width: 100%; margin: 0 auto; position: relative; }

  .pf-settings {
    position: absolute; top: 0; right: 0;
    width: 40px; height: 40px; border-radius: 50%;
    background: #1a1a1a; border: none;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: #999;
    text-decoration: none;
    transition: background .18s, color .18s;
    -webkit-tap-highlight-color: transparent;
  }
  .pf-settings:hover { background: #2a2a2a; color: #ffffff; }

  .pf-avatar-wrap {
    position: relative; display: inline-block;
    margin-bottom: 16px; cursor: pointer;
  }
  .pf-avatar {
    width: 108px; height: 108px; border-radius: 50%;
    background: linear-gradient(135deg, #e60023 0%, #c40020 100%);
    display: flex; align-items: center; justify-content: center;
    font-size: 42px; font-weight: 900; color: #fff;
    overflow: hidden;
    border: 4px solid #111111;
    box-shadow: 0 8px 32px rgba(230,0,35,.4);
    transition: opacity .2s, transform .2s;
  }
  .pf-avatar:hover { transform: scale(1.05); }
  .pf-avatar img { width: 100%; height: 100%; object-fit: cover; }
  .pf-avatar-overlay {
    position: absolute; inset: 0; border-radius: 50%;
    background: rgba(0,0,0,.5);
    display: flex; align-items: center; justify-content: center;
    opacity: 0; transition: opacity .18s;
  }
  .pf-avatar-wrap:hover .pf-avatar-overlay { opacity: 1; }
  .pf-avatar-cam {
    position: absolute; bottom: 4px; right: 4px;
    width: 30px; height: 30px; border-radius: 50%;
    background: #e60023;
    border: 2.5px solid #111111;
    display: flex; align-items: center; justify-content: center;
  }

  .pf-name {
    font-family: 'Playfair Display', serif;
    font-size: 26px; font-weight: 900;
    color: #ffffff; letter-spacing: -.4px; margin-bottom: 4px;
  }
  .pf-email { font-size: 13px; color: #999; margin-bottom: 12px; }

  .pf-stats {
    display: flex; justify-content: center;
    gap: 0; margin-bottom: 24px;
    border: 1px solid #1a1a1a;
    border-radius: 16px; overflow: hidden;
    background: #161616;
  }
  .pf-stat {
    flex: 1; padding: 14px 8px; text-align: center;
    border-right: 1px solid #1a1a1a;
  }
  .pf-stat:last-child { border-right: none; }
  .pf-stat-num {
    font-family: 'Playfair Display', serif;
    font-size: 20px; font-weight: 900;
    color: #ffffff; line-height: 1; margin-bottom: 3px;
  }
  .pf-stat-label { font-size: 11px; font-weight: 600; color: #666; letter-spacing: .2px; }

  .pf-actions {
    display: flex; align-items: center;
    justify-content: center; gap: 8px;
    flex-wrap: wrap; margin-bottom: 28px;
  }
  .pf-btn-red {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 9px 22px; border-radius: 999px;
    background: #e60023; color: #fff;
    font-size: 13px; font-weight: 700;
    text-decoration: none; border: none;
    cursor: pointer; font-family: inherit;
    box-shadow: 0 4px 16px rgba(230,0,35,.35);
    transition: background .18s, transform .18s, box-shadow .18s;
    -webkit-tap-highlight-color: transparent;
  }
  .pf-btn-red:hover { 
    background: #ad081b; 
    transform: translateY(-2px);
    box-shadow: 0 6px 24px rgba(230,0,35,.45);
  }
  .pf-btn-red:active { transform: translateY(0); }

  .pf-btn-ghost {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 9px 22px; border-radius: 999px;
    background: #1a1a1a;
    border: 1.5px solid #2a2a2a;
    color: #ffffff;
    font-size: 13px; font-weight: 700;
    cursor: pointer; font-family: inherit;
    transition: border-color .18s, background .18s;
    -webkit-tap-highlight-color: transparent;
  }
  .pf-btn-ghost:hover { border-color: #444; background: #1f1f1f; }

  .pf-tabs {
    border-bottom: 1px solid #1a1a1a;
    position: sticky; top: 61px; z-index: 90;
    background: #111111;
  }
  .pf-tabs-inner {
    display: flex; justify-content: center;
    max-width: 1200px; margin: 0 auto;
    padding: 0 16px; overflow-x: auto; scrollbar-width: none;
  }
  .pf-tabs-inner::-webkit-scrollbar { display: none; }
  .pf-tab-btn {
    padding: 14px 24px; font-size: 13px; font-weight: 700;
    border: none; background: transparent;
    color: #666;
    border-bottom: 2.5px solid transparent;
    cursor: pointer; white-space: nowrap;
    font-family: inherit; margin-bottom: -1px;
    transition: color .18s, border-color .18s;
    -webkit-tap-highlight-color: transparent;
  }
  .pf-tab-btn.active { color: #ffffff; border-bottom-color: #e60023; }

  .pf-content { max-width: 1200px; margin: 0 auto; padding: 28px 16px 80px; }

  .masonry-grid { display: flex; gap: 12px; width: 100%; }
  .masonry-col  { display: flex; flex-direction: column; gap: 12px; }

  @keyframes pfShimmer {
    0%   { background-position: -600px 0; }
    100% { background-position:  600px 0; }
  }
  .pf-skeleton {
    border-radius: 20px; overflow: hidden;
    background: linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%);
    background-size: 600px 100%;
    animation: pfShimmer 1.4s infinite linear;
  }
  .pf-skeleton-hero {
    display: flex; flex-direction: column;
    align-items: center; padding: 40px 20px 28px;
    background: #111111;
    border-bottom: 1px solid #1a1a1a;
  }
  .pf-sk-circle { width: 108px; height: 108px; border-radius: 50%; margin-bottom: 16px; }
  .pf-sk-line   { border-radius: 8px; margin-bottom: 10px; }

  .pf-empty {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 80px 20px; text-align: center;
  }
  .pf-empty-icon {
    width: 72px; height: 72px; border-radius: 50%;
    background: #1a1a1a;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 18px;
  }
  .pf-empty-title {
    font-family: 'Playfair Display', serif;
    font-size: 20px; font-weight: 900;
    color: #ffffff; margin-bottom: 7px;
  }
  .pf-empty-sub {
    font-size: 14px; color: #999;
    margin-bottom: 22px; line-height: 1.6; max-width: 240px;
  }

  .pf-order-card {
    background: #161616;
    border: 1px solid #1a1a1a;
    border-radius: 20px; padding: 16px 20px;
    display: flex; align-items: center; gap: 14px;
    text-decoration: none;
    transition: box-shadow .18s, transform .18s, background .18s;
  }
  .pf-order-card:hover { 
    box-shadow: 0 8px 32px rgba(230,0,35,.15); 
    transform: translateY(-2px);
    background: #1a1a1a;
  }
  .pf-order-img {
    width: 62px; height: 62px; border-radius: 14px;
    object-fit: cover; flex-shrink: 0;
    background: #1a1a1a;
  }
  .pf-order-id {
    font-size: 10px; font-weight: 700;
    color: #666; letter-spacing: .4px;
    margin-bottom: 3px; text-transform: uppercase;
  }
  .pf-order-name {
    font-size: 14px; font-weight: 700; color: #ffffff;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 3px;
  }
  .pf-order-date { font-size: 12px; color: #666; }
  .pf-order-total { font-size: 15px; font-weight: 800; color: #ffffff; margin-bottom: 6px; text-align: right; }

  .pf-status {
    display: inline-block; font-size: 10px; font-weight: 700;
    padding: 3px 10px; border-radius: 999px; letter-spacing: .3px;
  }

  .pf-order-progress { display: flex; align-items: center; gap: 0; margin-top: 10px; }
  .pf-op-step { display: flex; flex-direction: column; align-items: center; flex: 1; position: relative; }
  .pf-op-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: #2a2a2a; border: 1.5px solid #2a2a2a;
    z-index: 1; flex-shrink: 0; transition: background .2s, border-color .2s;
  }
  .pf-op-dot.done { background: #e60023; border-color: #e60023; }
  .pf-op-dot.active { background: #111111; border-color: #e60023; box-shadow: 0 0 0 2px rgba(230,0,35,.3); }
  .pf-op-line { position: absolute; top: 3.5px; left: 50%; height: 1.5px; width: 100%; background: #2a2a2a; z-index: 0; }
  .pf-op-line.done { background: #e60023; }
  .pf-op-label { font-size: 9px; color: #666; margin-top: 4px; white-space: nowrap; font-weight: 600; }
  .pf-op-label.active { color: #e60023; }

  .pf-error { display: flex; flex-direction: column; align-items: center; padding: 60px 20px; text-align: center; }
  .pf-error-title { font-size: 15px; font-weight: 700; color: #ffffff; margin-bottom: 6px; }
  .pf-error-sub { font-size: 13px; color: #999; margin-bottom: 18px; }

  @keyframes pfFadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .pf-hero    { animation: pfFadeUp .38s ease both; }
  .pf-content { animation: pfFadeUp .42s ease .06s both; }

  @media (max-width: 600px) {
    .pf-hero { padding: 32px 16px 0; }
    .pf-name { font-size: 22px; }
    .pf-avatar { width: 90px; height: 90px; font-size: 34px; }
    .pf-tab-btn { padding: 12px 16px; font-size: 12px; }
    .pf-content { padding: 20px 12px 60px; }
    .masonry-grid { gap: 8px; }
    .masonry-col  { gap: 8px; }
    .pf-op-label { display: none; }
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
    pending:   { bg: 'rgba(255,170,0,.15)',  color: '#ffaa00' },
    confirmed: { bg: 'rgba(0,150,255,.12)',  color: '#0096ff' },
    shipped:   { bg: 'rgba(150,0,255,.12)',  color: '#9600ff' },
    delivered: { bg: 'rgba(0,200,100,.13)', color: '#00c864' },
    cancelled: { bg: 'rgba(230,0,35,.12)',   color: '#e60023' },
  };
  const s = map[status] || map.pending;
  return (
    <span className="pf-status" style={{ background: s.bg, color: s.color }}>
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  );
}

const ORDER_STEPS = ['placed', 'confirmed', 'shipped', 'delivered'];
const STATUS_INDEX = { pending: 0, confirmed: 1, shipped: 2, delivered: 3, cancelled: -1 };

function OrderProgress({ status }) {
  if (status === 'cancelled') return null;
  const current = STATUS_INDEX[status] ?? 0;
  return (
    <div className="pf-order-progress" role="list" aria-label="Order progress">
      {ORDER_STEPS.map((step, i) => {
        const done   = i < current;
        const active = i === current;
        return (
          <div key={step} className="pf-op-step" role="listitem">
            {i < ORDER_STEPS.length - 1 && (
              <div className={`pf-op-line${done ? ' done' : ''}`} />
            )}
            <div className={`pf-op-dot${done ? ' done' : active ? ' active' : ''}`} />
            <span className={`pf-op-label${active ? ' active' : ''}`}>
              {step.charAt(0).toUpperCase() + step.slice(1)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function SkeletonHero() {
  return (
    <div className="pf-skeleton-hero">
      <div className="pf-skeleton pf-sk-circle" />
      <div className="pf-skeleton pf-sk-line" style={{ width: 140, height: 22 }} />
      <div className="pf-skeleton pf-sk-line" style={{ width: 190, height: 14 }} />
      <div className="pf-skeleton pf-sk-line" style={{ width: 80, height: 14, marginBottom: 20 }} />
      <div style={{ display: 'flex', gap: 0, width: '100%', maxWidth: 340, borderRadius: 16, overflow: 'hidden', border: '1px solid #1a1a1a' }}>
        {[1,2,3].map(i => (
          <div key={i} className="pf-skeleton" style={{ flex: 1, height: 58, borderRadius: 0 }} />
        ))}
      </div>
    </div>
  );
}

function SkeletonCards() {
  const heights = [220, 280, 200, 260, 240, 300, 210, 250];
  return (
    <Masonry breakpointCols={breakpoints} className="masonry-grid" columnClassName="masonry-col">
      {heights.map((h, i) => (
        <div key={i} className="pf-skeleton" style={{ height: h, borderRadius: 20 }} />
      ))}
    </Masonry>
  );
}

export default function ProfilePage() {
  const { user, loading, logout, setAuthUser } = useAuth();
  const router = useRouter();
  const { addToast } = useToast();

  const [wishlisted, setWishlisted]       = useState([]);
  const [orders, setOrders]               = useState([]);
  const [tab, setTab]                     = useState('saved');
  const [fetching, setFetching]           = useState(true);
  const [uploading, setUploading]         = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [wishlistError, setWishlistError] = useState(false);
  const [ordersError, setOrdersError]     = useState(false);

  useEffect(() => { injectStyles(); }, []);

  useEffect(() => {
    if (loading) return;
    if (!user) { router.push('/login'); return; }
    if (user.role === 'admin') { router.replace('/admin'); return; }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user || user.role === 'admin') return;
    setWishlistError(false);
    setOrdersError(false);
    const wReq = api.get('/wishlist/my').then(r => setWishlisted(r.data)).catch(() => setWishlistError(true));
    const oReq = api.get('/orders/my').then(r => setOrders(r.data)).catch(() => setOrdersError(true));
    Promise.all([wReq, oReq]).finally(() => setFetching(false));
  }, [user]);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { addToast('Image must be under 5 MB', 'error'); return; }
    if (!file.type.startsWith('image/')) { addToast('Please select an image file', 'error'); return; }
    const localUrl = URL.createObjectURL(file);
    setAvatarPreview(localUrl);
    setUploading(true);
    try {
      const uploaded = await uploadToCloudinary(file);
      await api.put('/users/me', { avatar: uploaded.url });
      setAuthUser({ ...user, avatar: uploaded.url });
      setAvatarPreview(null);
      addToast('Profile picture updated!', 'success');
    } catch {
      setAvatarPreview(null);
      addToast('Failed to upload image', 'error');
    } finally {
      setUploading(false);
      URL.revokeObjectURL(localUrl);
    }
  };

  if (loading || fetching || !user || user.role === 'admin') return (
    <div className="pf">
      <SkeletonHero />
      <div className="pf-tabs" style={{ pointerEvents: 'none', opacity: .4 }}>
        <div className="pf-tabs-inner">
          {['Saved', 'Orders'].map(l => <button key={l} className="pf-tab-btn">{l}</button>)}
        </div>
      </div>
      <div className="pf-content"><SkeletonCards /></div>
    </div>
  );

  const displayAvatar = avatarPreview || user.avatar;

  const tabs = [
    { key: 'saved',  label: `Saved (${wishlisted.length})` },
    { key: 'orders', label: `Orders (${orders.length})` },
  ];

  return (
    <div className="pf">

      <div className="pf-hero">
        <div className="pf-hero-inner">

          <Link href="/settings" className="pf-settings" aria-label="Settings">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </Link>

          <label className="pf-avatar-wrap" style={{ opacity: uploading ? .6 : 1 }}>
            <div className="pf-avatar">
              {displayAvatar
                ? <img src={displayAvatar} alt={`${user.name}'s avatar`} />
                : user.name?.[0]?.toUpperCase()
              }
            </div>
            <div className="pf-avatar-overlay" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </div>
            <div className="pf-avatar-cam" aria-hidden="true">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="#111111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </div>
            <input type="file" accept="image/*" onChange={handleAvatarUpload}
              disabled={uploading} aria-label="Upload profile picture" style={{ display: 'none' }} />
          </label>

          <h1 className="pf-name">{user.name}</h1>
          <p className="pf-email">{user.email}</p>

          <div className="pf-stats" role="group" aria-label="Profile statistics">
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

          <div className="pf-actions">
            <button className="pf-btn-ghost" onClick={logout}>
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

      <div className="pf-tabs">
        <div className="pf-tabs-inner" role="tablist" aria-label="Profile sections">
          {tabs.map((t) => (
            <button
              key={t.key} role="tab"
              aria-selected={tab === t.key}
              aria-controls={`tabpanel-${t.key}`}
              id={`tab-${t.key}`}
              className={`pf-tab-btn${tab === t.key ? ' active' : ''}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="pf-content">

        {/* SAVED */}
        <div role="tabpanel" id="tabpanel-saved" aria-labelledby="tab-saved" hidden={tab !== 'saved'}>
          {tab === 'saved' && (
            wishlistError ? (
              <div className="pf-error">
                <p className="pf-error-title">Couldn't load saved items</p>
                <p className="pf-error-sub">Check your connection and try again.</p>
                <button className="pf-btn-ghost" onClick={() => {
                  setWishlistError(false);
                  api.get('/wishlist/my').then(r => setWishlisted(r.data)).catch(() => setWishlistError(true));
                }}>Retry</button>
              </div>
            ) : wishlisted.length > 0 ? (
              <Masonry breakpointCols={breakpoints} className="masonry-grid" columnClassName="masonry-col">
                {wishlisted.map((p) => (
                  <ProductCard key={p._id} product={p}
                    onRemoveWishlist={() => setWishlisted(wishlisted.filter(w => w._id !== p._id))} />
                ))}
              </Masonry>
            ) : (
              <div className="pf-empty">
                <div className="pf-empty-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                    stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </div>
                <h2 className="pf-empty-title">Nothing saved yet</h2>
                <p className="pf-empty-sub">Tap the heart on any product to save it here.</p>
                <Link href="/" className="pf-btn-red" style={{ textDecoration: 'none' }}>Explore products</Link>
              </div>
            )
          )}
        </div>

        {/* ORDERS */}
        <div role="tabpanel" id="tabpanel-orders" aria-labelledby="tab-orders" hidden={tab !== 'orders'}>
          {tab === 'orders' && (
            ordersError ? (
              <div className="pf-error">
                <p className="pf-error-title">Couldn't load orders</p>
                <p className="pf-error-sub">Check your connection and try again.</p>
                <button className="pf-btn-ghost" onClick={() => {
                  setOrdersError(false);
                  api.get('/orders/my').then(r => setOrders(r.data)).catch(() => setOrdersError(true));
                }}>Retry</button>
              </div>
            ) : orders.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 700, margin: '0 auto' }}>
                {orders.map((order) => (
                  <Link key={order._id} href={`/orders/${order._id}`} className="pf-order-card">
                    {order.items?.[0]?.product?.images?.[0] && (
                      <img className="pf-order-img"
                        src={order.items[0].product.images[0]}
                        alt={order.items[0].product?.name || 'Product'} />
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p className="pf-order-id">#{order._id?.slice(-8).toUpperCase()}</p>
                      <p className="pf-order-name">
                        {order.items?.map(i => i.product?.name).filter(Boolean).join(', ') || 'Order'}
                      </p>
                      <p className="pf-order-date">
                        {new Date(order.createdAt).toLocaleDateString('en-KE', {
                          year: 'numeric', month: 'short', day: 'numeric',
                        })}
                      </p>
                      <OrderProgress status={order.status} />
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
                    stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <path d="M16 10a4 4 0 0 1-8 0"/>
                  </svg>
                </div>
                <h2 className="pf-empty-title">No orders yet</h2>
                <p className="pf-empty-sub">When you place an order it will show up here.</p>
                <Link href="/" className="pf-btn-red" style={{ textDecoration: 'none' }}>Start shopping</Link>
              </div>
            )
          )}
        </div>

      </div>
    </div>
  );
}