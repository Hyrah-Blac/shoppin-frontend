'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

const CATEGORIES = ['general','fashion','home-decor','beauty','electronics','jewellery','art','shoes','bags'];

export default function EditProductPage() {
  const { id } = useParams();
  const { user, loading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ title:'', description:'', price:'', originalPrice:'', stock:'', tags:'', category:'general', link:'' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) router.push('/');
  }, [user, loading, router]);

  useEffect(() => {
    api.get(`/products/${id}`).then((r) => {
      const p = r.data;
      setForm({
        title: p.title || '',
        description: p.description || '',
        price: p.price || '',
        originalPrice: p.originalPrice || '',
        stock: p.stock || '',
        tags: p.tags?.join(', ') || '',
        category: p.category || 'general',
        link: p.link || '',
      });
    });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const tagList = form.tags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean);
      await api.put(`/products/${id}`, {
        ...form,
        price: Number(form.price),
        originalPrice: Number(form.originalPrice) || 0,
        stock: Number(form.stock) || 0,
        tags: tagList,
      });
      router.push('/admin/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) return <div style={{ textAlign: 'center', padding: 60 }}>Loading...</div>;

  const inputStyle = {
    width: '100%', height: 44, border: '1px solid #ddd',
    borderRadius: 12, padding: '0 14px', fontSize: 14, outline: 'none',
  };

  return (
    <div style={{ maxWidth: 600, margin: '32px auto', padding: '0 16px' }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <button onClick={() => router.back()} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}>←</button>
          <h2 style={{ fontSize: 22, fontWeight: 700 }}>Edit product</h2>
        </div>

        {error && <div style={{ background: '#fff0f0', color: '#c0001e', padding: '8px 12px', borderRadius: 8, fontSize: 13, marginBottom: 16 }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input placeholder="Title *" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} style={inputStyle} />
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
            style={{ ...inputStyle, height: 80, padding: '10px 14px', resize: 'vertical' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <input placeholder="Price (KSh) *" type="number" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} style={inputStyle} />
            <input placeholder="Original price" type="number" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} style={inputStyle} />
          </div>
          <input placeholder="Stock" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} style={inputStyle} />
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={inputStyle}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <input placeholder="Tags (comma separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} style={inputStyle} />
          <input placeholder="External link" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} style={inputStyle} />

          <button type="submit" disabled={saving} style={{
            height: 48, background: '#111', color: '#fff',
            border: 'none', borderRadius: 12, fontSize: 15,
            fontWeight: 600, marginTop: 8, opacity: saving ? 0.6 : 1,
          }}>
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </div>
    </div>
  );
}