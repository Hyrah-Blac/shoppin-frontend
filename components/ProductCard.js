'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import api from '@/lib/api';

export default function ProductCard({ product }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [saved, setSaved] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);

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
    } catch (err) { console.error(err); }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
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
            <img src={product.images[0].url} alt={product.title} style={{ width: '100%', display: 'block' }} />
          )}

          {hovered && (
            <div style={{
              position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'flex-end', justifyContent: 'space-between', padding: 10,
            }}>
              <button onClick={handleSave} style={{
                background: saved ? '#111' : '#e60023',
                color: '#fff', border: 'none',
                borderRadius: 20, padding: '6px 14px',
                fontSize: 13, fontWeight: 600,
              }}>
                {saved ? 'Saved' : 'Save'}
              </button>
              <button onClick={handleAddToCart} style={{
                background: added ? '#1a8a1a' : '#fff',
                color: added ? '#fff' : '#111',
                border: 'none', borderRadius: 20,
                padding: '6px 14px', fontSize: 13, fontWeight: 600,
                width: '100%',
              }}>
                {added ? 'Added!' : 'Add to cart'}
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

          {product.stock === 0 && (
            <div style={{
              position: 'absolute', top: 8, left: 8,
              background: 'rgba(0,0,0,0.7)',
              borderRadius: 10, padding: '3px 8px',
              fontSize: 11, fontWeight: 600, color: '#fff',
            }}>
              Out of stock
            </div>
          )}
        </div>

        <div style={{ padding: '6px 4px 0' }}>
          <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 2, lineHeight: 1.3 }}>{product.title}</p>
          {product.averageRating > 0 && (
            <p style={{ fontSize: 11, color: '#f59e0b', marginBottom: 2 }}>
              {'★'.repeat(Math.round(product.averageRating))}{'☆'.repeat(5 - Math.round(product.averageRating))}
              <span style={{ color: '#888', marginLeft: 4 }}>({product.reviewCount})</span>
            </p>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 22, height: 22, borderRadius: '50%', background: '#ddd',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
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