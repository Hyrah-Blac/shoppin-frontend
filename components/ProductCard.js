'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import api from '@/lib/api';
import QuickView from './QuickView';

export default function ProductCard({ product }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const [saved, setSaved] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { window.location.href = '/login'; return; }

    try {
      if (saved) {
        await api.delete(`/saves/${product._id}`);
        setSaved(false);
        addToast('Removed from saves', 'info');
      } else {
        await api.post('/saves', { productId: product._id });
        setSaved(true);
        addToast('Added to saves', 'success');
      }
    } catch (err) {
      console.error(err);
      addToast('Something went wrong', 'error');
    }
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { window.location.href = '/login'; return; }

    try {
      if (wishlisted) {
        await api.delete(`/wishlist/${product._id}`);
        setWishlisted(false);
        addToast('Removed from wishlist', 'info');
      } else {
        await api.post('/wishlist', { productId: product._id });
        setWishlisted(true);
        addToast('Added to wishlist', 'success');
      }
    } catch (err) {
      console.error(err);
      addToast('Something went wrong', 'error');
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.stock === 0) {
      addToast('Out of stock', 'error');
      return;
    }

    addToCart(product);
    addToast('Added to cart!', 'success');
  };

  const discount = product.originalPrice && product.price < product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <>
      <div style={{ breakInside: 'avoid', marginBottom: 12 }}>
        <Link href={`/product/${product._id}`}>
          <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              position: 'relative',
              borderRadius: 16,
              overflow: 'hidden',
              background: 'var(--bg-secondary)',
              cursor: 'pointer',
            }}
          >
            {/* Image */}
            {product.images?.[0]?.url && (
              <img
                src={product.images[0].url}
                alt={product.title}
                style={{ width: '100%', display: 'block' }}
              />
            )}

            {/* Hover overlay */}
            {hovered && (
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.15)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                padding: 10,
              }}>
                {/* Top actions */}
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={handleWishlist} style={{
                    background: wishlisted ? '#e60023' : 'rgba(255,255,255,0.9)',
                    color: wishlisted ? '#fff' : '#111',
                    border: 'none',
                    borderRadius: 20,
                    padding: '6px 10px',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}>
                    {wishlisted ? '❤️' : '🤍'}
                  </button>

                  <button onClick={handleSave} style={{
                    background: saved ? '#111' : '#e60023',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 20,
                    padding: '6px 10px',
                    fontSize: 11,
                    fontWeight: 600,
                  }}>
                    {saved ? 'Saved' : 'Save'}
                  </button>
                </div>

                {/* Bottom actions */}
                <div style={{ display: 'flex', gap: 6, width: '100%' }}>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowQuickView(true);
                    }}
                    style={{
                      flex: 1,
                      background: '#fff',
                      color: '#111',
                      border: 'none',
                      borderRadius: 20,
                      padding: '6px 10px',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Quick view
                  </button>

                  <button
                    onClick={handleAddToCart}
                    style={{
                      flex: 1,
                      background: '#e60023',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 20,
                      padding: '6px 10px',
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>
            )}

            {/* Price */}
            <div style={{
              position: 'absolute',
              bottom: 8,
              left: 8,
              background: 'rgba(255,255,255,0.92)',
              borderRadius: 10,
              padding: '3px 8px',
              fontSize: 11,
              fontWeight: 600,
              color: '#111',
            }}>
              KSh {product.price?.toLocaleString()}
            </div>

            {/* Discount */}
            {discount > 0 && (
              <div style={{
                position: 'absolute',
                top: 8,
                left: 8,
                background: '#e60023',
                color: '#fff',
                borderRadius: 6,
                padding: '2px 8px',
                fontSize: 11,
                fontWeight: 700,
              }}>
                -{discount}%
              </div>
            )}

            {/* Stock */}
            {product.stock === 0 && (
              <div style={{
                position: 'absolute',
                top: 8,
                right: 8,
                background: 'rgba(0,0,0,0.7)',
                borderRadius: 8,
                padding: '4px 8px',
                fontSize: 11,
                fontWeight: 600,
                color: '#fff',
              }}>
                Out of stock
              </div>
            )}
          </div>
        </Link>

        {/* Info */}
        <div style={{ padding: '6px 4px 0' }}>
          <p style={{
            fontSize: 13,
            fontWeight: 500,
            marginBottom: 2,
            lineHeight: 1.3,
            color: 'var(--text-primary)',
          }}>
            {product.title}
          </p>

          {product.averageRating > 0 && (
            <p style={{ fontSize: 11, color: '#f59e0b', marginBottom: 2 }}>
              {'★'.repeat(Math.round(product.averageRating))}
              {'☆'.repeat(5 - Math.round(product.averageRating))}
              <span style={{ color: 'var(--text-secondary)', marginLeft: 4 }}>
                ({product.reviewCount})
              </span>
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
              fontSize: 10,
              fontWeight: 600,
              overflow: 'hidden',
              flexShrink: 0,
            }}>
              {product.user?.avatar
                ? <img src={product.user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : product.user?.name?.[0]?.toUpperCase()}
            </div>

            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              {product.user?.name}
            </span>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {showQuickView && (
        <QuickView
          product={product}
          onClose={() => setShowQuickView(false)}
        />
      )}
    </>
  );
}