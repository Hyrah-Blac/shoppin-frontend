'use client';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, total, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const handleCheckout = () => {
    if (!user) { router.push('/login'); return; }
    router.push('/orders/new');
  };

  if (cart.length === 0) return (
    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
      <p style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>Your cart is empty</p>
      <p style={{ color: '#888', marginBottom: 24 }}>Browse products and add something you love</p>
      <Link href="/" style={{
        background: '#e60023', color: '#fff',
        padding: '12px 28px', borderRadius: 24,
        fontWeight: 600, fontSize: 15,
      }}>Browse products</Link>
    </div>
  );

  return (
    <div style={{ maxWidth: 800, margin: '32px auto', padding: '0 16px' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Your cart</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {cart.map((item) => (
          <div key={item._id} style={{
            background: '#fff', borderRadius: 16, padding: 16,
            display: 'flex', gap: 16, alignItems: 'center',
          }}>
            <img
              src={item.images?.[0]?.url}
              alt={item.title}
              style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 12, flexShrink: 0 }}
            />
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, marginBottom: 4 }}>{item.title}</p>
              <p style={{ color: '#e60023', fontWeight: 600 }}>KSh {item.price?.toLocaleString()}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                style={{
                  width: 28, height: 28, borderRadius: '50%',
                  border: '1px solid #ddd', background: '#f5f5f5',
                  fontSize: 16, fontWeight: 600,
                }}
              >-</button>
              <span style={{ fontWeight: 600, minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                style={{
                  width: 28, height: 28, borderRadius: '50%',
                  border: '1px solid #ddd', background: '#f5f5f5',
                  fontSize: 16, fontWeight: 600,
                }}
              >+</button>
            </div>
            <p style={{ fontWeight: 700, minWidth: 80, textAlign: 'right' }}>
              KSh {(item.price * item.quantity).toLocaleString()}
            </p>
            <button
              onClick={() => removeFromCart(item._id)}
              style={{ color: '#e60023', border: 'none', background: 'none', fontSize: 20, padding: 4 }}
            >×</button>
          </div>
        ))}
      </div>

      <div style={{
        background: '#fff', borderRadius: 16, padding: 24,
        marginTop: 20,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <span style={{ fontSize: 16, color: '#666' }}>Subtotal</span>
          <span style={{ fontSize: 20, fontWeight: 700 }}>KSh {total.toLocaleString()}</span>
        </div>
        <button onClick={handleCheckout} style={{
          width: '100%', height: 52, background: '#e60023',
          color: '#fff', border: 'none', borderRadius: 16,
          fontSize: 16, fontWeight: 700,
        }}>
          Proceed to checkout
        </button>
        <button onClick={clearCart} style={{
          width: '100%', marginTop: 10, height: 44,
          background: 'transparent', border: '1px solid #ddd',
          borderRadius: 16, fontSize: 14, color: '#666',
        }}>
          Clear cart
        </button>
      </div>
    </div>
  );
}