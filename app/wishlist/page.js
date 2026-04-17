'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Masonry from 'react-masonry-css';
import ProductCard from '@/components/ProductCard';
import api from '@/lib/api';

const breakpoints = { default: 4, 1100: 3, 700: 2 };

const masonryStyles = `
  .masonry-grid { display: flex; gap: 12px; width: 100%; }
  .masonry-col { display: flex; flex-direction: column; }
`;

export default function WishlistPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [wishlisted, setWishlisted] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      api.get('/wishlist/my')
        .then((r) => setWishlisted(r.data.map((w) => w.product).filter(Boolean)))
        .finally(() => setFetching(false));
    }
  }, [user]);

  if (loading || fetching) return <div style={{ textAlign: 'center', padding: 60 }}>Loading...</div>;

  if (wishlisted.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <p style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>Your wishlist is empty</p>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Add products you love to your wishlist</p>
        <Link href="/" style={{
          background: '#e60023', color: '#fff',
          padding: '12px 28px', borderRadius: 24,
          fontWeight: 600, fontSize: 15,
        }}>Browse products</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: '32px auto', padding: '0 16px 60px' }}>
      <style>{masonryStyles}</style>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Wishlist ({wishlisted.length})</h1>
      <Masonry
        breakpointCols={breakpoints}
        className="masonry-grid"
        columnClassName="masonry-col"
      >
        {wishlisted.map((p) => <ProductCard key={p._id} product={p} />)}
      </Masonry>
    </div>
  );
}