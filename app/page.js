'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Masonry from 'react-masonry-css';
import ProductCard from '@/components/ProductCard';
import SkeletonCard from '@/components/SkeletonCard';
import Spinner from '@/components/Spinner';
import { useAuth } from '@/context/AuthContext';

const CATEGORIES = [
  'All', 'Fashion', 'Home decor', 'Beauty',
  'Electronics', 'Jewellery', 'Art', 'Shoes', 'Bags',
];

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const breakpoints = {
  default: 5,
  1400: 4,
  1100: 3,
  700: 2,
  500: 2,
};

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@900&display=swap');

  .masonry-grid { display: flex; gap: 12px; width: 100%; }
  .masonry-col  { display: flex; flex-direction: column; gap: 12px; }

  .hp-cats {
    display: flex;
    gap: 8px;
    padding: 10px 16px;
    overflow-x: auto;
    background: var(--bg-primary);
    border-bottom: 1px solid var(--border-color);
    position: sticky;
    top: 61px;
    z-index: 90;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
  }
  .hp-cats::-webkit-scrollbar { display: none; }

  .hp-cat-btn {
    padding: 8px 18px;
    border-radius: 999px;
    border: none;
    font-size: 13px;
    font-weight: 600;
    white-space: nowrap;
    cursor: pointer;
    font-family: system-ui, -apple-system, sans-serif;
    background: var(--bg-secondary);
    color: var(--text-secondary);
    transition: background .18s, color .18s, transform .15s;
    -webkit-tap-highlight-color: transparent;
    flex-shrink: 0;
  }
  .hp-cat-btn:hover { background: var(--bg-tertiary); color: var(--text-primary); }
  .hp-cat-btn:active { transform: scale(.95); }
  .hp-cat-btn.active { background: var(--text-primary); color: var(--bg-primary); }

  .hp-feed { padding: 16px; }

  /* ERROR */
  .hp-error {
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 20px;
    padding: 36px 24px;
    text-align: center;
    margin-bottom: 20px;
  }
  .hp-error-icon {
    width: 52px; height: 52px;
    border-radius: 50%;
    background: rgba(230,0,35,.1);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 16px;
  }
  .hp-error-title {
    font-size: 16px; font-weight: 700;
    color: var(--text-primary); margin-bottom: 6px;
  }
  .hp-error-sub {
    font-size: 12px; color: var(--text-tertiary);
    margin-bottom: 20px; line-height: 1.6;
  }
  .hp-error-btn {
    padding: 10px 24px;
    background: var(--accent); color: #fff;
    border: none; border-radius: 999px;
    font-size: 14px; font-weight: 700;
    cursor: pointer; font-family: inherit;
    box-shadow: 0 4px 14px rgba(230,0,35,.25);
    transition: background .18s, transform .18s;
  }
  .hp-error-btn:hover { background: #ad081b; transform: translateY(-2px); }

  /* EMPTY */
  .hp-empty {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 100px 20px; text-align: center;
  }
  .hp-empty-icon {
    width: 80px; height: 80px; border-radius: 50%;
    background: var(--bg-secondary);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 20px;
  }
  .hp-empty-title {
    font-family: 'Playfair Display', serif;
    font-size: 22px; font-weight: 900;
    color: var(--text-primary); margin-bottom: 8px;
  }
  .hp-empty-sub {
    font-size: 14px; color: var(--text-secondary);
    margin-bottom: 28px; line-height: 1.6; max-width: 260px;
  }
  .hp-empty-btn {
    display: inline-flex; align-items: center; gap: 7px;
    background: var(--accent); color: #fff;
    padding: 13px 28px; border-radius: 999px;
    font-weight: 700; font-size: 14px;
    text-decoration: none; font-family: inherit;
    box-shadow: 0 4px 18px rgba(230,0,35,.25);
    transition: background .18s, transform .18s;
  }
  .hp-empty-btn:hover { background: #ad081b; transform: translateY(-2px); }

  /* END */
  .hp-end {
    display: flex; align-items: center; gap: 12px;
    padding: 28px 0;
    color: var(--text-tertiary);
    font-size: 13px; font-weight: 500;
  }
  .hp-end::before, .hp-end::after {
    content: ''; flex: 1;
    height: 1px; background: var(--border-color);
  }

  /* FALLBACK */
  .hp-fallback {
    display: flex; align-items: center; justify-content: center;
    min-height: 50vh;
    color: var(--text-tertiary);
    font-family: system-ui, sans-serif; font-size: 14px;
  }

  /* RESPONSIVE */
  @media (max-width: 700px) {
    .masonry-grid { gap: 8px; }
    .masonry-col  { gap: 8px; }
    .hp-feed { padding: 10px; }
    .hp-cats { top: 57px; padding: 8px 12px; }
  }
  @media (max-width: 360px) {
    .hp-cat-btn { padding: 7px 14px; font-size: 12px; }
    .hp-feed { padding: 8px; }
  }
`;

function injectStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('hp-styles')) return;
  const s = document.createElement('style');
  s.id = 'hp-styles';
  s.textContent = STYLES;
  document.head.appendChild(s);
}

function Feed() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [products, setProducts]       = useState([]);
  const [page, setPage]               = useState(1);
  const [hasMore, setHasMore]         = useState(true);
  const [loading, setLoading]         = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError]             = useState('');
  const [category, setCategory]       = useState('All');

  const searchParams = useSearchParams();
  const search = searchParams.get('search') || '';

  useEffect(() => { injectStyles(); }, []);

  const fetchProducts = useCallback(async (reset = false) => {
    if (loading) return;
    setLoading(true);
    setError('');
    try {
      const p = reset ? 1 : page;
      const params = new URLSearchParams({ page: p, limit: 20 });
      if (search) params.append('search', search);
      if (category !== 'All') params.append('category', category.toLowerCase().replace(' ', '-'));

      const res = await fetch(`${API_URL}/products?${params}`);
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();

      setProducts((prev) => reset ? data.products : [...prev, ...data.products]);
      setHasMore(p < data.pages);
      setPage(reset ? 2 : p + 1);
      setInitialLoad(false);
    } catch (err) {
      setError(err.message);
      setInitialLoad(false);
    } finally {
      setLoading(false);
    }
  }, [page, search, category, loading]);

  useEffect(() => {
    setPage(1);
    setProducts([]);
    setHasMore(true);
    setInitialLoad(true);
    fetchProducts(true);
  }, [search, category]);

  useEffect(() => {
    const onScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
        hasMore && !loading
      ) fetchProducts();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [hasMore, loading, fetchProducts]);

  /* ── empty state message ── */
  const emptyMessage = search
    ? `No results for "${search}"`
    : category !== 'All'
      ? `No products in ${category} yet`
      : 'Nothing here yet';

  const emptySub = search
    ? 'Try a different keyword or browse all categories'
    : category !== 'All'
      ? `Check back later or explore other categories`
      : isAdmin
        ? 'Upload your first product to get started'
        : 'Check back soon for new arrivals';

  return (
    <div>

      {/* CATEGORY PILLS */}
      <div className="hp-cats" role="tablist" aria-label="Product categories">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            role="tab"
            aria-selected={category === c}
            className={`hp-cat-btn${category === c ? ' active' : ''}`}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="hp-feed">

        {/* ERROR */}
        {error && (
          <div className="hp-error">
            <div className="hp-error-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8"  x2="12"   y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <p className="hp-error-title">Couldn't load products</p>
            <p className="hp-error-sub">
              {error}<br/>
              <span style={{ opacity: .7 }}>API: {API_URL}</span>
            </p>
            <button className="hp-error-btn" onClick={() => fetchProducts(true)}>
              Try again
            </button>
          </div>
        )}

        {/* MASONRY */}
        <Masonry
          breakpointCols={breakpoints}
          className="masonry-grid"
          columnClassName="masonry-col"
        >
          {initialLoad && Array.from({ length: 20 }).map((_, i) => (
            <SkeletonCard key={`sk-${i}`} />
          ))}
          {!initialLoad && products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </Masonry>

        {/* PAGINATION SPINNER */}
        {loading && !initialLoad && (
          <div style={{ padding: '24px 0' }}>
            <Spinner />
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && !initialLoad && products.length === 0 && (
          <div className="hp-empty">
            <div className="hp-empty-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                stroke="var(--text-tertiary)" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M3 9h18M9 21V9"/>
              </svg>
            </div>
            <h2 className="hp-empty-title">{emptyMessage}</h2>
            <p className="hp-empty-sub">{emptySub}</p>

            {/* Only show upload CTA to admins */}
            {isAdmin && (
              <a href="/upload" className="hp-empty-btn">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5"  y1="12" x2="19" y2="12"/>
                </svg>
                Upload first product
              </a>
            )}
          </div>
        )}

        {/* ALL CAUGHT UP */}
        {!hasMore && products.length > 0 && !loading && (
          <p className="hp-end">You&rsquo;re all caught up</p>
        )}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="hp-fallback">Loading…</div>}>
      <Feed />
    </Suspense>
  );
}