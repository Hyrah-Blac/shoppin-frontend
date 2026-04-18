'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';

export default function ProductPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [saved, setSaved] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then((r) => setProduct(r.data))
      .catch(() => router.push('/'))
      .finally(() => setLoading(false));
    if (user) {
      api.get(`/saves/check/${id}`).then((r) => setSaved(r.data.saved)).catch(() => {});
      api.get(`/wishlist/check/${id}`).then((r) => setWishlisted(r.data.wishlisted)).catch(() => {});
    }
  }, [id, user, router]);

  const handleSave = async () => {
    if (!user) { router.push('/login'); return; }
    try {
      if (saved) {
        await api.delete(`/saves/${id}`);
        setSaved(false);
        addToast('Removed from saves', 'info');
      } else {
        await api.post('/saves', { productId: id });
        setSaved(true);
        addToast('Added to saves!', 'success');
      }
    } catch (e) { console.error(e); }
  };

  const handleWishlist = async () => {
    if (!user) { router.push('/login'); return; }
    try {
      if (wishlisted) {
        await api.delete(`/wishlist/${id}`);
        setWishlisted(false);
        addToast('Removed from wishlist', 'info');
      } else {
        await api.post('/wishlist', { productId: id });
        setWishlisted(true);
        addToast('Added to wishlist!', 'success');
      }
    } catch (e) { console.error(e); }
  };

  const handleAddToCart = () => {
    if (product.stock === 0) {
      addToast('Out of stock', 'error');
      return;
    }
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    addToast(`Added ${quantity} to cart!`, 'success');
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-secondary)' }}>Loading...</div>;
  if (!product) return null;

  const isOwner = user && user._id === product.user?._id;
  const discount = product.originalPrice && product.price < product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div style={{
      maxWidth: 1200,
      margin: '0 auto',
      padding: '32px 16px 80px',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 40,
    }}>
      {/* LEFT - IMAGES */}
      <div>
        <div style={{ borderRadius: 12, overflow: 'hidden', background: 'var(--bg-secondary)', marginBottom: 12 }}>
          {product.images?.[activeImg]?.url && (
            <img src={product.images[activeImg].url} alt={product.title} style={{ width: '100%', display: 'block' }} />
          )}
        </div>
        {product.images?.length > 1 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {product.images.map((img, i) => (
              <img
                key={i}
                src={img.url}
                alt=""
                onClick={() => setActiveImg(i)}
                style={{
                  width: 60,
                  height: 60,
                  objectFit: 'cover',
                  borderRadius: 10,
                  cursor: 'pointer',
                  opacity: activeImg === i ? 1 : 0.5,
                  border: activeImg === i ? '2px solid var(--text-primary)' : '2px solid transparent',
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* RIGHT - INFO */}
      <div>
        {/* SELLER */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'var(--bg-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            overflow: 'hidden',
            flexShrink: 0,
          }}>
            {product.user?.avatar
              ? <img src={product.user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : product.user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p style={{ fontWeight: 600, fontSize: 14 }}>{product.user?.name}</p>
            {product.user?.bio && <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{product.user.bio}</p>}
          </div>
        </div>

        {/* TITLE & PRICE */}
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12, lineHeight: 1.2 }}>{product.title}</h1>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 20 }}>
          <p style={{ fontSize: 28, fontWeight: 700, color: '#e60023' }}>
            KSh {product.price?.toLocaleString()}
          </p>
          {discount > 0 && (
            <>
              <p style={{ fontSize: 16, color: 'var(--text-secondary)', textDecoration: 'line-through' }}>
                KSh {product.originalPrice?.toLocaleString()}
              </p>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#e60023' }}>
                Save {discount}%
              </p>
            </>
          )}
        </div>

        {/* DESCRIPTION */}
        {product.description && (
          <p style={{
            fontSize: 14,
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            marginBottom: 20,
          }}>
            {product.description}
          </p>
        )}

        {/* TAGS */}
        {product.tags?.length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
            {product.tags.map((t) => (
              <span key={t} style={{
                background: 'var(--bg-secondary)',
                padding: '4px 12px',
                borderRadius: 16,
                fontSize: 12,
                color: 'var(--text-secondary)',
              }}>{t}</span>
            ))}
          </div>
        )}

        {/* STOCK */}
        <div style={{ marginBottom: 24 }}>
          {product.stock > 0 ? (
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              ✓ In stock ({product.stock} available)
            </p>
          ) : (
            <p style={{ fontSize: 13, color: '#e60023', fontWeight: 600 }}>
              Out of stock
            </p>
          )}
        </div>

        {/* QUANTITY & CART */}
        {!isOwner && product.stock > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Quantity:</span>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: 8 }}>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>

            <button onClick={handleAddToCart}>Add to cart</button>
          </div>
        )}

        {/* EXTERNAL LINK */}
        {product.link && (
          <a
            href={product.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 48,
              background: 'transparent',
              color: 'var(--text-primary)',
              border: '2px solid var(--border-color)',
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              marginBottom: 24,
              textDecoration: 'none',
            }}
          >
            Visit original link ↗
          </a>
        )}
      </div>
    </div>
  );
}