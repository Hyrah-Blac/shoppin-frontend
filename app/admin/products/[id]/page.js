'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

const CATEGORIES = ['general','fashion','home-decor','beauty','electronics','jewellery','art','shoes','bags'];

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap');

  .ep * { box-sizing: border-box; margin: 0; padding: 0; }
  .ep {
    min-height: 100vh;
    background: var(--bg-tertiary);
    font-family: system-ui, -apple-system, sans-serif;
    padding: 32px 16px 80px;
    color: var(--text-primary);
  }

  .ep-card {
    max-width: 560px;
    margin: 0 auto;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 28px;
    padding: 36px 32px;
    animation: epFadeUp .4s ease both;
  }

  .ep-header {
    display: flex; align-items: center; gap: 14px;
    margin-bottom: 28px;
  }
  .ep-back {
    width: 38px; height: 38px; border-radius: 50%;
    border: none; background: var(--bg-secondary);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: var(--text-primary);
    transition: background .18s;
    flex-shrink: 0;
    -webkit-tap-highlight-color: transparent;
  }
  .ep-back:hover { background: var(--border-color); }

  .ep-title {
    font-family: 'Playfair Display', serif;
    font-size: 24px; font-weight: 900;
    color: var(--text-primary); letter-spacing: -.3px;
  }

  .ep-error {
    display: flex; align-items: center; gap: 8px;
    background: rgba(230,0,35,.07);
    border: 1px solid rgba(230,0,35,.2);
    color: var(--accent);
    padding: 11px 14px; border-radius: 12px;
    font-size: 13px; font-weight: 500;
    margin-bottom: 18px;
  }

  .ep-form { display: flex; flex-direction: column; gap: 14px; }

  .ep-label {
    display: block;
    font-size: 11px; font-weight: 700;
    color: var(--text-tertiary);
    text-transform: uppercase; letter-spacing: .6px;
    margin-bottom: 6px;
  }

  .ep-input {
    width: 100%; height: 48px;
    background: var(--bg-secondary);
    border: 1.5px solid var(--border-color);
    border-radius: 14px;
    padding: 0 16px;
    font-size: 14px; color: var(--text-primary);
    font-family: system-ui, sans-serif;
    outline: none;
    transition: border-color .18s, box-shadow .18s;
    appearance: none;
  }
  .ep-input::placeholder { color: var(--text-tertiary); }
  .ep-input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(230,0,35,.1);
  }

  .ep-textarea {
    width: 100%; min-height: 90px;
    background: var(--bg-secondary);
    border: 1.5px solid var(--border-color);
    border-radius: 14px;
    padding: 13px 16px;
    font-size: 14px; color: var(--text-primary);
    font-family: system-ui, sans-serif;
    outline: none; resize: vertical;
    transition: border-color .18s, box-shadow .18s;
  }
  .ep-textarea::placeholder { color: var(--text-tertiary); }
  .ep-textarea:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(230,0,35,.1);
  }

  .ep-select-wrap { position: relative; }
  .ep-select-wrap::after {
    content: '';
    position: absolute; right: 14px; top: 50%;
    transform: translateY(-50%);
    width: 0; height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 6px solid var(--text-tertiary);
    pointer-events: none;
  }
  .ep-select-wrap .ep-input { padding-right: 36px; cursor: pointer; }

  .ep-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .ep-submit {
    width: 100%; height: 52px;
    background: var(--text-primary); color: var(--bg-primary);
    border: none; border-radius: 999px;
    font-size: 15px; font-weight: 700; letter-spacing: .3px;
    cursor: pointer; font-family: inherit;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: opacity .18s, transform .18s;
    margin-top: 6px;
    -webkit-tap-highlight-color: transparent;
  }
  .ep-submit:hover:not(:disabled) { opacity: .85; transform: translateY(-2px); }
  .ep-submit:disabled { opacity: .5; cursor: not-allowed; }

  @keyframes epFadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes epSpin { to { transform: rotate(360deg); } }
  .ep-spin { animation: epSpin .7s linear infinite; }

  @media (max-width: 480px) {
    .ep { padding: 20px 12px 48px; }
    .ep-card { padding: 24px 18px; border-radius: 22px; }
    .ep-grid { grid-template-columns: 1fr; }
    .ep-title { font-size: 20px; }
  }
