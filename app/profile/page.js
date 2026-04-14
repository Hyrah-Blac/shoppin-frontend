'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Masonry from 'react-masonry-css';
import ProductCard from '@/components/ProductCard';
import api from '@/lib/api';

const breakpoints = { default: 4, 1100: 3, 700: 2 };

const masonryStyles = `
  .masonry-grid { display: flex; gap: 12px; width: 100%; }
  .masonry-col { display: flex; flex-direction: column; }
`;

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [saves, setSaves] = useState([]);
  const [boards, setBoards] = useState([]);
  const [tab, setTab] = useState('created');

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    api.get(`/products/user/${user._id}`).then((r) => setProducts(r.data));
    api.get('/saves/my').then((r) => setSaves(r.data));
    api.get('/boards/my').then((r) => setBoards(r.data));
  }, [user]);

  if (loading || !user) return <div style={{ textAlign: 'center', padding: 60 }}>Loading...</div>;

  const savedProducts = saves.map((s) => s.product).filter(Boolean);

  const tabStyle = (t) => ({
    padding: '10px 20px', fontSize: 14, fontWeight: 500,
    border: 'none', background: 'transparent',
    color: tab === t ? '#111' : '#666',
    borderBottom: tab === t ? '2px solid #111' : '2px solid transparent',
    marginBottom: -1,
  });

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px 40px' }}>
      <style>{masonryStyles}</style>

      <div style={{ textAlign: 'center', padding: '40px 16px 24px' }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: '#ddd', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 28, fontWeight: 700,
          margin: '0 auto 12px', overflow: 'hidden',
        }}>
          {user.avatar
            ? <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : user.name[0].toUpperCase()}
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>{user.name}</h1>
        <p style={{ fontSize: 14, color: '#666' }}>{user.email}</p>
      </div>

      <div style={{
        display: 'flex', justifyContent: 'center', gap: 4,
        marginBottom: 24, borderBottom: '1px solid #e0e0e0',
      }}>
        <button style={tabStyle('created')} onClick={() => setTab('created')}>
          Created ({products.length})
        </button>
        <button style={tabStyle('saved')} onClick={() => setTab('saved')}>
          Saved ({savedProducts.length})
        </button>
        <button style={tabStyle('boards')} onClick={() => setTab('boards')}>
          Boards ({boards.length})
        </button>
      </div>

      {tab === 'created' && (
        <Masonry breakpointCols={breakpoints} className="masonry-grid" columnClassName="masonry-col">
          {products.map((p) => <ProductCard key={p._id} product={p} />)}
        </Masonry>
      )}

      {tab === 'saved' && (
        <Masonry breakpointCols={breakpoints} className="masonry-grid" columnClassName="masonry-col">
          {savedProducts.map((p) => <ProductCard key={p._id} product={p} />)}
        </Masonry>
      )}

      {tab === 'boards' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
          {boards.map((b) => (
            <div key={b._id}>
              <div style={{
                aspectRatio: '1', background: '#efefef',
                borderRadius: 16, overflow: 'hidden',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', marginBottom: 8,
              }}>
                {b.coverImage
                  ? <img src={b.coverImage} alt={b.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ fontSize: 12, color: '#aaa' }}>No cover</span>}
              </div>
              <p style={{ fontSize: 14, fontWeight: 600 }}>{b.name}</p>
              <p style={{ fontSize: 12, color: '#888' }}>{b.products?.length || 0} items</p>
            </div>
          ))}
          <button
            onClick={async () => {
              const name = prompt('Board name?');
              if (name) {
                const { data } = await api.post('/boards', { name });
                setBoards((prev) => [...prev, data]);
              }
            }}
            style={{
              aspectRatio: '1', border: '2px dashed #ddd',
              borderRadius: 16, fontSize: 14, fontWeight: 600,
              color: '#888', background: 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            + New board
          </button>
        </div>
      )}
    </div>
  );
}