'use client';
import { useState, useEffect } from 'react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      style={{
        position: 'fixed', bottom: 80, right: 20, zIndex: 99,
        width: 48, height: 48, borderRadius: '50%',
        background: '#111', color: '#fff',
        border: 'none', fontSize: 20, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        transition: 'all 0.3s',
      }}
      onMouseEnter={(e) => e.target.style.background = '#333'}
      onMouseLeave={(e) => e.target.style.background = '#111'}
    >
      ↑
    </button>
  );
}