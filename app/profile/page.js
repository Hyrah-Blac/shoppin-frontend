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

const breakpoints = { default: 4, 1100: 3, 700: 2 };

const masonryStyles = `
  .masonry-grid { display: flex; gap: 12px; width: 100%; }
  .masonry-col { display: flex; flex-direction: column; }
`;

export default function ProfilePage() {
  const { user, loading, logout, setAuthUser } = useAuth();
  const router = useRouter();
  const { addToast } = useToast();
  const [products, setProducts] = useState([]);
  const [wishlisted, setWishlisted] = useState([]);
  const [tab, setTab] = useState('created');
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      api.get(`/products/user/${user._id}`).then((r) => setProducts(r.data)),
      api.get('/wishlist/my').then((r) => setWishlisted(r.data)),
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
    } catch (err) {
      addToast('Failed to upload image', 'error');
    } finally {
      setUploading(false);
    }
  };

  if (loading || fetching) return <div style={{ textAlign: 'center', padding: 60 }}>Loading...</div>;
  if (!user) return null;

  const navTabs = [
    { key: 'created', label: `Created (${products.length})` },
    { key: 'saved', label: `Saved (${wishlisted.length})` },
    { key: 'orders', label: 'Orders' },
    ...(user.role === 'admin' ? [{ key: 'admin', label: 'Admin' }] : []),
  ];

  return (
    <div>
      <style>{masonryStyles}</style>

      {/* HEADER SECTION */}
      <div style={{
        background: 'var(--bg-primary)',
        borderBottom: '1px solid var(--border-color)',
        padding: '40px 16px',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <label style={{ position: 'relative', display: 'inline-block', cursor: uploading ? 'not-allowed' : 'pointer' }}>
              <div style={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                background: 'var(--bg-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 40,
                fontWeight: 700,
                margin: '0 auto 16px',
                overflow: 'hidden',
                flexShrink: 0,
                opacity: uploading ? 0.6 : 1,
              }}>
                {user.avatar
                  ? <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : user.name[0].toUpperCase()}
              </div>
              <div style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                background: '#e60023',
                color: '#fff',
                width: 32,
                height: 32,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
              }}>
                📷
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                disabled={uploading}
                style={{ display: 'none' }}
              />
            </label>
            <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>{user.name}</h1>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16 }}>{user.email}</p>
            <button
              onClick={() => {
                logout();
                router.push('/');
              }}
              style={{
                background: '#e60023',
                color: '#fff',
                padding: '10px 24px',
                borderRadius: 24,
                border: 'none',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: 14,
              }}
            >
              Logout
            </button>
          </div>

          {/* SETTINGS ICON - TOP RIGHT */}
          <Link href="/settings" style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: 'var(--bg-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
            textDecoration: 'none',
            transition: 'background 0.2s',
          }}
            onMouseEnter={(e) => e.target.style.background = 'var(--border-color)'}
            onMouseLeave={(e) => e.target.style.background = 'var(--bg-secondary)'}
          >
            ⚙️
          </Link>
        </div>
      </div>

      {/* TABS */}
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 16px',
        display: 'flex',
        justifyContent: 'center',
        gap: 4,
        borderBottom: '1px solid var(--border-color)',
        background: 'var(--bg-primary)',
        position: 'sticky',
        top: 61,
        zIndex: 90,
        overflowX: 'auto',
      }}>
        {navTabs.map((t) => (
          t.key === 'orders' ? (
            <Link
              key={t.key}
              href="/orders"
              style={{
                padding: '12px 20px',
                fontSize: 14,
                fontWeight: 500,
                border: 'none',
                background: 'transparent',
                color: 'var(--text-secondary)',
                borderBottom: '2px solid transparent',
                cursor: 'pointer',
                marginBottom: -1,
                transition: 'color 0.2s',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              {t.label}
            </Link>
          ) : t.key === 'admin' ? (
            <Link
              key={t.key}
              href="/admin"
              style={{
                padding: '12px 20px',
                fontSize: 14,
                fontWeight: 500,
                border: 'none',
                background: 'transparent',
                color: 'var(--text-secondary)',
                borderBottom: '2px solid transparent',
                cursor: 'pointer',
                marginBottom: -1,
                transition: 'color 0.2s',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              {t.label}
            </Link>
          ) : (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                padding: '12px 20px',
                fontSize: 14,
                fontWeight: 500,
                border: 'none',
                background: 'transparent',
                color: tab === t.key ? 'var(--text-primary)' : 'var(--text-secondary)',
                borderBottom: tab === t.key ? '2px solid #e60023' : '2px solid transparent',
                cursor: 'pointer',
                marginBottom: -1,
                transition: 'color 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              {t.label}
            </button>
          )
        ))}
      </div>

      {/* CONTENT */}
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '32px 16px 60px',
      }}>
        {tab === 'created' && (
          products.length > 0 ? (
            <Masonry
              breakpointCols={breakpoints}
              className="masonry-grid"
              columnClassName="masonry-col"
            >
              {products.map((p) => <ProductCard key={p._id} product={p} />)}
            </Masonry>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
              <p style={{ fontSize: 16, marginBottom: 16 }}>You haven't created any products yet</p>
              <Link href="/upload" style={{
                background: '#e60023',
                color: '#fff',
                padding: '10px 24px',
                borderRadius: 24,
                fontWeight: 600,
                display: 'inline-block',
                textDecoration: 'none',
              }}>Create your first product</Link>
            </div>
          )
        )}

        {tab === 'saved' && (
          wishlisted.length > 0 ? (
            <Masonry
              breakpointCols={breakpoints}
              className="masonry-grid"
              columnClassName="masonry-col"
            >
              {wishlisted.map((p) => (
                <ProductCard 
                  key={p._id} 
                  product={p}
                  onRemoveWishlist={() => setWishlisted(wishlisted.filter((w) => w._id !== p._id))}
                />
              ))}
            </Masonry>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
              <p style={{ fontSize: 16, marginBottom: 16 }}>You haven't saved any products yet</p>
              <Link href="/" style={{
                background: '#e60023',
                color: '#fff',
                padding: '10px 24px',
                borderRadius: 24,
                fontWeight: 600,
                display: 'inline-block',
                textDecoration: 'none',
              }}>Explore products</Link>
            </div>
          )
        )}
      </div>
    </div>
  );
}