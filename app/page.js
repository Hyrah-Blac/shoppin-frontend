'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Masonry from 'react-masonry-css';
import ProductCard from '@/components/ProductCard';
import SkeletonCard from '@/components/SkeletonCard';
import Spinner from '@/components/Spinner';

const CATEGORIES = ['All', 'Fashion', 'Home decor', 'Beauty', 'Electronics', 'Jewellery', 'Art', 'Shoes', 'Bags'];
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const breakpoints = {
  default: 5,
  1400: 4,
  1100: 3,
  700: 2,
  500: 2,
};

const masonryStyles = `
  .masonry-grid { display: flex; gap: 12px; width: 100%; }
  .masonry-col { display: flex; flex-direction: column; }
`;

function Feed() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('All');

  const searchParams = useSearchParams();
  const search = searchParams.get('search') || '';

  const fetchProducts = useCallback(async (reset = false) => {
    if (loading) return;

    setLoading(true);
    setError('');

    try {
      const p = reset ? 1 : page;

      const params = new URLSearchParams({
        page: p,
        limit: 20,
      });

      if (search) params.append('search', search);

      if (category !== 'All') {
        params.append('category', category.toLowerCase().replace(' ', '-'));
      }

      const res = await fetch(`${API_URL}/products?${params}`);
      if (!res.ok) throw new Error(`Server error ${res.status}`);

      const data = await res.json();

      setProducts((prev) =>
        reset ? data.products : [...prev, ...data.products]
      );

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
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 400 &&
        hasMore &&
        !loading
      ) {
        fetchProducts();
      }
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [hasMore, loading, fetchProducts]);

  return (
    <div>
      <style>{masonryStyles}</style>

      {/* Categories */}
      <div style={{
        display: 'flex',
        gap: 8,
        padding: '12px 16px',
        overflowX: 'auto',
        background: 'var(--bg-primary)',
        borderBottom: '1px solid var(--border-color)',
        position: 'sticky',
        top: 61,
        zIndex: 90,
      }}>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            style={{
              padding: '8px 16px',
              borderRadius: 24,
              border: 'none',
              background: category === c ? '#111' : 'var(--bg-secondary)',
              color: category === c ? '#fff' : 'var(--text-primary)',
              fontSize: 13,
              fontWeight: 500,
              whiteSpace: 'nowrap',
            }}
          >
            {c}
          </button>
        ))}
      </div>

      <div style={{ padding: 16 }}>
        {/* Error */}
        {error && (
          <div style={{
            textAlign: 'center',
            padding: 40,
            color: '#e60023',
            background: '#fff0f0',
            borderRadius: 12,
            marginBottom: 20,
          }}>
            <p style={{ fontWeight: 600, marginBottom: 8 }}>
              Could not reach backend
            </p>
            <p style={{ fontSize: 13 }}>API: {API_URL}</p>
            <p style={{ fontSize: 13 }}>{error}</p>

            <button
              onClick={() => fetchProducts(true)}
              style={{
                marginTop: 16,
                padding: '8px 20px',
                background: '#e60023',
                color: '#fff',
                border: 'none',
                borderRadius: 20,
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Masonry Grid */}
        <Masonry
          breakpointCols={breakpoints}
          className="masonry-grid"
          columnClassName="masonry-col"
        >
          {/* Skeletons */}
          {initialLoad &&
            Array(20)
              .fill(0)
              .map((_, i) => <SkeletonCard key={i} />)}

          {/* Products */}
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </Masonry>

        {/* Loading spinner */}
        {loading && !initialLoad && <Spinner />}

        {/* Empty state */}
        {!loading && !error && products.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <p style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>
              No products yet
            </p>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
              Be the first to upload!
            </p>
            <a href="/upload" style={{
              background: '#e60023',
              color: '#fff',
              padding: '12px 28px',
              borderRadius: 24,
              fontWeight: 600,
              fontSize: 15,
            }}>
              Upload first product
            </a>
          </div>
        )}

        {/* End message */}
        {!hasMore && products.length > 0 && (
          <p style={{
            textAlign: 'center',
            padding: 24,
            color: 'var(--text-secondary)',
            fontSize: 14,
          }}>
            You're all caught up
          </p>
        )}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div style={{
          textAlign: 'center',
          padding: 60,
          color: 'var(--text-secondary)'
        }}>
          Loading...
        </div>
      }
    >
      <Feed />
    </Suspense>
  );
}