'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { uploadToCloudinary } from '@/lib/cloudinary';
import api from '@/lib/api';

const CATEGORIES = ['general','fashion','home-decor','beauty','electronics','jewellery','art','shoes','bags'];

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap');

  .np * { box-sizing: border-box; margin: 0; padding: 0; }
  .np {
    min-height: 100vh;
    background: var(--bg-tertiary);
    font-family: system-ui, -apple-system, sans-serif;
    padding: 32px 16px 80px;
    color: var(--text-primary);
  }

  .np-card {
    max-width: 560px;
    margin: 0 auto;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 28px;
    padding: 36px 32px;
    animation: npFadeUp .4s ease both;
  }

  .np-header {
    display: flex; align-items: center; gap: 14px;
    margin-bottom: 28px;
  }
  .np-back {
    width: 38px; height: 38px; border-radius: 50%;
    border: none; background: var(--bg-secondary);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: var(--text-primary);
    transition: background .18s; flex-shrink: 0;
    -webkit-tap-highlight-color: transparent;
  }
  .np-back:hover { background: var(--border-color); }
  .np-title {
    font-family: 'Playfair Display', serif;
    font-size: 24px; font-weight: 900;
    color: var(--text-primary); letter-spacing: -.3px;
  }

  .np-error {
    display: flex; align-items: center; gap: 8px;
    background: rgba(230,0,35,.07);
    border: 1px solid rgba(230,0,35,.2);
    color: var(--accent);
    padding: 11px 14px; border-radius: 12px;
    font-size: 13px; font-weight: 500;
    margin-bottom: 18px;
  }

  .np-form { display: flex; flex-direction: column; gap: 14px; }

  .np-label {
    display: block;
    font-size: 11px; font-weight: 700;
    color: var(--text-tertiary);
    text-transform: uppercase; letter-spacing: .6px;
    margin-bottom: 6px;
  }

  .np-input {
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
  .np-input::placeholder { color: var(--text-tertiary); }
  .np-input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(230,0,35,.1);
  }

  .np-textarea {
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
  .np-textarea::placeholder { color: var(--text-tertiary); }
  .np-textarea:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(230,0,35,.1);
  }

  .np-select-wrap { position: relative; }
  .np-select-wrap::after {
    content: '';
    position: absolute; right: 14px; top: 50%;
    transform: translateY(-50%);
    width: 0; height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 6px solid var(--text-tertiary);
    pointer-events: none;
  }
  .np-select-wrap .np-input { padding-right: 36px; cursor: pointer; }

  .np-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  /* DROPZONE */
  .np-drop {
    border: 2px dashed var(--border-color);
    border-radius: 18px;
    min-height: 160px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; padding: 16px;
    transition: border-color .18s, background .18s;
    position: relative;
  }
  .np-drop:hover { border-color: var(--accent); background: rgba(230,0,35,.03); }
  .np-drop.has-files { border-style: solid; border-color: var(--accent); }
  .np-drop input { display: none; }

  .np-drop-placeholder {
    display: flex; flex-direction: column;
    align-items: center; gap: 10px;
    color: var(--text-tertiary); pointer-events: none;
    text-align: center;
  }
  .np-drop-icon {
    width: 52px; height: 52px; border-radius: 50%;
    background: var(--bg-secondary);
    display: flex; align-items: center; justify-content: center;
  }
  .np-drop-previews {
    display: flex; gap: 8px; flex-wrap: wrap;
    pointer-events: none;
  }
  .np-drop-img {
    width: 80px; height: 80px;
    object-fit: cover; border-radius: 12px;
    border: 2px solid var(--border-color);
  }
  .np-drop-count {
    position: absolute; bottom: 10px; right: 14px;
    font-size: 11px; font-weight: 700;
    color: var(--text-tertiary); pointer-events: none;
  }

  /* PROGRESS */
  .np-progress-wrap {
    height: 3px; border-radius: 999px;
    background: var(--border-color); overflow: hidden;
  }
  .np-progress-bar {
    height: 100%; border-radius: 999px;
    background: var(--accent); transition: width .3s ease;
  }

  /* SUBMIT */
  .np-submit {
    width: 100%; height: 52px;
    background: var(--accent); color: #fff;
    border: none; border-radius: 999px;
    font-size: 15px; font-weight: 700; letter-spacing: .3px;
    cursor: pointer; font-family: inherit;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    box-shadow: 0 4px 18px rgba(230,0,35,.28);
    transition: background .18s, transform .18s, box-shadow .18s, opacity .18s;
    margin-top: 6px;
    -webkit-tap-highlight-color: transparent;
  }
  .np-submit:hover:not(:disabled) {
    background: #ad081b;
    transform: translateY(-2px);
    box-shadow: 0 8px 26px rgba(230,0,35,.35);
  }
  .np-submit:disabled { opacity: .6; cursor: not-allowed; }

  @keyframes npFadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes npSpin { to { transform: rotate(360deg); } }
  .np-spin { animation: npSpin .7s linear infinite; }

  @media (max-width: 480px) {
    .np { padding: 20px 12px 48px; }
    .np-card { padding: 24px 18px; border-radius: 22px; }
    .np-grid { grid-template-columns: 1fr; }
    .np-title { font-size: 20px; }
  }
