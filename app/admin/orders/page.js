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

  /* HEADER ACTIONS */
  .ao-header-actions {
    display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
  }
  .ao-btn-danger {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 16px; border-radius: 999px;
    background: rgba(230,0,35,.1); color: #e60023;
    border: 1.5px solid rgba(230,0,35,.25);
    font-size: 12px; font-weight: 700;
    cursor: pointer; font-family: inherit;
    transition: background .18s, border-color .18s, transform .15s;
    -webkit-tap-highlight-color: transparent;
  }
  .ao-btn-danger:hover { background: rgba(230,0,35,.18); border-color: rgba(230,0,35,.45); }
  .ao-btn-danger:active { transform: scale(.96); }
  .ao-btn-danger:disabled { opacity: .45; cursor: not-allowed; transform: none; }

  .ao-btn-ghost {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 16px; border-radius: 999px;
    background: var(--bg-secondary);
    border: 1.5px solid var(--border-color);
    color: var(--text-primary);
    font-size: 12px; font-weight: 700;
    cursor: pointer; font-family: inherit;
    transition: background .18s, border-color .18s;
    -webkit-tap-highlight-color: transparent;
  }
  .ao-btn-ghost:hover { border-color: var(--text-secondary); background: var(--bg-tertiary); }

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

  /* BULK BAR */
  .ao-bulk-bar {
    display: flex; align-items: center;
    justify-content: space-between; flex-wrap: wrap; gap: 10px;
    background: var(--bg-primary);
    border: 1.5px solid var(--border-color);
    border-radius: 16px; padding: 12px 18px;
    margin-bottom: 14px;
    animation: aoFadeUp .22s ease both;
  }
  .ao-bulk-info {
    font-size: 13px; font-weight: 700; color: var(--text-primary);
  }
  .ao-bulk-info span { color: var(--accent); }
  .ao-bulk-actions { display: flex; gap: 8px; }

  /* TABLE CARD */
  .ao-card {
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 24px; overflow: hidden;
  }

  /* TABLE HEAD */
  .ao-thead {
    display: grid;
    grid-template-columns: 32px 1fr 120px 130px 140px 80px;
    padding: 10px 20px;
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border-color);
    font-size: 10px; font-weight: 700;
    color: var(--text-tertiary);
    text-transform: uppercase; letter-spacing: .6px;
    gap: 8px; align-items: center;
  }

  /* ROW */
  .ao-row {
    display: grid;
    grid-template-columns: 32px 1fr 120px 130px 140px 80px;
    align-items: center;
    padding: 14px 20px;
    border-bottom: 1px solid var(--border-color);
    gap: 8px;
    transition: background .15s;
  }
  .ao-row:last-child { border-bottom: none; }
  .ao-row:hover { background: var(--bg-secondary); }
  .ao-row.selected { background: rgba(230,0,35,.04); }

  /* CHECKBOX */
  .ao-check {
    width: 17px; height: 17px;
    border-radius: 5px;
    border: 1.5px solid var(--border-color);
    background: var(--bg-primary);
    appearance: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    position: relative; flex-shrink: 0;
    transition: border-color .15s, background .15s;
    accent-color: var(--accent);
  }
  .ao-check:checked {
    background: var(--accent); border-color: var(--accent);
  }
  .ao-check:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

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

  /* VIEW / DELETE BUTTONS */
  .ao-icon-btn {
    display: inline-flex; align-items: center; justify-content: center;
    width: 32px; height: 32px; border-radius: 50%;
    border: 1.5px solid var(--border-color);
    color: var(--text-secondary); text-decoration: none;
    background: transparent; cursor: pointer;
    transition: border-color .18s, color .18s, background .18s;
    -webkit-tap-highlight-color: transparent;
    font-family: inherit;
  }
  .ao-icon-btn:hover { border-color: var(--text-secondary); color: var(--text-primary); background: var(--bg-secondary); }
  .ao-icon-btn.danger:hover { border-color: #e60023; color: #e60023; background: rgba(230,0,35,.08); }

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

  /* ── CONFIRM MODAL ── */
  .ao-modal-backdrop {
    position: fixed; inset: 0; z-index: 200;
    background: rgba(0,0,0,.45);
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
    animation: aoFadeIn .18s ease both;
  }
  .ao-modal {
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 24px; padding: 28px 28px 24px;
    max-width: 380px; width: 100%;
    animation: aoSlideUp .22s ease both;
  }
  .ao-modal-icon {
    width: 48px; height: 48px; border-radius: 50%;
    background: rgba(230,0,35,.1);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 16px;
  }
  .ao-modal-title {
    font-family: 'Playfair Display', serif;
    font-size: 19px; font-weight: 900;
    color: var(--text-primary); margin-bottom: 8px;
  }
  .ao-modal-sub {
    font-size: 13px; color: var(--text-secondary);
    line-height: 1.6; margin-bottom: 24px;
  }
  .ao-modal-sub strong { color: var(--text-primary); }
  .ao-modal-actions { display: flex; gap: 8px; justify-content: flex-end; }
  .ao-modal-cancel {
    padding: 9px 20px; border-radius: 999px;
    background: var(--bg-secondary);
    border: 1.5px solid var(--border-color);
    color: var(--text-primary);
    font-size: 13px; font-weight: 700;
    cursor: pointer; font-family: inherit;
    transition: background .18s;
  }
  .ao-modal-cancel:hover { background: var(--bg-tertiary); }
  .ao-modal-confirm {
    padding: 9px 20px; border-radius: 999px;
    background: #e60023; color: #fff;
    border: none;
    font-size: 13px; font-weight: 700;
    cursor: pointer; font-family: inherit;
    transition: background .18s, transform .15s;
  }
  .ao-modal-confirm:hover { background: #ad081b; }
  .ao-modal-confirm:active { transform: scale(.97); }
  .ao-modal-confirm:disabled { opacity: .6; cursor: not-allowed; }

  /* SKELETON */
  @keyframes aoShimmer {
    0%   { background-position: -600px 0; }
    100% { background-position:  600px 0; }
  }
  .ao-skeleton {
    border-radius: 24px;
    background: linear-gradient(90deg,
      var(--bg-secondary) 25%,
      var(--border-color) 50%,
      var(--bg-secondary) 75%
    );
    background-size: 600px 100%;
    animation: aoShimmer 1.4s infinite linear;
  }

  @keyframes aoFadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes aoFadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes aoSlideUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* RESPONSIVE */
  @media (max-width: 800px) {
    .ao-thead { display: none; }
    .ao-row {
      grid-template-columns: 32px 1fr auto;
      grid-template-rows: auto auto auto;
      gap: 6px;
    }
    .ao-user        { grid-column: 2; grid-row: 1; }
    .ao-check-cell  { grid-column: 1; grid-row: 1 / 3; align-self: center; }
    .ao-amount-cell { grid-column: 3; grid-row: 1; text-align: right; }
    .ao-status-cell { grid-column: 2; grid-row: 2; }
    .ao-select-wrap { grid-column: 2; grid-row: 3; max-width: 160px; }
    .ao-actions-cell { grid-column: 3; grid-row: 2 / 4; display: flex; flex-direction: column; align-items: flex-end; justify-content: center; gap: 6px; }
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

/* ── CONFIRM MODAL ── */
function ConfirmModal({ title, message, confirmLabel = 'Delete', onConfirm, onCancel, loading }) {
  return (
    <div className="ao-modal-backdrop" onClick={onCancel} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="ao-modal" onClick={e => e.stopPropagation()}>
        <div className="ao-modal-icon" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="#e60023" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M10 11v6M14 11v6"/>
            <path d="M9 6V4h6v2"/>
          </svg>
        </div>
        <h2 className="ao-modal-title" id="modal-title">{title}</h2>
        <p className="ao-modal-sub" dangerouslySetInnerHTML={{ __html: message }} />
        <div className="ao-modal-actions">
          <button className="ao-modal-cancel" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button className="ao-modal-confirm" onClick={onConfirm} disabled={loading}>
            {loading ? 'Deleting…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── SKELETON ── */
function SkeletonRows() {
  return (
    <div className="ao-card">
      {[1,2,3,4,5].map(i => (
        <div key={i} className="ao-skeleton" style={{ height: 72, borderRadius: 0, borderBottom: '1px solid var(--border-color)' }} />
      ))}
    </div>
  );
}

/* ── MAIN ── */
export default function AdminOrdersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [orders, setOrders]       = useState([]);
  const [filter, setFilter]       = useState('');
  const [fetching, setFetching]   = useState(true);
  const [selected, setSelected]   = useState(new Set());
  const [modal, setModal]         = useState(null); // { type: 'single'|'bulk', id? }
  const [deleting, setDeleting]   = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => { injectStyles(); }, []);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) router.push('/');
  }, [user, loading, router]);

  useEffect(() => {
    if (user?.role !== 'admin') return;
    setFetching(true);
    setSelected(new Set());
    const params = filter ? `?status=${filter}` : '';
    api.get(`/orders${params}`)
      .then(r => setOrders(r.data.orders || []))
      .finally(() => setFetching(false));
  }, [user, filter]);

  /* ── STATUS UPDATE ── */
  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      await api.put(`/orders/${id}/status`, { status });
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
    } finally {
      setUpdatingId(null);
    }
  };

  /* ── SELECTION ── */
  const allIds       = orders.map(o => o._id);
  const allSelected  = allIds.length > 0 && allIds.every(id => selected.has(id));
  const someSelected = allIds.some(id => selected.has(id));

  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(allIds));
  };

  const toggleOne = (id) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  /* ── DELETE SINGLE ── */
  const confirmSingleDelete = (id) => setModal({ type: 'single', id });

  const executeSingleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/orders/${modal.id}`);
      setOrders(prev => prev.filter(o => o._id !== modal.id));
      setSelected(prev => { const n = new Set(prev); n.delete(modal.id); return n; });
    } finally {
      setDeleting(false);
      setModal(null);
    }
  };

  /* ── DELETE BULK ── */
  const confirmBulkDelete = () => setModal({ type: 'bulk' });

  const executeBulkDelete = async () => {
    setDeleting(true);
    try {
      await Promise.all([...selected].map(id => api.delete(`/orders/${id}`)));
      setOrders(prev => prev.filter(o => !selected.has(o._id)));
      setSelected(new Set());
    } finally {
      setDeleting(false);
      setModal(null);
    }
  };

  /* ── MODAL RESOLVE ── */
  const handleModalConfirm = () =>
    modal?.type === 'bulk' ? executeBulkDelete() : executeSingleDelete();

  const modalTitle   = modal?.type === 'bulk'
    ? `Delete ${selected.size} order${selected.size !== 1 ? 's' : ''}?`
    : 'Delete this order?';
  const modalMessage = modal?.type === 'bulk'
    ? `You're about to permanently delete <strong>${selected.size} order${selected.size !== 1 ? 's' : ''}</strong>. This cannot be undone.`
    : 'This order will be <strong>permanently deleted</strong>. This cannot be undone.';

  /* ── RENDER ── */
  if (loading) return null;

  return (
    <div className="ao">
      <div className="ao-inner">

        {/* HEADER */}
        <div className="ao-header">
          <div>
            <h1 className="ao-title">Orders</h1>
            <p className="ao-count">
              {fetching ? 'Loading…' : `${orders.length} order${orders.length !== 1 ? 's' : ''}${filter ? ` · ${filter}` : ''}`}
            </p>
          </div>
        </div>

        {/* FILTER PILLS */}
        <div className="ao-filters" role="group" aria-label="Filter orders by status">
          <button
            className={`ao-filter-btn${filter === '' ? ' active-all' : ''}`}
            onClick={() => setFilter('')}
            aria-pressed={filter === ''}
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
                aria-pressed={isActive}
                style={isActive ? { background: m.bg, color: m.color, border: `1.5px solid ${m.color}` } : {}}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            );
          })}
        </div>

        {/* BULK ACTION BAR — appears when rows are selected */}
        {someSelected && (
          <div className="ao-bulk-bar" role="status" aria-live="polite">
            <p className="ao-bulk-info">
              <span>{selected.size}</span> order{selected.size !== 1 ? 's' : ''} selected
            </p>
            <div className="ao-bulk-actions">
              <button className="ao-btn-ghost" onClick={() => setSelected(new Set())}>
                Clear
              </button>
              <button className="ao-btn-danger" onClick={confirmBulkDelete}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  <path d="M10 11v6M14 11v6"/>
                  <path d="M9 6V4h6v2"/>
                </svg>
                Delete {selected.size} selected
              </button>
            </div>
          </div>
        )}

        {/* TABLE */}
        {fetching ? <SkeletonRows /> : (
          <div className="ao-card">

            {/* THEAD */}
            <div className="ao-thead">
              <input
                type="checkbox"
                className="ao-check"
                checked={allSelected}
                ref={el => { if (el) el.indeterminate = someSelected && !allSelected; }}
                onChange={toggleAll}
                aria-label="Select all orders"
              />
              <span>Customer</span>
              <span>Amount</span>
              <span>Status</span>
              <span>Update status</span>
              <span style={{ textAlign: 'right' }}>Actions</span>
            </div>

            {orders.length > 0 ? orders.map((order) => {
              const sm      = STATUS_MAP[order.status] || STATUS_MAP.pending;
              const isSelected = selected.has(order._id);
              return (
                <div
                  key={order._id}
                  className={`ao-row${isSelected ? ' selected' : ''}`}
                  aria-selected={isSelected}
                >
                  {/* CHECKBOX */}
                  <div className="ao-check-cell">
                    <input
                      type="checkbox"
                      className="ao-check"
                      checked={isSelected}
                      onChange={() => toggleOne(order._id)}
                      aria-label={`Select order ${order._id.slice(-8).toUpperCase()}`}
                    />
                  </div>

                  {/* USER */}
                  <div className="ao-user">
                    <div className="ao-avatar" aria-hidden="true">
                      {order.user?.avatar
                        ? <img src={order.user.avatar} alt="" />
                        : order.user?.name?.[0]?.toUpperCase()
                      }
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p className="ao-user-name">{order.user?.name || 'Guest'}</p>
                      <p className="ao-user-meta">
                        {order.user?.email} · {new Date(order.createdAt).toLocaleDateString('en-KE', { month: 'short', day: 'numeric', year: 'numeric' })}
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
                  <div className="ao-status-cell">
                    <span className="ao-status-badge" style={{ background: sm.bg, color: sm.color }}>
                      {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                    </span>
                  </div>

                  {/* STATUS SELECT */}
                  <div className="ao-select-wrap">
                    <select
                      className="ao-select"
                      value={order.status}
                      disabled={updatingId === order._id}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      aria-label={`Change status for order ${order._id.slice(-8).toUpperCase()}`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>
                    <span className="ao-select-arrow" aria-hidden="true">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </span>
                  </div>

                  {/* ACTIONS: VIEW + DELETE */}
                  <div className="ao-actions-cell" style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
                    <Link
                      href={`/orders/${order._id}`}
                      className="ao-icon-btn"
                      aria-label={`View order ${order._id.slice(-8).toUpperCase()}`}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                    </Link>
                    <button
                      className="ao-icon-btn danger"
                      onClick={() => confirmSingleDelete(order._id)}
                      aria-label={`Delete order ${order._id.slice(-8).toUpperCase()}`}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                        <path d="M10 11v6M14 11v6"/>
                        <path d="M9 6V4h6v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              );
            }) : (
              <div className="ao-empty">
                <div className="ao-empty-icon" aria-hidden="true">
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
                  {filter ? 'Try a different filter.' : 'Orders will appear here once customers start purchasing.'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* CONFIRM MODAL */}
      {modal && (
        <ConfirmModal
          title={modalTitle}
          message={modalMessage}
          onConfirm={handleModalConfirm}
          onCancel={() => !deleting && setModal(null)}
          loading={deleting}
        />
      )}
    </div>
  );
}