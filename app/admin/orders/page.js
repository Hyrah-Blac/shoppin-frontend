'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

const STATUSES = ['pending','confirmed','shipped','delivered','cancelled'];

const STATUS_MAP = {
  pending:   { color: '#d97706', bg: 'rgba(245,158,11,.12)'  },
  confirmed: { color: '#1d4ed8', bg: 'rgba(59,130,246,.12)'  },
  shipped:   { color: '#7c3aed', bg: 'rgba(139,92,246,.12)'  },
  delivered: { color: '#059669', bg: 'rgba(16,185,129,.12)'  },
  cancelled: { color: '#e60023', bg: 'rgba(230,0,35,.1)'     },
};

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap');

  .ao * { box-sizing: border-box; margin: 0; padding: 0; }
  .ao {
    min-height: 100vh;
    background: var(--bg-tertiary);
    font-family: system-ui, -apple-system, sans-serif;
    color: var(--text-primary);
    padding: 32px 16px 80px;
  }

  .ao-inner { max-width: 1100px; margin: 0 auto; animation: aoFadeUp .4s ease both; }

  /* HEADER */
  .ao-header {
    display: flex; align-items: center;
    justify-content: space-between;
    gap: 12px; margin-bottom: 22px; flex-wrap: wrap;
  }
  .ao-title {
    font-family: 'Playfair Display', serif;
    font-size: 26px; font-weight: 900;
    color: var(--text-primary); letter-spacing: -.4px;
  }
  .ao-count { font-size: 13px; color: var(--text-secondary); margin-top: 3px; }

  /* FILTER PILLS */
  .ao-filters {
    display: flex; gap: 8px; flex-wrap: wrap;
    margin-bottom: 20px;
  }
  .ao-filter-btn {
    padding: 7px 16px; border-radius: 999px; border: none;
    font-size: 12px; font-weight: 700;
    cursor: pointer; font-family: inherit;
    background: var(--bg-secondary); color: var(--text-secondary);
    transition: background .18s, color .18s, transform .15s;
    -webkit-tap-highlight-color: transparent;
  }
  .ao-filter-btn:hover { background: var(--bg-tertiary); color: var(--text-primary); }
  .ao-filter-btn:active { transform: scale(.95); }
  .ao-filter-btn.active-all { background: var(--text-primary); color: var(--bg-primary); }

  /* TABLE CARD */
  .ao-card {
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 24px; overflow: hidden;
  }

  /* TABLE HEAD */
  .ao-thead {
    display: grid;
    grid-template-columns: 1fr 120px 130px 140px 80px;
    padding: 10px 20px;
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border-color);
    font-size: 10px; font-weight: 700;
    color: var(--text-tertiary);
    text-transform: uppercase; letter-spacing: .6px;
    gap: 8px;
  }

  /* ROW */
  .ao-row {
    display: grid;
    grid-template-columns: 1fr 120px 130px 140px 80px;
    align-items: center;
    padding: 14px 20px;
    border-bottom: 1px solid var(--border-color);
    gap: 8px;
    transition: background .15s;
  }
  .ao-row:last-child { border-bottom: none; }
  .ao-row:hover { background: var(--bg-secondary); }

  /* USER CELL */
  .ao-user { display: flex; align-items: center; gap: 11px; min-width: 0; }
  .ao-avatar {
    width: 36px; height: 36px; border-radius: 50%;
    background: var(--accent);
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 800; color: #fff;
    overflow: hidden; flex-shrink: 0;
  }
  .ao-avatar img { width: 100%; height: 100%; object-fit: cover; }
  .ao-user-name {
    font-size: 13px; font-weight: 700; color: var(--text-primary);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    margin-bottom: 2px;
  }
  .ao-user-meta {
    font-size: 11px; color: var(--text-tertiary); font-weight: 500;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }

  /* AMOUNT */
  .ao-amount { font-size: 14px; font-weight: 800; color: var(--text-primary); }
  .ao-payment {
    font-size: 10px; font-weight: 700;
    margin-top: 3px; letter-spacing: .3px;
  }
  .ao-payment.paid    { color: #059669; }
  .ao-payment.pending { color: #d97706; }

  /* STATUS BADGE */
  .ao-status-badge {
    display: inline-block;
    font-size: 10px; font-weight: 700;
    padding: 3px 9px; border-radius: 999px;
    letter-spacing: .3px; white-space: nowrap;
  }

  /* STATUS SELECT */
  .ao-select-wrap { position: relative; }
  .ao-select {
    width: 100%; height: 34px;
    border-radius: 999px;
    font-size: 11px; font-weight: 700;
    outline: none; cursor: pointer;
    font-family: inherit; padding: 0 28px 0 12px;
    appearance: none;
    transition: box-shadow .18s;
    background: var(--bg-secondary);
    border: 1.5px solid var(--border-color);
    color: var(--text-primary);
  }
  .ao-select:focus { box-shadow: 0 0 0 3px rgba(230,0,35,.1); border-color: var(--accent); }
  .ao-select-arrow {
    position: absolute; right: 10px; top: 50%;
    transform: translateY(-50%);
    pointer-events: none; color: var(--text-tertiary);
  }

  /* VIEW LINK */
  .ao-view {
    display: inline-flex; align-items: center; justify-content: center;
    width: 32px; height: 32px; border-radius: 50%;
    border: 1.5px solid var(--border-color);
    color: var(--text-secondary); text-decoration: none;
    transition: border-color .18s, color .18s, background .18s;
    -webkit-tap-highlight-color: transparent;
  }
  .ao-view:hover { border-color: var(--text-secondary); color: var(--text-primary); background: var(--bg-secondary); }

  /* EMPTY */
  .ao-empty {
    padding: 60px 20px; text-align: center;
  }
  .ao-empty-icon {
    width: 56px; height: 56px; border-radius: 50%;
    background: var(--bg-secondary);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 14px;
  }
  .ao-empty-title { font-size: 15px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px; }
  .ao-empty-sub   { font-size: 13px; color: var(--text-secondary); }

  @keyframes aoFadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* RESPONSIVE */
  @media (max-width: 800px) {
    .ao-thead { display: none; }
    .ao-row {
      grid-template-columns: 1fr auto;
      grid-template-rows: auto auto auto;
      gap: 6px;
    }
    .ao-user    { grid-column: 1; grid-row: 1; }
    .ao-amount-cell { grid-column: 2; grid-row: 1; text-align: right; }
    .ao-select-wrap { grid-column: 1; grid-row: 2; max-width: 160px; }
    .ao-view-cell { grid-column: 2; grid-row: 2; display: flex; justify-content: flex-end; }
    .ao { padding: 20px 12px 60px; }
    .ao-title { font-size: 22px; }
  }
  @media (max-width: 400px) {
    .ao-row { padding: 12px 14px; }
  }
`;

function injectStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('ao-styles')) return;
  const s = document.createElement('style');
  s.id = 'ao-styles';
  s.textContent = STYLES;
  document.head.appendChild(s);
}

export default function AdminOrdersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders]   = useState([]);
  const [filter, setFilter]   = useState('');
  const [fetching, setFetching] = useState(true);

  useEffect(() => { injectStyles(); }, []);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) router.push('/');
  }, [user, loading, router]);

  useEffect(() => {
    if (user?.role === 'admin') {
      setFetching(true);
      const params = filter ? `?status=${filter}` : '';
      api.get(`/orders${params}`)
        .then((r) => setOrders(r.data.orders || []))
        .finally(() => setFetching(false));
    }
  }, [user, filter]);

  const updateStatus = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status });
    setOrders((prev) => prev.map((o) => o._id === id ? { ...o, status } : o));
  };

  if (loading || fetching) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: 'var(--text-tertiary)', fontFamily: 'system-ui', fontSize: 14 }}>
      Loading…
    </div>
  );

  return (
    <div className="ao">
      <div className="ao-inner">

        {/* HEADER */}
        <div className="ao-header">
          <div>
            <h1 className="ao-title">Orders</h1>
            <p className="ao-count">{orders.length} order{orders.length !== 1 ? 's' : ''}{filter ? ` · ${filter}` : ''}</p>
          </div>
        </div>

        {/* FILTER PILLS */}
        <div className="ao-filters">
          <button
            className={`ao-filter-btn${filter === '' ? ' active-all' : ''}`}
            onClick={() => setFilter('')}
          >
            All
          </button>
          {STATUSES.map((s) => {
            const m = STATUS_MAP[s];
            const isActive = filter === s;
            return (
              <button
                key={s}
                className="ao-filter-btn"
                onClick={() => setFilter(s)}
                style={isActive ? { background: m.bg, color: m.color, border: `1.5px solid ${m.color}` } : {}}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            );
          })}
        </div>

        {/* TABLE */}
        <div className="ao-card">

          {/* THEAD */}
          <div className="ao-thead">
            <span>Customer</span>
            <span>Amount</span>
            <span>Status</span>
            <span>Update status</span>
            <span style={{ textAlign: 'right' }}>View</span>
          </div>

          {orders.length > 0 ? orders.map((order) => {
            const sm = STATUS_MAP[order.status] || STATUS_MAP.pending;
            return (
              <div key={order._id} className="ao-row">

                {/* USER */}
                <div className="ao-user">
                  <div className="ao-avatar">
                    {order.user?.avatar
                      ? <img src={order.user.avatar} alt="" />
                      : order.user?.name?.[0]?.toUpperCase()
                    }
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p className="ao-user-name">{order.user?.name || 'Guest'}</p>
                    <p className="ao-user-meta">
                      {order.user?.email} · {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                {/* AMOUNT */}
                <div className="ao-amount-cell">
                  <p className="ao-amount">KSh {order.totalAmount?.toLocaleString()}</p>
                  <p className={`ao-payment ${order.paymentStatus === 'paid' ? 'paid' : 'pending'}`}>
                    {order.paymentStatus === 'paid' ? '✓ Paid' : 'Pending'}
                  </p>
                </div>

                {/* STATUS BADGE */}
                <div>
                  <span className="ao-status-badge" style={{ background: sm.bg, color: sm.color }}>
                    {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                  </span>
                </div>

                {/* STATUS SELECT */}
                <div className="ao-select-wrap">
                  <select
                    className="ao-select"
                    value={order.status}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                  <span className="ao-select-arrow">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </span>
                </div>

                {/* VIEW */}
                <div className="ao-view-cell" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Link href={`/orders/${order._id}`} className="ao-view" aria-label="View order">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </Link>
                </div>
              </div>
            );
          }) : (
            <div className="ao-empty">
              <div className="ao-empty-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke="var(--text-tertiary)" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
              </div>
              <p className="ao-empty-title">
                {filter ? `No ${filter} orders` : 'No orders yet'}
              </p>
              <p className="ao-empty-sub">
                {filter ? 'Try a different filter' : 'Orders will appear here once customers start purchasing.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}