'use client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const { user } = useAuth();
  const { count } = useCart();
  const pathname = usePathname();

  const isActive = (href) => pathname === href;

  const navItems = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/wishlist', label: 'Wishlist', icon: '❤️' },
    { href: '/cart', label: 'Cart', icon: '🛒', badge: count },
    user ? { href: '/profile', label: 'Profile', icon: '👤' } : { href: '/login', label: 'Login', icon: '🔑' },
  ];

  return (
    <>
      <div style={{ height: 70 }} />
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
        background: 'var(--bg-primary)',
        borderTop: '1px solid var(--border-color)',
        display: 'none',
      }}
      id="bottomNav"
      >
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: 70 }}>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: 4, textDecoration: 'none',
              color: isActive(item.href) ? '#e60023' : 'var(--text-secondary)',
              fontSize: 24,
              position: 'relative',
            }}>
              <span>{item.icon}</span>
              <span style={{ fontSize: 10, fontWeight: 600 }}>{item.label}</span>
              {item.badge > 0 && (
                <span style={{
                  position: 'absolute', top: 0, right: 12,
                  background: '#e60023', color: '#fff',
                  borderRadius: '50%', width: 16, height: 16,
                  fontSize: 10, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </div>
      </nav>
      <style>{`
        @media (max-width: 700px) {
          #bottomNav { display: flex; }
          nav { position: relative; }
        }
      `}</style>
    </>
  );
}