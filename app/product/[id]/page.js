'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function ProductPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [saved, setSaved] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then((r) => setProduct(r.data))
      .catch(() => router.push('/'))
      .finally(() => setLoading(false));
    if (user) {
      api.get(`/saves/check/${id}`).then((r) => setSaved(r.data.saved));
    }
  }, [id, user, router]);

  const handleSave = async () => {
    if (!user) { router.push('/login'); return; }
    try {
      if (saved) {
        await api.delete(`/saves/${id}`);
        setSaved(false);
      } else {
        await api.post('/saves', { productId: id });
        setSaved(true);
      }
    } catch (e) { console.error(e); }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this product?')) return;
    await api.delete(`/products/${id}`);
    router.push('/');
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 60, color: '#888' }}>Loading...</div>;
  if (!product) return null;

  return (
    <div style={{
      maxWidth: 960, margin: '32px auto', padding: '0 16px',
      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40,
    }}>
      <div>
        <div style={{ borderRadius: 20, overflow: 'hidden', background: '#efefef' }}>
          <img src={product.images?.[activeImg]?.url} alt={product.title} style={{ width: '100%', display: 'block' }} />
        </div>
        {product.images?.length > 1 && (
          <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
            {product.images.map((img, i) => (
              <img key={i} src={img.url} alt=""
                onClick={() => setActiveImg(i)}
                style={{
                  width: 60, height: 60, objectFit: 'cover',
                  borderRadius: 10, cursor: 'pointer',
                  opacity: activeImg === i ? 1 : 0.5,
                  border: activeImg === i ? '2px solid #111' : '2px solid transparent',
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%', background: '#ddd',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, overflow: 'hidden', flexShrink: 0,
          }}>
            {product.user?.avatar
              ? <img src={product.user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : product.user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p style={{ fontWeight: 600, fontSize: 14 }}>{product.user?.name}</p>
            {product.user?.bio && <p style={{ fontSize: 12, color: '#666' }}>{product.user.bio}</p>}
          </div>
        </div>

        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, lineHeight: 1.2 }}>{product.title}</h1>
        <p style={{ fontSize: 22, fontWeight: 600, color: '#e60023', marginBottom: 12 }}>
          KSh {product.price?.toLocaleString()}
        </p>

        {product.description && (
          <p style={{ fontSize: 14, color: '#444', lineHeight: 1.6, marginBottom: 16 }}>{product.description}</p>
        )}

        {product.tags?.length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
            {product.tags.map((t) => (
              <span key={t} style={{
                background: '#efefef', padding: '4px 12px',
                borderRadius: 16, fontSize: 12, color: '#555',
              }}>{t}</span>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          <button onClick={handleSave} style={{
            background: saved ? '#111' : '#e60023',
            color: '#fff', border: 'none', borderRadius: 24,
            padding: '12px 28px', fontSize: 15, fontWeight: 600,
          }}>
            {saved ? 'Saved' : 'Save'}
          </button>
          {product.link && (
            <a href={product.link} target="_blank" rel="noopener noreferrer" style={{
              border: '2px solid #111', borderRadius: 24,
              padding: '12px 28px', fontSize: 15, fontWeight: 600, color: '#111',
            }}>
              Visit site
            </a>
          )}
        </div>

        {user && user._id === product.user?._id && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <button onClick={() => router.push(`/upload`)} style={{
              padding: '8px 20px', borderRadius: 20,
              border: '1px solid #ccc', background: 'transparent', fontSize: 13,
            }}>Edit</button>
            <button onClick={handleDelete} style={{
              padding: '8px 20px', borderRadius: 20,
              border: '1px solid #e60023', color: '#e60023',
              background: 'transparent', fontSize: 13,
            }}>Delete</button>
          </div>
        )}

        <p style={{ fontSize: 13, color: '#888' }}>{product.savesCount} saves</p>
      </div>

      <style>{`
        @media (max-width: 700px) {
          div[style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}