`;

function injectStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('ep-styles')) return;
  const s = document.createElement('style');
  s.id = 'ep-styles';
  s.textContent = STYLES;
  document.head.appendChild(s);
}

function Spinner() {
  return (
    <svg className="ep-spin" width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
    </svg>
  );
}

export default function EditProductPage() {
  const { id } = useParams();
  const { user, loading } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    title: '', description: '', price: '', originalPrice: '',
    stock: '', tags: '', category: 'general', link: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState('');

  useEffect(() => { injectStyles(); }, []);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) router.push('/');
  }, [user, loading, router]);

  useEffect(() => {
    api.get(`/products/${id}`).then((r) => {
      const p = r.data;
      setForm({
        title:         p.title         || '',
        description:   p.description   || '',
        price:         p.price         || '',
        originalPrice: p.originalPrice || '',
        stock:         p.stock         || '',
        tags:          p.tags?.join(', ') || '',
        category:      p.category      || 'general',
        link:          p.link          || '',
      });
    });
  }, [id]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const tagList = form.tags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean);
      await api.put(`/products/${id}`, {
        ...form,
        price:         Number(form.price),
        originalPrice: Number(form.originalPrice) || 0,
        stock:         Number(form.stock) || 0,
        tags:          tagList,
      });
      router.push('/admin/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <Spinner />
    </div>
  );

  return (
    <div className="ep">
      <div className="ep-card">

        {/* HEADER */}
        <div className="ep-header">
          <button className="ep-back" onClick={() => router.back()} aria-label="Go back">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <h1 className="ep-title">Edit product</h1>
        </div>

        {/* ERROR */}
        {error && (
          <div className="ep-error">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8"  x2="12"   y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}

        <form className="ep-form" onSubmit={handleSubmit}>

          {/* TITLE */}
          <div>
            <label className="ep-label">Title *</label>
            <input className="ep-input" placeholder="Product title" required
              value={form.title} onChange={set('title')} />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="ep-label">Description</label>
            <textarea className="ep-textarea" placeholder="Describe the product…"
              value={form.description} onChange={set('description')} />
          </div>

          {/* PRICE + ORIGINAL PRICE */}
          <div className="ep-grid">
            <div>
              <label className="ep-label">Price (KSh) *</label>
              <input className="ep-input" type="number" min="0" required
                placeholder="e.g. 2500"
                value={form.price} onChange={set('price')} />
            </div>
            <div>
              <label className="ep-label">Original price</label>
              <input className="ep-input" type="number" min="0"
                placeholder="Before discount"
                value={form.originalPrice} onChange={set('originalPrice')} />
            </div>
          </div>

          {/* STOCK + CATEGORY */}
          <div className="ep-grid">
            <div>
              <label className="ep-label">Stock</label>
              <input className="ep-input" type="number" min="0"
                placeholder="e.g. 10"
                value={form.stock} onChange={set('stock')} />
            </div>
            <div>
              <label className="ep-label">Category</label>
              <div className="ep-select-wrap">
                <select className="ep-input" value={form.category} onChange={set('category')}>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c.charAt(0).toUpperCase() + c.slice(1).replace('-', ' ')}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* TAGS */}
          <div>
            <label className="ep-label">Tags</label>
            <input className="ep-input"
              placeholder="e.g. linen, handmade, eco-friendly"
              value={form.tags} onChange={set('tags')} />
          </div>

          {/* LINK */}
          <div>
            <label className="ep-label">External link</label>
            <input className="ep-input" type="url"
              placeholder="https://…"
              value={form.link} onChange={set('link')} />
          </div>

          {/* SUBMIT */}
          <button type="submit" className="ep-submit" disabled={saving}>
            {saving ? (
              <><Spinner /> Saving…</>
            ) : (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Save changes
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}