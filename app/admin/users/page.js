'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap');

  .au * { box-sizing: border-box; margin: 0; padding: 0; }
  .au {
    min-height: 100vh;
    background: var(--bg-tertiary);
    font-family: system-ui, -apple-system, sans-serif;
    color: var(--text-primary);
    padding: 32px 16px 80px;
  }

  .au-inner { max-width: 1000px; margin: 0 auto; animation: auFadeUp .4s ease both; }

  /* HEADER */
  .au-header {
    display: flex; align-items: center;
    justify-content: space-between;
    gap: 12px; margin-bottom: 24px; flex-wrap: wrap;
  }
  .au-title {
    font-family: 'Playfair Display', serif;
    font-size: 26px; font-weight: 900;
    color: var(--text-primary); letter-spacing: -.4px;
  }
  .au-count {
    font-size: 13px; color: var(--text-secondary);
    font-weight: 500; margin-top: 3px;
  }

  /* SEARCH */
  .au-search-wrap {
    position: relative; flex: 1;
    max-width: 320px; min-width: 180px;
  }
  .au-search-icon {
    position: absolute; left: 13px; top: 50%;
    transform: translateY(-50%);
    color: var(--text-tertiary); pointer-events: none;
  }
  .au-search {
    width: 100%; height: 40px;
    background: var(--bg-primary);
    border: 1.5px solid var(--border-color);
    border-radius: 999px;
    padding: 0 16px 0 38px;
    font-size: 13px; color: var(--text-primary);
    font-family: system-ui, sans-serif;
    outline: none;
    transition: border-color .18s, box-shadow .18s;
  }
  .au-search::placeholder { color: var(--text-tertiary); }
  .au-search:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(230,0,35,.1);
  }

  /* TABLE CARD */
  .au-card {
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 24px;
    overflow: hidden;
  }

  /* TABLE HEADER */
  .au-thead {
    display: grid;
    grid-template-columns: 1fr 100px 90px 130px;
    padding: 10px 20px;
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border-color);
    font-size: 10px; font-weight: 700;
    color: var(--text-tertiary);
    text-transform: uppercase; letter-spacing: .6px;
  }

  /* ROW */
  .au-row {
    display: grid;
    grid-template-columns: 1fr 100px 90px 130px;
    align-items: center;
    padding: 13px 20px;
    border-bottom: 1px solid var(--border-color);
    transition: background .15s;
    gap: 8px;
  }
  .au-row:last-child { border-bottom: none; }
  .au-row:hover { background: var(--bg-secondary); }

  /* USER CELL */
  .au-user { display: flex; align-items: center; gap: 12px; min-width: 0; }
  .au-avatar {
    width: 38px; height: 38px; border-radius: 50%;
    background: var(--accent);
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 800; color: #fff;
    overflow: hidden; flex-shrink: 0;
  }
  .au-avatar img { width: 100%; height: 100%; object-fit: cover; }
  .au-name {
    font-size: 13px; font-weight: 700;
    color: var(--text-primary);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .au-email {
    font-size: 11px; color: var(--text-tertiary);
    font-weight: 500; margin-top: 1px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }

  /* ROLE BADGE */
  .au-role {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 10px; border-radius: 999px;
    font-size: 10px; font-weight: 800; letter-spacing: .4px;
  }
  .au-role.admin { background: rgba(230,0,35,.1); color: var(--accent); }
  .au-role.user  { background: var(--bg-secondary); color: var(--text-secondary); border: 1px solid var(--border-color); }

  /* DATE */
  .au-date {
    font-size: 11px; color: var(--text-tertiary); font-weight: 500;
  }

  /* ACTIONS */
  .au-actions { display: flex; align-items: center; gap: 6px; justify-content: flex-end; }

  .au-btn {
    padding: 6px 13px; border-radius: 999px;
    font-size: 11px; font-weight: 700;
    cursor: pointer; font-family: inherit;
    transition: background .15s, border-color .15s, color .15s, transform .15s;
    border: 1.5px solid var(--border-color);
    background: transparent; color: var(--text-secondary);
    white-space: nowrap;
    -webkit-tap-highlight-color: transparent;
  }
  .au-btn:hover { border-color: var(--text-secondary); color: var(--text-primary); background: var(--bg-secondary); }
  .au-btn:active { transform: scale(.95); }

  .au-btn.promote {
    border-color: rgba(230,0,35,.3);
    color: var(--accent);
    background: rgba(230,0,35,.05);
  }
  .au-btn.promote:hover { background: rgba(230,0,35,.1); border-color: var(--accent); }

  .au-btn.danger {
    border-color: rgba(230,0,35,.2);
    color: var(--accent);
  }
  .au-btn.danger:hover { background: rgba(230,0,35,.08); border-color: var(--accent); }

  /* EMPTY */
  .au-empty {
    padding: 60px 20px; text-align: center;
  }
  .au-empty-icon {
    width: 56px; height: 56px; border-radius: 50%;
    background: var(--bg-secondary);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 14px;
  }
  .au-empty-title {
    font-size: 15px; font-weight: 700;
    color: var(--text-primary); margin-bottom: 4px;
  }
  .au-empty-sub { font-size: 13px; color: var(--text-secondary); }

  /* CONFIRM MODAL */
  .au-modal-bg {
    position: fixed; inset: 0;
    background: rgba(0,0,0,.45);
    backdrop-filter: blur(4px);
    z-index: 500;
    display: flex; align-items: center; justify-content: center;
    padding: 16px;
    animation: auFadeIn .2s ease;
  }
  .au-modal {
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 24px;
    padding: 28px 26px;
    max-width: 360px; width: 100%;
    animation: auScaleIn .22s cubic-bezier(.34,1.56,.64,1) both;
  }
  .au-modal-icon {
    width: 48px; height: 48px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 16px;
  }
  .au-modal-title {
    font-family: 'Playfair Display', serif;
    font-size: 19px; font-weight: 900;
    color: var(--text-primary); margin-bottom: 7px;
  }
  .au-modal-body { font-size: 14px; color: var(--text-secondary); line-height: 1.6; margin-bottom: 22px; }
  .au-modal-actions { display: flex; gap: 10px; }
  .au-modal-cancel {
    flex: 1; height: 44px; border-radius: 999px;
    border: 1.5px solid var(--border-color);
    background: transparent; color: var(--text-primary);
    font-size: 14px; font-weight: 600;
    cursor: pointer; font-family: inherit;
    transition: background .15s;
  }
  .au-modal-cancel:hover { background: var(--bg-secondary); }
  .au-modal-confirm {
    flex: 1; height: 44px; border-radius: 999px;
    border: none; font-size: 14px; font-weight: 700;
    cursor: pointer; font-family: inherit;
    transition: background .18s, transform .18s;
  }
  .au-modal-confirm:hover { transform: translateY(-1px); }
  .au-modal-confirm.red { background: var(--accent); color: #fff; }
  .au-modal-confirm.red:hover { background: #ad081b; }
  .au-modal-confirm.blue { background: #2563eb; color: #fff; }
  .au-modal-confirm.blue:hover { background: #1d4ed8; }

  @keyframes auFadeUp  { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes auFadeIn  { from { opacity: 0; } to { opacity: 1; } }
  @keyframes auScaleIn { from { opacity: 0; transform: scale(.92); } to { opacity: 1; transform: scale(1); } }

  /* RESPONSIVE */
  @media (max-width: 700px) {
    .au-thead { display: none; }
    .au-row {
      grid-template-columns: 1fr auto;
      grid-template-rows: auto auto;
      gap: 8px;
    }
    .au-user  { grid-column: 1; grid-row: 1; }
    .au-role  { grid-column: 2; grid-row: 1; align-self: start; }
    .au-date  { grid-column: 1; grid-row: 2; font-size: 10px; }
    .au-actions { grid-column: 2; grid-row: 2; }
    .au { padding: 20px 12px 60px; }
    .au-title { font-size: 22px; }
  }
  @media (max-width: 400px) {
    .au-btn { padding: 5px 10px; font-size: 10px; }
  }
`;

function injectStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('au-styles')) return;
  const s = document.createElement('style');
  s.id = 'au-styles';
  s.textContent = STYLES;
  document.head.appendChild(s);
}

function ConfirmModal({ title, body, confirmLabel, confirmClass, icon, onConfirm, onCancel }) {
  return (
    <div className="au-modal-bg" onClick={onCancel}>
      <div className="au-modal" onClick={(e) => e.stopPropagation()}>
        <div className="au-modal-icon" style={{
          background: confirmClass === 'red' ? 'rgba(230,0,35,.1)' : 'rgba(37,99,235,.1)',
        }}>
          {icon}
        </div>
        <h2 className="au-modal-title">{title}</h2>
        <p className="au-modal-body">{body}</p>
        <div className="au-modal-actions">
          <button className="au-modal-cancel" onClick={onCancel}>Cancel</button>
          <button className={`au-modal-confirm ${confirmClass}`} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminUsersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers]     = useState([]);
  const [fetching, setFetching] = useState(true);
  const [search, setSearch]   = useState('');
  const [modal, setModal]     = useState(null); // { type, userId, currentRole }

  useEffect(() => { injectStyles(); }, []);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) router.push('/');
  }, [user, loading, router]);

  useEffect(() => {
    if (user?.role === 'admin') {
      api.get('/admin/users')
        .then((r) => setUsers(r.data))
        .finally(() => setFetching(false));
    }
  }, [user]);

  const confirmToggleRole = (id, currentRole) => {
    setModal({ type: 'role', userId: id, currentRole });
  };

  const confirmDelete = (id, name) => {
    setModal({ type: 'delete', userId: id, name });
  };

  const handleConfirm = async () => {
    if (!modal) return;
    if (modal.type === 'role') {
      const newRole = modal.currentRole === 'admin' ? 'user' : 'admin';
      const { data } = await api.put(`/admin/users/${modal.userId}/role`, { role: newRole });
      setUsers((prev) => prev.map((u) => u._id === modal.userId ? data : u));
    } else if (modal.type === 'delete') {
      await api.delete(`/admin/users/${modal.userId}`);
      setUsers((prev) => prev.filter((u) => u._id !== modal.userId));
    }
    setModal(null);
  };

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return !q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
  });

  if (loading || fetching) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: 'var(--text-tertiary)', fontFamily: 'system-ui', fontSize: 14 }}>
      Loading…
    </div>
  );

  return (
    <div className="au">
      <div className="au-inner">

        {/* HEADER */}
        <div className="au-header">
          <div>
            <h1 className="au-title">Users</h1>
            <p className="au-count">{users.length} account{users.length !== 1 ? 's' : ''} registered</p>
          </div>

          {/* SEARCH */}
          <div className="au-search-wrap">
            <span className="au-search-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </span>
            <input
              className="au-search"
              placeholder="Search users…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="au-card">

          {/* THEAD */}
          <div className="au-thead">
            <span>User</span>
            <span>Role</span>
            <span>Joined</span>
            <span style={{ textAlign: 'right' }}>Actions</span>
          </div>

          {filtered.length > 0 ? filtered.map((u) => (
            <div key={u._id} className="au-row">

              {/* USER */}
              <div className="au-user">
                <div className="au-avatar">
                  {u.avatar
                    ? <img src={u.avatar} alt="" />
                    : u.name?.[0]?.toUpperCase()
                  }
                </div>
                <div style={{ minWidth: 0 }}>
                  <p className="au-name">{u.name}</p>
                  <p className="au-email">{u.email}</p>
                </div>
              </div>

              {/* ROLE */}
              <div>
                <span className={`au-role ${u.role}`}>
                  {u.role === 'admin' && (
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                  )}
                  {u.role}
                </span>
              </div>

              {/* DATE */}
              <p className="au-date">
                {new Date(u.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'short', day: 'numeric',
                })}
              </p>

              {/* ACTIONS */}
              <div className="au-actions">
                <button
                  className={`au-btn ${u.role === 'admin' ? '' : 'promote'}`}
                  onClick={() => confirmToggleRole(u._id, u.role)}
                >
                  {u.role === 'admin' ? 'Demote' : 'Make admin'}
                </button>
                <button
                  className="au-btn danger"
                  onClick={() => confirmDelete(u._id, u.name)}
                >
                  Delete
                </button>
              </div>
            </div>
          )) : (
            <div className="au-empty">
              <div className="au-empty-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke="var(--text-tertiary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <p className="au-empty-title">
                {search ? `No users matching "${search}"` : 'No users yet'}
              </p>
              <p className="au-empty-sub">
                {search ? 'Try a different search term' : 'Users will appear here once they register.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* CONFIRM MODAL */}
      {modal?.type === 'role' && (
        <ConfirmModal
          title={modal.currentRole === 'admin' ? 'Remove admin access?' : 'Grant admin access?'}
          body={
            modal.currentRole === 'admin'
              ? 'This user will lose all admin privileges and become a regular user.'
              : 'This user will gain full admin access to the dashboard, products, and orders.'
          }
          confirmLabel={modal.currentRole === 'admin' ? 'Demote' : 'Make admin'}
          confirmClass={modal.currentRole === 'admin' ? 'red' : 'blue'}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke={modal.currentRole === 'admin' ? '#e60023' : '#2563eb'}
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          }
          onConfirm={handleConfirm}
          onCancel={() => setModal(null)}
        />
      )}

      {modal?.type === 'delete' && (
        <ConfirmModal
          title="Delete user?"
          body={`"${modal.name}" will be permanently deleted. This action cannot be undone.`}
          confirmLabel="Delete"
          confirmClass="red"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="#e60023" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6M14 11v6"/>
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          }
          onConfirm={handleConfirm}
          onCancel={() => setModal(null)}
        />
      )}
    </div>
  );
}