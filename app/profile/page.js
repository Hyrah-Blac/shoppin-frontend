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

function StatusBadge({ status }) {
  const styles = {
    pending:   { background: 'rgba(255,170,0,.15)',  color: '#b37700' },
    confirmed: { background: 'rgba(0,120,255,.12)',  color: '#0057b3' },
    shipped:   { background: 'rgba(120,0,255,.12)',  color: '#5500cc' },
    delivered: { background: 'rgba(0,180,80,.13)',   color: '#006830' },
    cancelled: { background: 'rgba(230,0,35,.1)',    color: '#e60023' },
  };
  return (
    <span style={{
      display: 'inline-block', fontSize: 11, fontWeight: 700,
      padding: '3px 10px', borderRadius: 999, letterSpacing: .3,
      ...(styles[status] || styles.pending),
    }}>
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  );
}

function GearIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  );
}

export default function ProfilePage() {
  const { user, loading, logout, setAuthUser } = useAuth();
  const router = useRouter();
  const { addToast } = useToast();

  const [wishlisted, setWishlisted] = useState([]);
  const [orders, setOrders]         = useState([]);
  const [tab, setTab]               = useState('saved');
  const [fetching, setFetching]     = useState(true);
  const [uploading, setUploading]   = useState(false);
  const [hoveredOrder, setHoveredOrder] = useState(null);

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
    } finally {
      setUploading(false);
    }
  };

  if (loading || fetching) return (
    <div style={{ textAlign: 'center', padding: 80, color: 'var(--text-secondary)', fontSize: 14 }}>Loading…</div>
  );
  if (!user) return null;

  const isAdmin = user.role === 'admin';
  const tabs = [
    { key: 'saved',  label: `Saved (${wishlisted.length})` },
    { key: 'orders', label: `Orders (${orders.length})` },
    ...(isAdmin ? [{ key: 'admin', label: '⚡ Admin' }] : []),
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>

      {/* ── HERO ── */}
      <div style={{
        position: 'relative',
        padding: '48px 20px 0',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        textAlign: 'center', maxWidth: 680, margin: '0 auto',
      }}>

        {/* SETTINGS ICON */}
        <Link href="/settings" aria-label="Settings" style={{
          position: 'absolute', top: 16, right: 0,
          width: 40, height: 40, borderRadius: '50%',
          background: 'var(--bg-secondary)', border: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: 'var(--text-primary)', textDecoration: 'none',
          transition: 'background .18s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--border-color)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
        >
          <GearIcon />
        </Link>

        {/* AVATAR */}
        <label style={{
          position: 'relative', display: 'inline-block',
          marginBottom: 14, cursor: uploading ? 'wait' : 'pointer',
        }}>
          <div style={{
            width: 120, height: 120, borderRadius: '50%',
            background: '#e60023',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 46, fontWeight: 800, color: '#fff',
            overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,.12)',
            opacity: uploading ? .6 : 1, transition: 'opacity .2s',
          }}>
            {user.avatar ? <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : user.name?.[0]?.toUpperCase()}
          </div>
          <div style={{
            position: 'absolute', bottom: 4, right: 4,
            width: 32, height: 32, borderRadius: '50%',
            background: '#111', border: '2.5px solid var(--bg-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, pointerEvents: 'none',
          }}>📷</div>
          <input type="file" accept="image/*" onChange={handleAvatarUpload} disabled={uploading} style={{ display: 'none' }} />
        </label>

        {/* NAME */}
        <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: -.5, margin: '0 0 5px' }}>
          {user.name}
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: '0 0 14px' }}>{user.email}</p>

        {isAdmin && (
          <div style={{ marginBottom: 12 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              fontSize: 10, fontWeight: 800, letterSpacing: .8,
              background: 'rgba(230,0,35,.1)', color: '#e60023',
              padding: '3px 10px', borderRadius: 999,
            }}>⚡ ADMIN</span>
          </div>
        )}

        {/* ACTIONS */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 22 }}>
          {isAdmin && (
            <Link href="/upload" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '9px 22px', borderRadius: 999,
              background: '#e60023', color: '#fff',
              fontSize: 14, fontWeight: 700, textDecoration: 'none',
              border: 'none', cursor: 'pointer',
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Upload
            </Link>
          )}
          <button
            onClick={() => { logout(); router.push('/'); }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '9px 22px', borderRadius: 999,
              background: 'var(--bg-secondary)', color: '#e60023',
              fontSize: 14, fontWeight: 700,
              border: 'none', cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Log out
          </button>
        </div>

        {/* STATS */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginBottom: 28 }}>
          {[
            { num: wishlisted.length, label: 'Saved' },
            { num: orders.length,     label: 'Orders' },
            { num: orders.filter(o => o.status === 'delivered').length, label: 'Delivered' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{s.num}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── TABS ── */}
      <div style={{ borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 61, zIndex: 90, background: 'var(--bg-primary)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', maxWidth: 1200, margin: '0 auto', padding: '0 16px', overflowX: 'auto' }}>
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                padding: '14px 24px', fontSize: 14, fontWeight: 700,
                border: 'none', background: 'transparent',
                color: tab === t.key ? 'var(--text-primary)' : 'var(--text-secondary)',
                borderBottom: tab === t.key ? '2.5px solid #e60023' : '2.5px solid transparent',
                cursor: 'pointer', marginBottom: -1,
                transition: 'color .18s', whiteSpace: 'nowrap', fontFamily: 'inherit',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 16px 80px' }}>

        {/* SAVED */}
        {tab === 'saved' && (
          wishlisted.length > 0 ? (
            <>
              <style>{`.masonry-grid{display:flex;gap:12px;width:100%}.masonry-col{display:flex;flex-direction:column;gap:12px}`}</style>
              <Masonry breakpointCols={breakpoints} className="masonry-grid" columnClassName="masonry-col">
                {wishlisted.map(p => (
                  <ProductCard key={p._id} product={p}
                    onRemoveWishlist={() => setWishlisted(wishlisted.filter(w => w._id !== p._id))} />
                ))}
              </Masonry>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <span style={{ fontSize: 52, display: 'block', marginBottom: 18 }}>🛍️</span>
              <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>Nothing saved yet</p>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.55 }}>Tap the heart on any product to save it here.</p>
              <Link href="/" style={{
                display: 'inline-flex', padding: '9px 22px', borderRadius: 999,
                background: '#e60023', color: '#fff', fontSize: 14, fontWeight: 700, textDecoration: 'none',
              }}>Explore products</Link>
            </div>
          )
        )}

        {/* ORDERS */}
        {tab === 'orders' && (
          orders.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 720, margin: '0 auto' }}>
              {orders.map(order => (
                <Link
                  key={order._id}
                  href={`/orders/${order._id}`}
                  onMouseEnter={() => setHoveredOrder(order._id)}
                  onMouseLeave={() => setHoveredOrder(null)}
                  style={{
                    background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
                    borderRadius: 18, padding: '16px 20px',
                    display: 'flex', alignItems: 'center', gap: 14,
                    textDecoration: 'none',
                    boxShadow: hoveredOrder === order._id ? '0 6px 24px rgba(0,0,0,.08)' : 'none',
                    transform: hoveredOrder === order._id ? 'translateY(-2px)' : 'none',
                    transition: 'box-shadow .18s, transform .18s',
                  }}
                >
                  {order.items?.[0]?.product?.images?.[0] && (
                    <img src={order.items[0].product.images[0]} alt="" style={{ width: 64, height: 64, borderRadius: 14, objectFit: 'cover', flexShrink: 0 }} />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 3, fontWeight: 600, letterSpacing: .3 }}>
                      #{order._id?.slice(-8).toUpperCase()}
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 4 }}>
                      {order.items?.map(i => i.product?.name).filter(Boolean).join(', ') || 'Order'}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>
                      KSh {order.total?.toLocaleString()}
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <span style={{ fontSize: 52, display: 'block', marginBottom: 18 }}>📦</span>
              <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>No orders yet</p>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.55 }}>When you place an order it will show up here.</p>
              <Link href="/" style={{
                display: 'inline-flex', padding: '9px 22px', borderRadius: 999,
                background: '#e60023', color: '#fff', fontSize: 14, fontWeight: 700, textDecoration: 'none',
              }}>Start shopping</Link>
            </div>
          )
        )}

        {/* ADMIN */}
        {tab === 'admin' && isAdmin && (
          <div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24, textAlign: 'center' }}>
              Manage your store from here.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14, maxWidth: 800, margin: '0 auto' }}>
              {[
                { href: '/admin',          icon: '📊', label: 'Dashboard',      desc: 'Overview of store activity',     bg: 'rgba(230,0,35,.1)'  },
                { href: '/admin/products', icon: '📦', label: 'Products',       desc: 'Manage and edit listings',       bg: 'rgba(0,120,255,.1)' },
                { href: '/admin/orders',   icon: '🧾', label: 'Orders',         desc: 'View and update order statuses', bg: 'rgba(0,180,80,.1)'  },
                { href: '/admin/users',    icon: '👥', label: 'Users',          desc: 'Browse and manage accounts',     bg: 'rgba(120,0,255,.1)' },
                { href: '/upload',         icon: '⬆️', label: 'Upload Product', desc: 'Add a new product to the store', bg: 'rgba(255,140,0,.1)' },
              ].map(tile => (
                <Link key={tile.href} href={tile.href} style={{
                  background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
                  borderRadius: 20, padding: '22px 18px',
                  textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 10,
                  transition: 'box-shadow .18s, transform .18s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,.09)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
                >
                  <div style={{ width: 46, height: 46, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, background: tile.bg }}>{tile.icon}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{tile.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{tile.desc}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}