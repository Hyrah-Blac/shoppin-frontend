'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { uploadToCloudinary } from '@/lib/cloudinary';
import api from '@/lib/api';

const CATEGORIES = ['general', 'fashion', 'home-decor', 'beauty', 'electronics', 'jewellery', 'art', 'shoes', 'bags'];

export default function UploadPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [tags, setTags] = useState('');
  const [category, setCategory] = useState('general');
  const [link, setLink] = useState('');
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(selected);
    setPreviews(selected.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!files.length) { setError('Please select at least one image'); return; }
    setUploading(true);
    setError('');
    try {
      const uploaded = await Promise.all(files.map(uploadToCloudinary));
      const tagList = tags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean);
      await api.post('/products', {
        title, description, price: Number(price),
        images: uploaded, tags: tagList, category, link,
      });
      router.push('/');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 60 }}>Loading...</div>;
  if (!user) return null;

  const inputStyle = {
    width: '100%', height: 44, border: '1px solid #ddd',
    borderRadius: 12, padding: '0 14px', fontSize: 14, outline: 'none',
  };

  return (
    <div style={{ maxWidth: 560, margin: '32px auto', padding: '0 16px' }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: 32 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Upload a product</h2>

        {error && (
          <div style={{
            background: '#fff0f0', color: '#c0001e',
            padding: '8px 12px', borderRadius: 8,
            fontSize: 13, marginBottom: 16,
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <label style={{
            border: '2px dashed #ddd', borderRadius: 16,
            minHeight: 160, display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer', padding: 12,
          }}>
            {previews.length > 0
              ? <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {previews.map((p, i) => (
                    <img key={i} src={p} alt="" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 10 }} />
                  ))}
                </div>
              : <div style={{ textAlign: 'center', color: '#888' }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>+</div>
                  <div>Click to select images</div>
                </div>
            }
            <input type="file" multiple accept="image/*" onChange={handleFiles} style={{ display: 'none' }} />
          </label>

          <input placeholder="Product title *" required value={title} onChange={(e) => setTitle(e.target.value)} style={inputStyle} />

          <textarea
            placeholder="Description"
            value={description} onChange={(e) => setDescription(e.target.value)}
            style={{ ...inputStyle, height: 80, padding: '10px 14px', resize: 'vertical' }}
          />

          <input placeholder="Price (KSh) *" type="number" required min="0"
            value={price} onChange={(e) => setPrice(e.target.value)} style={inputStyle} />

          <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          <input placeholder="Tags (comma separated e.g. linen, eco, bags)"
            value={tags} onChange={(e) => setTags(e.target.value)} style={inputStyle} />

          <input placeholder="External link (optional)"
            value={link} onChange={(e) => setLink(e.target.value)} style={inputStyle} />

          <button type="submit" disabled={uploading} style={{
            height: 48, background: '#e60023', color: '#fff',
            border: 'none', borderRadius: 12, fontSize: 15,
            fontWeight: 600, marginTop: 8, opacity: uploading ? 0.6 : 1,
          }}>
            {uploading ? 'Uploading...' : 'Publish product'}
          </button>
        </form>
      </div>
    </div>
  );
}