'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap');

  .ad * { box-sizing: border-box; margin: 0; padding: 0; }
  .ad {
    min-height: 100vh;
    background: var(--bg-tertiary);
    font-family: system-ui, -apple-system, sans-serif;
    color: var(--text-primary);
    padding: 32px 16px 80px;
  }

  .ad-inner { max-width: 1100px; margin: 0 auto; }

  /* ── HEADER ── */
  .ad-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 28px;
    flex-wrap: wrap;
  }
  .ad-header-left {}
  .ad-title {
    font-family: 'Playfair Display', serif;
    font-size: 28px; font-weight: 900;
    color: var(--text-primary); letter-spacing: -.4px;
    margin-bottom: 3px;
  }
  .ad-sub { font-size: 13px; color: var(--text-secondary); }

  .ad-add-btn {
    display: inline-flex; align-items: center; gap: 7px;
    background: var(--accent); color: #fff;
    padding: 10px 20px; border-radius: 999px;
    font-size: 13px; font-weight: 700;
    text-decoration: none;
    box-shadow: 0 3px 12px rgba(230,0,35,.25);
    transition: background .18s, transform .18s;
    white-space: nowrap; flex-shrink: 0;
    -webkit-tap-highlight-color: transparent;
  }
  .ad-add-btn:hover { background: #ad081b; transform: translateY(-1px); }

  /* ── STAT CARDS ── */
  .ad-stats {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 12px;
    margin-bottom: 20px;
  }
  .ad-stat {
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 20px;
    padding: 20px 18px;
    position: relative;
    overflow: hidden;
    transition: box-shadow .18s, transform .18s;
  }
  .ad-stat:hover { box-shadow: 0 4px 20px rgba(0,0,0,.07); transform: translateY(-2px); }
  .ad-stat-icon {
    width: 36px; height: 36px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 12px; flex-shrink: 0;
  }
  .ad-stat-label {
    font-size: 11px; font-weight: 700;
    color: var(--text-tertiary);
    text-transform: uppercase; letter-spacing: .5px;
    margin-bottom: 6px;
  }
  .ad-stat-value {
    font-family: 'Playfair Display', serif;
    font-size: 26px; font-weight: 900;
    color: var(--text-primary); line-height: 1;
  }
  .ad-stat-value.accent { color: var(--accent); }
  .ad-stat-value.amber  { color: #d97706; }
  .ad-stat-value.green  { color: #059669; }

  /* ── QUICK LINKS ── */
  .ad-links {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-bottom: 20px;
  }
  .ad-link-card {
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 20px;
    padding: 22px 20px;
    text-decoration: none;
    display: flex; align-items: center; gap: 14px;
    transition: box-shadow .18s, transform .18s;
    -webkit-tap-highlight-color: transparent;
  }
  .ad-link-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,.07); transform: translateY(-2px); }
  .ad-link-icon {
    width: 46px; height: 46px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; flex-shrink: 0;
  }
  .ad-link-label {
    font-size: 14px; font-weight: 700;
    color: var(--text-primary);
  }
  .ad-link-sub {
    font-size: 12px; color: var(--text-secondary);
    margin-top: 2px;
  }
  .ad-link-arrow {
    margin-left: auto; color: var(--text-tertiary); flex-shrink: 0;
  }

  /* ── RECENT ORDERS ── */
  .ad-orders-card {
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 20px;
    overflow: hidden;
  }
  .ad-orders-head {
    padding: 18px 22px;
    border-bottom: 1px solid var(--border-color);
    display: flex; align-items: center;
    justify-content: space-between;
  }
  .ad-orders-title {
    font-family: 'Playfair Display', serif;
    font-size: 17px; font-weight: 900;
    color: var(--text-primary);
  }
  .ad-orders-see-all {
    font-size: 12px; font-weight: 700;
    color: var(--accent); text-decoration: none;
    transition: opacity .15s;
  }
  .ad-orders-see-all:hover { opacity: .75; }

  .ad-order-row {
    display: flex; align-items: center; gap: 14px;
    padding: 14px 22px;
    border-bottom: 1px solid var(--border-color);
    text-decoration: none;
    transition: background .15s;
    -webkit-tap-highlight-color: transparent;
  }
  .ad-order-row:last-child { border-bottom: none; }
  .ad-order-row:hover { background: var(--bg-secondary); }

  .ad-order-avatar {
    width: 36px; height: 36px; border-radius: 50%;
    background: var(--accent);
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 800; color: #fff;
    flex-shrink: 0; overflow: hidden;
  }
  .ad-order-avatar img { width: 100%; height: 100%; object-fit: cover; }

  .ad-order-name {
    font-size: 13px; font-weight: 700;
    color: var(--text-primary); margin-bottom: 2px;
  }
  .ad-order-email {
    font-size: 11px; color: var(--text-tertiary); font-weight: 500;
  }
  .ad-order-amount {
    font-size: 14px; font-weight: 800;
    color: var(--text-primary); margin-bottom: 4px;
    text-align: right;
  }

  /* STATUS BADGE */
  .ad-status {
    display: inline-block;
    font-size: 10px; font-weight: 700;
    padding: 2px 9px; border-radius: 999px;
    letter-spacing: .3px;
  }

  /* LOADING */
  .ad-center {
    display: flex; align-items: center; justify-content: center;
    min-height: 60vh; color: var(--text-tertiary);
    font-size: 14px;
  }

  /* ANIMATIONS */
  @keyframes adFadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .ad-inner { animation: adFadeUp .4s ease both; }

  /* RESPONSIVE */
  @media (max-width: 900px) {
    .ad-stats { grid-template-columns: repeat(3, 1fr); }
  }
  @media (max-width: 640px) {
    .ad { padding: 20px 12px 60px; }
    .ad-stats { grid-template-columns: repeat(2, 1fr); }
    .ad-links { grid-template-columns: 1fr; }
    .ad-title { font-size: 24px; }
    .ad-stat-value { font-size: 22px; }
    .ad-order-row { padding: 12px 16px; }
    .ad-orders-head { padding: 14px 16px; }
  }
  @media (max-width: 360px) {
    .ad-stats { grid-template-columns: 1fr; }
    .ad-title { font-size: 20px; }
  }
`;

function injectStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('ad-styles')) return;
  const s = document.createElement('style');
  s.id = 'ad-styles';
  s.textContent = STYLES;
  document.head.appendChild(s);
}

const STATUS_MAP = {
  pending:   { bg: 'rgba(245,158,11,.15)',  color: '#d97706' },
  confirmed: { bg: 'rgba(59,130,246,.12)',  color: '#1d4ed8' },
  shipped:   { bg: 'rgba(139,92,246,.12)',  color: '#7c3aed' },
  delivered: { bg: 'rgba(16,185,129,.12)',  color: '#059669' },
  cancelled: { bg: 'rgba(230,0,35,.1)',     color: '#e60023' },
};

function StatusBadge({ status }) {
  const s = STATUS_MAP[status] || STATUS_MAP.pending;
  return (
    <span className="ad-status" style={{ background: s.bg, color: s.color }}>
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  );
}

const STAT_DEFS = [
  {
    key: 'totalUsers',
    label: 'Total Users',
    iconBg: 'rgba(59,130,246,.12)',
    iconColor: '#1d4ed8',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    valClass: '',
  },
  {
    key: 'totalProducts',
    label: 'Products',
    iconBg: 'rgba(139,92,246,.12)',
    iconColor: '#7c3aed',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
    ),
    valClass: '',
  },
  {
    key: 'totalOrders',
    label: 'Total Orders',
    iconBg: 'rgba(16,185,129,.12)',
    iconColor: '#059669',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 11 12 14 22 4"/>
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
    ),
    valClass: 'green',
  },
  {
    key: 'totalRevenue',
    label: 'Revenue (KSh)',
    iconBg: 'rgba(230,0,35,.1)',
    iconColor: '#e60023',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
    valClass: 'accent',
    format: (v) => v?.toLocaleString(),
  },
  {
    key: 'pendingOrders',
    label: 'Pending',
    iconBg: 'rgba(245,158,11,.12)',
    iconColor: '#d97706',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    valClass: 'amber',
  },
];

const QUICK_LINKS = [
  {
    href: '/admin/products',
    icon: '📦',
    iconBg: 'rgba(139,92,246,.1)',
    label: 'Products',
    sub: 'Manage listings',
  },
  {
    href: '/admin/orders',
    icon: '🧾',
    iconBg: 'rgba(16,185,129,.1)',
    label: 'Orders',
    sub: 'View & update statuses',
  },
  {
    href: '/admin/users',
    icon: '👥',
    iconBg: 'rgba(59,130,246,.1)',
    label: 'Users',
    sub: 'Manage accounts',
  },
];

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState(null);

  useEffect(() => { injectStyles(); }, []);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) router.push('/');
  }, [user, loading, router]);

  useEffect(() => {
    if (user?.role === 'admin') {
      api.get('/admin/stats').then((r) => setStats(r.data)).catch(() => {});
    }
  }, [user]);

  if (loading || !user) return (
    <div className="ad">
      <div className="ad-center">Loading…</div>
    </div>
  );
  if (user.role !== 'admin') return null;

  return (
    <div className="ad">
      <div className="ad-inner">

        {/* HEADER */}
        <div className="ad-header">
          <div className="ad-header-left">
            <h1 className="ad-title">Dashboard</h1>
            <p className="ad-sub">Welcome back, {user.name?.split(' ')[0]} 👋</p>
          </div>
          <Link href="/upload" className="ad-add-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.8" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5"  y1="12" x2="19" y2="12"/>
            </svg>
            Add product
          </Link>
        </div>

        {/* STAT CARDS */}
        <div className="ad-stats">
          {STAT_DEFS.map((def) => (
            <div key={def.key} className="ad-stat">
              <div className="ad-stat-icon" style={{ background: def.iconBg, color: def.iconColor }}>
                {def.icon}
              </div>
              <p className="ad-stat-label">{def.label}</p>
              <p className={`ad-stat-value ${def.valClass}`}>
                {stats
                  ? (def.format ? def.format(stats[def.key]) : stats[def.key]) ?? '0'
                  : '—'
                }
              </p>
            </div>
          ))}
        </div>

        {/* QUICK LINKS */}
        <div className="ad-links">
          {QUICK_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="ad-link-card">
              <div className="ad-link-icon" style={{ background: link.iconBg }}>
                {link.icon}
              </div>
              <div>
                <p className="ad-link-label">{link.label}</p>
                <p className="ad-link-sub">{link.sub}</p>
              </div>
              <div className="ad-link-arrow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* RECENT ORDERS */}
        {stats?.recentOrders?.length > 0 && (
          <div className="ad-orders-card">
            <div className="ad-orders-head">
              <h2 className="ad-orders-title">Recent Orders</h2>
              <Link href="/admin/orders" className="ad-orders-see-all">
                See all →
              </Link>
            </div>

            <div>
              {stats.recentOrders.map((order) => (
                <Link
                  key={order._id}
                  href={`/orders/${order._id}`}
                  className="ad-order-row"
                >
                  {/* AVATAR */}
                  <div className="ad-order-avatar">
                    {order.user?.avatar
                      ? <img src={order.user.avatar} alt="" />
                      : order.user?.name?.[0]?.toUpperCase()
                    }
                  </div>

                  {/* USER INFO */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p className="ad-order-name">{order.user?.name || 'Guest'}</p>
                    <p className="ad-order-email">{order.user?.email}</p>
                  </div>

                  {/* AMOUNT + STATUS */}
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p className="ad-order-amount">KSh {order.totalAmount?.toLocaleString()}</p>
                    <StatusBadge status={order.status} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* EMPTY ORDERS STATE */}
        {stats && !stats?.recentOrders?.length && (
          <div style={{
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: 20,
            padding: '48px 24px',
            textAlign: 'center',
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'var(--bg-secondary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 14px',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                stroke="var(--text-tertiary)" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
            </div>
            <p style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', marginBottom: 4 }}>
              No orders yet
            </p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              Orders will appear here once customers start purchasing.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}