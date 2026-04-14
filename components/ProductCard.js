'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

export default function ProductCard({ product }) {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { window.location.href = '/login'; return; }
    try {
      if (saved) {
        await api.delete(`/saves/${product._id}`);
        setSaved(false);
      } else {
        await api.post('/saves', { productId: product._id });
        setSaved(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ breakInside: 'avoid', marginBottom: 12 }}>
      <Link href={`/product/${product._id}`}>
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', background: '#efefef', cursor: 'pointer' }}
        >
          {product.images?.[0]?.url && (
            <img
              src={product.images[0].url}
              alt={product.title}
              style={{ width: '100%', display: 'block' }}
            />
          )}

          {hovered && (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(0,0,0,0.2)',
              display: 'flex', alignItems: 'flex-start',
              justifyContent: 'flex-end', padding: 10,
            }}>
              <button
                onClick={handleSave}
                style={{
                  background: saved ? '#111' : '#e60023',
                  color: '#fff', border: 'none',
                  borderRadius: 20, padding: '6px 14px',
                  fontSize: 13, fontWeight: 600,
                }}
              >
                {saved ? 'Saved' : 'Save'}
              </button>
            </div>
          )}

          <div style={{
            position: 'absolute', bottom: 8, left: 8,
            background: 'rgba(255,255,255,0.92)',
            borderRadius: 10, padding: '3px 8px',
            fontSize: 11, fontWeight: 600, color: '#111',
          }}>
            KSh {product.price?.toLocaleString()}
          </div>
        </div>

        <div style={{ padding: '6px 4px 0' }}>
          <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 4, lineHeight: 1.3 }}>
            {product.title}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 22, height: 22, borderRadius: '50%',
              background: '#ddd', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 600, overflow: 'hidden', flexShrink: 0,
            }}>
              {product.user?.avatar
                ? <img src={product.user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : product.user?.name?.[0]?.toUpperCase()}
            </div>
            <span style={{ fontSize: 12, color: '#555' }}>{product.user?.name}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}