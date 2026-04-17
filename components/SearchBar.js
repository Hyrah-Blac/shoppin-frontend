'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function SearchBar() {
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const ref = useRef(null);

  useEffect(() => {
    if (search.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const { data } = await api.get(`/products?search=${search}&limit=5`);
        setSuggestions(data.products);
      } catch (err) {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const handleSelect = (product) => {
    router.push(`/product/${product._id}`);
    setSearch('');
    setSuggestions([]);
    setOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
      setSuggestions([]);
      setOpen(false);
    }
  };

  return (
    <div style={{ position: 'relative', flex: 1 }} ref={ref}>
      <form onSubmit={handleSubmit}>
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search products..."
          style={{
            width: '100%', height: 40, borderRadius: 24,
            border: 'none', background: 'var(--bg-secondary)',
            padding: '0 16px', fontSize: 14, outline: 'none',
          }}
        />
      </form>

      {open && suggestions.length > 0 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: 'var(--bg-primary)',
          border: '1px solid var(--border-color)',
          borderTop: 'none', borderRadius: '0 0 16px 16px',
          maxHeight: 300, overflow: 'auto', zIndex: 50,
        }}>
          {suggestions.map((p) => (
            <button
              key={p._id}
              onClick={() => handleSelect(p)}
              style={{
                width: '100%', padding: '10px 16px', border: 'none',
                background: 'transparent', textAlign: 'left',
                color: 'var(--text-primary)', cursor: 'pointer',
                borderBottom: '1px solid var(--border-color)',
                fontSize: 13,
              }}
            >
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                {p.images?.[0]?.url && (
                  <img src={p.images[0].url} alt="" style={{ width: 32, height: 32, objectFit: 'cover', borderRadius: 6 }} />
                )}
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 500, marginBottom: 2 }}>{p.title}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>KSh {p.price?.toLocaleString()}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}