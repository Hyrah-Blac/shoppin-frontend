'use client';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import Link from 'next/link';

export default function QuickView({ product, onClose }) {
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const handleAddToCart = () => {
    addToCart(product);
    addToast('Added to cart!', 'success');
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 999,
        background: 'rgba(0,0,0,0.5)', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--bg-primary)',
          borderRadius: 20, padding: 24,
          maxWidth: 500, width: '100%',
          maxHeight: '90vh', overflow: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Quick view</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer' }}>×</button>
        </div>

        {product.images?.[0]?.url && (
          <img src={product.images[0].url} alt={product.title} style={{ width: '100%', borderRadius: 12, marginBottom: 16 }} />
        )}

        <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{product.title}</p>
        <p style={{ color: '#e60023', fontWeight: 700, fontSize: 18, marginBottom: 12 }}>
          KSh {product.price?.toLocaleString()}
        </p>

        {product.description && (
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.5 }}>
            {product.description}
          </p>
        )}

        {product.stock === 0 ? (
          <button style={{
            width: '100%', padding: 12, borderRadius: 12,
            background: '#ddd', color: '#999',
            border: 'none', fontWeight: 600, cursor: 'not-allowed',
          }}>
            Out of stock
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handleAddToCart}
              style={{
                flex: 1, padding: 12, borderRadius: 12,
                background: '#e60023', color: '#fff',
                border: 'none', fontWeight: 700, fontSize: 14,
                cursor: 'pointer',
              }}
            >
              Add to cart
            </button>
            <Link href={`/product/${product._id}`} onClick={onClose} style={{
              flex: 1, padding: 12, borderRadius: 12,
              background: 'var(--bg-secondary)', color: 'var(--text-primary)',
              border: 'none', fontWeight: 700, fontSize: 14,
              textAlign: 'center',
            }}>
              View details
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}