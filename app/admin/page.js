'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap');

  .ad * { box-sizing: border-box; margin: 0; padding: 0; }
  .ad {
    min-height: 100vh;
    background: var(--bg-tertiary);
    font-family: system-ui, -apple-system, sans-serif;
    color: var(--text-primary);
    padding: 32px 16px 80px;
  }

  .ad-inner { max-width: 1100px; margin: 0 auto; }

  .ad-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 28px;
    flex-wrap: wrap;
  }
  .ad-title {
    font-family: 'Playfair Display', serif;
    font-size: 28px; font-weight: 900;
    color: var(--text-primary); letter-spacing: -.4px;
    margin-bottom: 3px;
  }
  .ad-sub { font-size: 13px; color: var(--text-secondary); }

  .ad-add-btn {
    display: inline-flex; align-items: center; gap: 7px;
    background: var(--accent); color: #fff;
    padding: 10px 20px; border-radius: 999px;
    font-size: 13px; font-weight: 700;
    text-decoration: none;
    box-shadow: 0 3px 12px rgba(230,0,35,.25);
    transition: background .18s, transform .18s;
    white-space: nowrap; flex-shrink: 0;
  }
  .ad-add-btn:hover { background: #ad081b; transform: translateY(-1px); }

  .ad-stats {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 12px;
    margin-bottom: 20px;
  }
  .ad-stat {
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 20px;
    padding: 20px 18px;
  }
  .ad-stat-icon {
    width: 36px; height: 36px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 12px;
  }
  .ad-stat-label {
    font-size: 11px; font-weight: 700;
    color: var(--text-tertiary);
    text-transform: uppercase; letter-spacing: .5px;
    margin-bottom: 6px;
  }
  .ad-stat-value {
    font-family: 'Playfair Display', serif;
    font-size: 26px; font-weight: 900;
  }

  .ad-links {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-bottom: 20px;
  }
  .ad-link-card {
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 20px;
    padding: 22px 20px;
    text-decoration: none;
    display: flex; align-items: center; gap: 14px;
  }
  .ad-link-icon {
    width: 46px; height: 46px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
  }
  .ad-link-label {
    font-size: 14px; font-weight: 700;
  }
  .ad-link-sub {
    font-size: 12px; color: var(--text-secondary);
  }
  .ad-link-arrow {
    margin-left: auto;
  }
`;

function injectStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('ad-styles')) return;
  const s = document.createElement('style');
  s.id = 'ad-styles';
  s.textContent = STYLES;
  document.head.appendChild(s);
}

const QUICK_LINKS = [
  {
    href: '/admin/products',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
    ),
    iconBg: 'rgba(139,92,246,.1)',
    label: 'Products',
    sub: 'Manage listings',
  },
  {
    href: '/admin/orders',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4"/>
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
    ),
    iconBg: 'rgba(16,185,129,.1)',
    label: 'Orders',
    sub: 'View & update statuses',
  },
  {
    href: '/admin/users',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      </svg>
    ),
    iconBg: 'rgba(59,130,246,.1)',
    label: 'Users',
    sub: 'Manage accounts',
  },
];

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => { injectStyles(); }, []);

  if (loading || !user) return <div className="ad">Loading…</div>;

  return (
    <div className="ad">
      <div className="ad-inner">

        <div className="ad-links">
          {QUICK_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="ad-link-card">
              <div className="ad-link-icon" style={{ background: link.iconBg }}>
                {link.icon}
              </div>
              <div>
                <p className="ad-link-label">{link.label}</p>
                <p className="ad-link-sub">{link.sub}</p>
              </div>
              <div className="ad-link-arrow">→</div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}