`;

function injectStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('np-styles')) return;
  const s = document.createElement('style');
  s.id = 'np-styles';
  s.textContent = STYLES;
  document.head.appendChild(s);
}

function Spinner() {
  return (
    <svg className="np-spin" width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
    </svg>
  );
}

export default function NewProductPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [title, setTitle]                   = useState('');
  const [description, setDescription]       = useState('');
  const [price, setPrice]                   = useState('');
  const [originalPrice, setOriginalPrice]   = useState('');
  const [stock, setStock]                   = useState('');
  const [tags, setTags]                     = useState('');
  const [category, setCategory]             = useState('general');
  const [link, setLink]                     = useState('');
  const [files, setFiles]                   = useState([]);
  const [previews, setPreviews]             = useState([]);
  const [uploading, setUploading]           = useState(false);
  const [progress, setProgress]             = useState(0);
  const [error, setError]                   = useState('');

  useEffect(() => { injectStyles(); }, []);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) router.push('/');
  }, [user, loading, router]);

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(selected);
    setPreviews(selected.map((f) => URL.createObjectURL(f)));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (!dropped.length) return;
    setFiles(dropped);
    setPreviews(dropped.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!files.length) { setError('Please select at least one image'); return; }
    setUploading(true);
    setError('');
    setProgress(0);
    try {
      const total = files.length;
      const uploaded = [];
      for (let i = 0; i < total; i++) {
        const result = await uploadToCloudinary(files[i]);
        uploaded.push(result);
        setProgress(Math.round(((i + 1) / total) * 80));
      }
      const tagList = tags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean);
      await api.post('/products', {
        title, description,
        price: Number(price),
        originalPrice: Number(originalPrice) || 0,
        stock: Number(stock) || 0,
        images: uploaded, tags: tagList, category, link,
      });
      setProgress(100);
      setTimeout(() => router.push('/admin/products'), 400);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create product');
    } finally {
      setUploading(false);
    }
  };

  if (loading || !user) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <Spinner />
    </div>
  );

  return (
    <div className="np">
      <div className="np-card">

        {/* HEADER */}
        <div className="np-header">
          <button className="np-back" onClick={() => router.back()} aria-label="Go back">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <h1 className="np-title">Add new product</h1>
        </div>

        {/* ERROR */}
        {error && (
          <div className="np-error">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8"  x2="12"   y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}

        <form className="np-form" onSubmit={handleSubmit}>

          {/* DROPZONE */}
          <div>
            <label className="np-label">Images *</label>
            <label
              className={`np-drop${files.length ? ' has-files' : ''}`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              {files.length > 0 ? (
                <>
                  <div className="np-drop-previews">
                    {previews.map((p, i) => (
                      <img key={i} src={p} alt="" className="np-drop-img" />
                    ))}
                  </div>
                  <span className="np-drop-count">
                    {files.length} image{files.length > 1 ? 's' : ''} selected
                  </span>
                </>
              ) : (
                <div className="np-drop-placeholder">
                  <div className="np-drop-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                      stroke="var(--text-tertiary)" strokeWidth="1.8"
                      strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Click or drag to upload
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                    PNG, JPG, WEBP — up to 10 files
                  </span>
                </div>
              )}
              <input type="file" multiple accept="image/*" onChange={handleFiles} />
            </label>
          </div>

          {/* TITLE */}
          <div>
            <label className="np-label">Title *</label>
            <input className="np-input" placeholder="e.g. Handmade leather tote bag"
              required value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="np-label">Description</label>
            <textarea className="np-textarea" placeholder="Describe the product…"
              value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          {/* PRICE + ORIGINAL */}
          <div className="np-grid">
            <div>
              <label className="np-label">Price (KSh) *</label>
              <input className="np-input" type="number" min="0" required
                placeholder="e.g. 2500"
                value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
            <div>
              <label className="np-label">Original price</label>
              <input className="np-input" type="number" min="0"
                placeholder="Before discount"
                value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} />
            </div>
          </div>

          {/* STOCK + CATEGORY */}
          <div className="np-grid">
            <div>
              <label className="np-label">Stock</label>
              <input className="np-input" type="number" min="0"
                placeholder="e.g. 10"
                value={stock} onChange={(e) => setStock(e.target.value)} />
            </div>
            <div>
              <label className="np-label">Category</label>
              <div className="np-select-wrap">
                <select className="np-input" value={category}
                  onChange={(e) => setCategory(e.target.value)}>
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
            <label className="np-label">Tags</label>
            <input className="np-input"
              placeholder="e.g. linen, handmade, eco-friendly"
              value={tags} onChange={(e) => setTags(e.target.value)} />
          </div>

          {/* LINK */}
          <div>
            <label className="np-label">External link (optional)</label>
            <input className="np-input" type="url"
              placeholder="https://…"
              value={link} onChange={(e) => setLink(e.target.value)} />
          </div>

          {/* PROGRESS */}
          {uploading && (
            <div className="np-progress-wrap">
              <div className="np-progress-bar" style={{ width: `${progress}%` }} />
            </div>
          )}

          {/* SUBMIT */}
          <button type="submit" className="np-submit" disabled={uploading}>
            {uploading ? (
              <><Spinner /> Uploading… {progress}%</>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 16 12 12 8 16"/>
                  <line x1="12" y1="12" x2="12" y2="21"/>
                  <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
                </svg>
                Create product
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}