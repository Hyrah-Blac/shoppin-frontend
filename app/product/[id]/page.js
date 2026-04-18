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
  const [wishlisted, setWishlisted] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [addingCart, setAddingCart] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    api.get(`/products/${id}`)
      .then((r) => setProduct(r.data))
      .catch(() => router.push('/'))
      .finally(() => setLoading(false));
    if (user) {
      api.get(`/wishlist/check/${id}`).then((r) => setWishlisted(r.data.isWishlisted)).catch(() => {});
    }
  }, [id, user, router]);

  const handleWishlist = async () => {
    if (!user) { router.push('/login'); return; }
    setAdding(true);
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
    } catch (e) { 
      console.error(e);
      addToast('Error updating wishlist', 'error');
    } finally {
      setAdding(false);
    }
  };

  const handleAddToCart = async () => {
    setAddingCart(true);
    try {
      if (product.stock === 0) {
        addToast('Out of stock', 'error');
        return;
      }
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      addToast(`Added ${quantity} item${quantity > 1 ? 's' : ''} to cart!`, 'success');
      setQuantity(1);
    } finally {
      setAddingCart(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-secondary)' }}>Loading...</div>;
  if (!product) return null;

  const isOwner = user && user._id === product.user?._id;
  const discount = product.originalPrice && product.price < product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div style={{ background: 'var(--bg-primary)' }}>
      <div style={{
        maxWidth: 1400,
        margin: '0 auto',
        padding: '40px 16px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 60,
      }}>

        {/* LEFT */}
        <div>
          <div style={{ 
            borderRadius: 16, 
            overflow: 'hidden', 
            background: 'var(--bg-secondary)', 
            marginBottom: 16, 
            position: 'relative',
            aspectRatio: '1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {product.images?.[activeImg]?.url && (
              <img src={product.images[activeImg].url} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            )}

            <button
              onClick={handleWishlist}
              disabled={adding}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                fontSize: 32,
                background: 'rgba(255,255,255,0.95)',
                border: 'none',
                borderRadius: '50%',
                width: 48,
                height: 48,
                cursor: adding ? 'not-allowed' : 'pointer',
                opacity: adding ? 0.6 : 1,
              }}
            >
              {wishlisted ? '❤️' : '🤍'}
            </button>

            {discount > 0 && (
              <div style={{
                position: 'absolute',
                top: 16,
                left: 16,
                background: '#e60023',
                color: '#fff',
                borderRadius: 8,
                padding: '8px 14px',
                fontSize: 14,
                fontWeight: 700,
              }}>
                Save {discount}%
              </div>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div>
          <h1>{product.title}</h1>

          {/* FIXED LINK */}
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
                border: '2px solid #e60023',
                borderRadius: 12,
                textDecoration: 'none',
              }}
            >
              Visit original link ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}