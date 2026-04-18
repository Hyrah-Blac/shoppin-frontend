'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

export default function ProductCard({ product, onRemoveWishlist }) {
  const [hovered, setHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [adding, setAdding] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user && product._id) {
      checkWishlist();
    }
  }, [user, product._id]);

  const checkWishlist = async () => {
    try {
      const res = await api.get(`/wishlist/check/${product._id}`);
      setIsWishlisted(res.data.isWishlisted);
    } catch (error) {
      console.error('Error checking wishlist:', error);
    }
  };

  const toggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
      return;
    }

    setAdding(true);
    try {
      if (isWishlisted) {
        await api.delete(`/wishlist/${product._id}`);
        setIsWishlisted(false);
        onRemoveWishlist?.();
      } else {
        await api.post('/wishlist', { productId: product._id });
        setIsWishlisted(true);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setAdding(false);
    }
  };

  const discount = product.originalPrice && product.price < product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div style={{ breakInside: 'avoid', marginBottom: 12 }}>
      <Link href={`/product/${product._id}`}>
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            position: 'relative',
            borderRadius: 12,
            overflow: 'hidden',
            background: 'var(--bg-secondary)',
            cursor: 'pointer',
          }}
        >
          {product.images?.[0]?.url && (
            <img src={product.images[0].url} alt={product.title} style={{ width: '100%', display: 'block' }} />
          )}

          {/* SALE BADGE - top left */}
          {discount > 0 && (
            <div style={{
              position: 'absolute',
              top: 8,
              left: 8,
              background: '#e60023',
              color: '#fff',
              borderRadius: 6,
              padding: '3px 8px',
              fontSize: 10,
              fontWeight: 700,
              zIndex: 2,
            }}>
              -{discount}%
            </div>
          )}

          {/* WISHLIST HEART - on hover or if wishlisted, top left */}
          {(hovered || isWishlisted) && !discount && (
            <button
              onClick={toggleWishlist}
              disabled={adding}
              style={{
                position: 'absolute',
                top: 8,
                left: 8,
                fontSize: 20,
                zIndex: 2,
                cursor: adding ? 'not-allowed' : 'pointer',
                background: 'none',
                border: 'none',
                padding: 0,
                opacity: adding ? 0.6 : 1,
              }}
            >
              {isWishlisted ? '❤️' : '🤍'}
            </button>
          )}

          {/* OUT OF STOCK - top right */}
          {product.stock === 0 && (
            <div style={{
              position: 'absolute',
              top: 8,
              right: 8,
              background: 'rgba(0,0,0,0.7)',
              borderRadius: 6,
              padding: '3px 8px',
              fontSize: 10,
              fontWeight: 600,
              color: '#fff',
              zIndex: 2,
            }}>
              Out of stock
            </div>
          )}

          {/* PRICE - bottom left */}
          <div style={{
            position: 'absolute',
            bottom: 8,
            left: 8,
            background: 'rgba(255,255,255,0.95)',
            borderRadius: 10,
            padding: '4px 8px',
            fontSize: 11,
            fontWeight: 700,
            color: '#111',
            zIndex: 2,
          }}>
            KSh {product.price?.toLocaleString()}
          </div>

          {/* SUBTLE HOVER OVERLAY */}
          {hovered && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.08)',
              zIndex: 1,
            }} />
          )}
        </div>
      </Link>

      {/* TEXT SECTION */}
      <div style={{ padding: '8px 0' }}>
        <p style={{
          fontSize: 13,
          fontWeight: 500,
          marginBottom: 4,
          lineHeight: 1.3,
          color: 'var(--text-primary)',
        }}>
          {product.title}
        </p>
        {product.averageRating > 0 && (
          <p style={{ fontSize: 11, color: '#f59e0b', marginBottom: 3 }}>
            {'★'.repeat(Math.round(product.averageRating))}{'☆'.repeat(5 - Math.round(product.averageRating))}
            <span style={{ color: 'var(--text-secondary)', marginLeft: 4, fontSize: 10 }}>({product.reviewCount})</span>
          </p>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: 'var(--bg-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 9,
            fontWeight: 600,
            overflow: 'hidden',
            flexShrink: 0,
          }}>
            {product.user?.avatar
              ? <img src={product.user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : product.user?.name?.[0]?.toUpperCase()}
          </div>
          <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{product.user?.name}</span>
        </div>
      </div>
    </div>
  );
}