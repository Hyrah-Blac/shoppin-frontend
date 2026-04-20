'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap');

  .ap * { box-sizing: border-box; margin: 0; padding: 0; }
  .ap {
    min-height: 100vh;
    background: var(--bg-tertiary);
    font-family: system-ui, -apple-system, sans-serif;
    color: var(--text-primary);
    padding: 32px 16px 80px;
  }

  .ap-inner { max-width: 1100px; margin: 0 auto; animation: apFadeUp .4s ease both; }

  /* HEADER */
  .ap-header {
    display: flex; align-items: center;
    justify-content: space-between;
    gap: 12px; margin-bottom: 22px; flex-wrap: wrap;
  }
  .ap-title {
    font-family: 'Playfair Display', serif;
    font-size: 26px; font-weight: 900;
    color: var(--text-primary); letter-spacing: -.4px;
  }
  .ap-count { font-size: 13px; color: var(--text-secondary); margin-top: 3px; }

  .ap-header-right { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

  /* SEARCH */
  .ap-search-wrap { position: relative; }
  .ap-search-icon {
    position: absolute; left: 13px; top: 50%;
    transform: translateY(-50%);
    color: var(--text-tertiary); pointer-events: none;
  }
  .ap-search {
    height: 40px; width: 220px;
    background: var(--bg-primary);
    border: 1.5px solid var(--border-color);
    border-radius: 999px;
    padding: 0 16px 0 38px;
    font-size: 13px; color: var(--text-primary);
    font-family: system-ui, sans-serif; outline: none;
    transition: border-color .18s, box-shadow .18s;
  }
  .ap-search::placeholder { color: var(--text-tertiary); }
  .ap-search:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(230,0,35,.1); }

  /* ADD BTN */
  .ap-add-btn {
    display: inline-flex; align-items: center; gap: 7px;
    background: var(--accent); color: #fff;
    padding: 10px 20px; border-radius: 999px;
    font-size: 13px; font-weight: 700;
    text-decoration: none;
    box-shadow: 0 3px 12px rgba(230,0,35,.25);
    transition: background .18s, transform .18s;
    white-space: nowrap;
    -webkit-tap-highlight-color: transparent;
  }
  .ap-add-btn:hover { background: #ad081b; transform: translateY(-1px); }

  /* TABLE */
  .ap-card {
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 24px; overflow: hidden;
  }

  .ap-thead {
    display: grid;
    grid-template-columns: 56px 1fr 110px 90px 80px 130px;
    padding: 10px 20px;
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border-color);
    font-size: 10px; font-weight: 700;
    color: var(--text-tertiary);
    text-transform: uppercase; letter-spacing: .6px;
    gap: 12px; align-items: center;
  }

  .ap-row {
    display: grid;
    grid-template-columns: 56px 1fr 110px 90px 80px 130px;
    align-items: center;
    padding: 12px 20px;
    border-bottom: 1px solid var(--border-color);
    gap: 12px;
    transition: background .15s;
  }
  .ap-row:last-child { border-bottom: none; }
  .ap-row:hover { background: var(--bg-secondary); }

  /* IMAGE */
  .ap-img {
    width: 56px; height: 56px;
    border-radius: 12px; object-fit: cover;
    display: block; background: var(--bg-secondary);
    flex-shrink: 0;
  }

  /* TITLE */
  .ap-prod-title {
    font-size: 13px; font-weight: 700;
    color: var(--text-primary); margin-bottom: 3px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .ap-prod-cat {
    font-size: 11px; color: var(--text-tertiary);
    font-weight: 500; text-transform: capitalize;
  }

  /* PRICE */
  .ap-price {
    font-size: 13px; font-weight: 800;
    color: var(--accent); white-space: nowrap;
  }

  /* STOCK */
  .ap-stock {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 12px; font-weight: 600;
  }
  .ap-stock-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }

  /* ACTIONS */
  .ap-actions { display: flex; align-items: center; gap: 8px; justify-content: flex-end; }

  .ap-btn {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 6px 13px; border-radius: 999px;
    font-size: 11px; font-weight: 700;
    cursor: pointer; font-family: inherit;
    border: 1.5px solid var(--border-color);
    background: transparent; color: var(--text-secondary);
    text-decoration: none;
    transition: background .15s, border-color .15s, color .15s, transform .15s;
    white-space: nowrap;
    -webkit-tap-highlight-color: transparent;
  }
  .ap-btn:hover { border-color: var(--text-secondary); color: var(--text-primary); background: var(--bg-secondary); }
  .ap-btn:active { transform: scale(.95); }
  .ap-btn.danger { border-color: rgba(230,0,35,.25); color: var(--accent); }
  .ap-btn.danger:hover { background: rgba(230,0,35,.07); border-color: var(--accent); }

  /* EMPTY */
  .ap-empty {
    padding: 60px 20px; text-align: center;
  }
  .ap-empty-icon {
    width: 56px; height: 56px; border-radius: 50%;
    background: var(--bg-secondary);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 14px;
  }
  .ap-empty-title { font-size: 15px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px; }
  .ap-empty-sub   { font-size: 13px; color: var(--text-secondary); margin-bottom: 20px; }
  .ap-empty-btn {
    display: inline-flex; align-items: center; gap: 6px;
    background: var(--accent); color: #fff;
    padding: 10px 22px; border-radius: 999px;
    font-size: 13px; font-weight: 700; text-decoration: none;
    box-shadow: 0 3px 12px rgba(230,0,35,.25);
    transition: background .18s, transform .18s;
  }
  .ap-empty-btn:hover { background: #ad081b; transform: translateY(-1px); }

  /* CONFIRM MODAL */
  .ap-modal-bg {
    position: fixed; inset: 0;
    background: rgba(0,0,0,.45);
    backdrop-filter: blur(4px);
    z-index: 500;
    display: flex; align-items: center; justify-content: center;
    padding: 16px;
    animation: apFadeIn .2s ease;
  }
  .ap-modal {
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 24px; padding: 28px 26px;
    max-width: 360px; width: 100%;
    animation: apScaleIn .22s cubic-bezier(.34,1.56,.64,1) both;
  }
  .ap-modal-icon {
    width: 48px; height: 48px; border-radius: 50%;
    background: rgba(230,0,35,.1);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 16px;
  }
  .ap-modal-title {
    font-family: 'Playfair Display', serif;
    font-size: 19px; font-weight: 900;
    color: var(--text-primary); margin-bottom: 7px;
  }
  .ap-modal-body { font-size: 14px; color: var(--text-secondary); line-height: 1.6; margin-bottom: 22px; }
  .ap-modal-actions { display: flex; gap: 10px; }
  .ap-modal-cancel {
    flex: 1; height: 44px; border-radius: 999px;
    border: 1.5px solid var(--border-color);
    background: transparent; color: var(--text-primary);
    font-size: 14px; font-weight: 600;
    cursor: pointer; font-family: inherit;
    transition: background .15s;
  }
  .ap-modal-cancel:hover { background: var(--bg-secondary); }
  .ap-modal-delete {
    flex: 1; height: 44px; border-radius: 999px;
    border: none; background: var(--accent); color: #fff;
    font-size: 14px; font-weight: 700;
    cursor: pointer; font-family: inherit;
    transition: background .18s, transform .18s;
  }
  .ap-modal-delete:hover { background: #ad081b; transform: translateY(-1px); }

  @keyframes apFadeUp  { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes apFadeIn  { from { opacity: 0; } to { opacity: 1; } }
  @keyframes apScaleIn { from { opacity: 0; transform: scale(.92); } to { opacity: 1; transform: scale(1); } }

  /* RESPONSIVE */
  @media (max-width: 800px) {
    .ap-thead { display: none; }
    .ap-row {
      grid-template-columns: 56px 1fr auto;
      grid-template-rows: auto auto;
      gap: 8px;
    }
    .ap-img   { grid-column: 1; grid-row: 1 / 3; }
    .ap-info  { grid-column: 2; grid-row: 1; }
    .ap-price { grid-column: 3; grid-row: 1; text-align: right; }
    .ap-stock-cell  { grid-column: 2; grid-row: 2; }
    .ap-actions { grid-column: 3; grid-row: 2; justify-content: flex-end; }
    .ap-search { width: 160px; }
    .ap { padding: 20px 12px 60px; }
  }
  @media (max-width: 420px) {
    .ap-search { display: none; }
    .ap-title { font-size: 22px; }
  }
`;

function injectStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('ap-styles')) return;
  const s = document.createElement('style');
  s.id = 'ap-styles';
  s.textContent = STYLES;
  document.head.appendChild(s);
}

export default function AdminProductsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [products, setProducts]   = useState([]);
  const [fetching, setFetching]   = useState(true);
  const [search, setSearch]       = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => { injectStyles(); }, []);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) router.push('/');
  }, [user, loading, router]);

  useEffect(() => {
    if (user?.role === 'admin') {
      api.get('/products?limit=100')
        .then((r) => setProducts(r.data.products || []))
        .finally(() => setFetching(false));
    }
  }, [user]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await api.delete(`/products/${deleteTarget._id}`);
    setProducts((prev) => prev.filter((p) => p._id !== deleteTarget._id));
    setDeleteTarget(null);
  };

  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    return !q || p.title?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q);
  });

  if (loading || fetching) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: 'var(--text-tertiary)', fontFamily: 'system-ui', fontSize: 14 }}>
      Loading…
    </div>
  );

  return (
    <div className="ap">
      <div className="ap-inner">

        {/* HEADER */}
        <div className="ap-header">
          <div>
            <h1 className="ap-title">Products</h1>
            <p className="ap-count">{products.length} listing{products.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="ap-header-right">
            {/* SEARCH */}
            <div className="ap-search-wrap">
              <span className="ap-search-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </span>
              <input
                className="ap-search"
                placeholder="Search products…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* ADD */}
            <Link href="/admin/products/new" className="ap-add-btn">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.8" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5"  y1="12" x2="19" y2="12"/>
              </svg>
              Add product
            </Link>
          </div>
        </div>

        {/* TABLE */}
        <div className="ap-card">

          {/* THEAD */}
          <div className="ap-thead">
            <span></span>
            <span>Product</span>
            <span>Price</span>
            <span>Stock</span>
            <span></span>
            <span style={{ textAlign: 'right' }}>Actions</span>
          </div>

          {filtered.length > 0 ? filtered.map((p) => {
            const inStock = (p.stock ?? 0) > 0;
            return (
              <div key={p._id} className="ap-row">

                {/* IMAGE */}
                {p.images?.[0]?.url
                  ? <img className="ap-img" src={p.images[0].url} alt={p.title} />
                  : <div className="ap-img" />
                }

                {/* INFO */}
                <div className="ap-info" style={{ minWidth: 0 }}>
                  <p className="ap-prod-title">{p.title}</p>
                  <p className="ap-prod-cat">{p.category}</p>
                </div>

                {/* PRICE */}
                <p className="ap-price">KSh {p.price?.toLocaleString()}</p>

                {/* STOCK */}
                <div className="ap-stock-cell">
                  <span className="ap-stock" style={{ color: inStock ? '#059669' : 'var(--accent)' }}>
                    <span
                      className="ap-stock-dot"
                      style={{
                        background: inStock ? '#059669' : 'var(--accent)',
                        boxShadow: inStock ? '0 0 0 2px rgba(5,150,105,.15)' : '0 0 0 2px rgba(230,0,35,.15)',
                      }}
                    />
                    {inStock ? `${p.stock} left` : 'Out of stock'}
                  </span>
                </div>

                {/* SPACER */}
                <div />

                {/* ACTIONS */}
                <div className="ap-actions">
                  <Link href={`/admin/products/${p._id}`} className="ap-btn">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Edit
                  </Link>
                  <button
                    className="ap-btn danger"
                    onClick={() => setDeleteTarget(p)}
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                      <path d="M10 11v6M14 11v6"/>
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            );
          }) : (
            <div className="ap-empty">
              <div className="ap-empty-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke="var(--text-tertiary)" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
              </div>
              <p className="ap-empty-title">
                {search ? `No results for "${search}"` : 'No products yet'}
              </p>
              <p className="ap-empty-sub">
                {search ? 'Try a different search term' : 'Add your first product to get started.'}
              </p>
              {!search && (
                <Link href="/admin/products/new" className="ap-empty-btn">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.8" strokeLinecap="round">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5"  y1="12" x2="19" y2="12"/>
                  </svg>
                  Add first product
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* DELETE CONFIRM MODAL */}
      {deleteTarget && (
        <div className="ap-modal-bg" onClick={() => setDeleteTarget(null)}>
          <div className="ap-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ap-modal-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M10 11v6M14 11v6"/>
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
              </svg>
            </div>
            <h2 className="ap-modal-title">Delete product?</h2>
            <p className="ap-modal-body">
              <strong style={{ color: 'var(--text-primary)' }}>{deleteTarget.title}</strong> will be permanently removed. This cannot be undone.
            </p>
            <div className="ap-modal-actions">
              <button className="ap-modal-cancel" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="ap-modal-delete" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}