'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

export default function AdminProductsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) router.push('/');
  }, [user, loading, router]);

  useEffect(() => {
    if (user?.role === 'admin') {
      api.get('/products?limit=100')
        .then((r) => setProducts(r.data.products))
        .finally(() => setFetching(false));
    }
  }, [user]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    await api.delete(`/products/${id}`);
    setProducts((prev) => prev.filter((p) => p._id !== id));
  };

  if (loading || fetching) return <div style={{ textAlign: 'center', padding: 60 }}>Loading...</div>;

  return (
    <div style={{ maxWidth: 1100, margin: '32px auto', padding: '0 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Products ({products.length})</h1>
        <Link href="/admin/products/new" style={{
          background: '#e60023', color: '#fff',
          padding: '10px 20px', borderRadius: 24, fontWeight: 600, fontSize: 14,
        }}>+ Add product</Link>
      </div>

      <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden' }}>
        {products.map((p, i) => (
          <div key={p._id} style={{
            display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px',
            borderBottom: i < products.length - 1 ? '1px solid #f0f0f0' : 'none',
          }}>
            <img
              src={p.images?.[0]?.url}
              alt={p.title}
              style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 10, flexShrink: 0, background: '#eee' }}
            />
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, marginBottom: 2 }}>{p.title}</p>
              <p style={{ fontSize: 13, color: '#888' }}>{p.category} · Stock: {p.stock ?? 'N/A'}</p>
            </div>
            <p style={{ fontWeight: 700, color: '#e60023', minWidth: 100, textAlign: 'right' }}>
              KSh {p.price?.toLocaleString()}
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <Link href={`/admin/products/${p._id}`} style={{
                padding: '6px 14px', borderRadius: 20,
                border: '1px solid #ddd', fontSize: 13, fontWeight: 500,
              }}>Edit</Link>
              <button onClick={() => handleDelete(p._id)} style={{
                padding: '6px 14px', borderRadius: 20,
                border: '1px solid #ffcdd2', color: '#e60023',
                background: 'transparent', fontSize: 13, fontWeight: 500,
              }}>Delete</button>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: '#888' }}>No products yet</div>
        )}
      </div>
    </div>
  );
}