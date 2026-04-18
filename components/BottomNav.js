'use client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { usePathname } from 'next/navigation';

const icons = {
  home: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  wishlist: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
    </svg>
  ),
  cart: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 01-8 0"/>
    </svg>
  ),
  profile: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  login: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/>
      <polyline points="10 17 15 12 10 7"/>
      <line x1="15" y1="12" x2="3" y2="12"/>
    </svg>
  ),
};

export default function BottomNav() {
  const { user } = useAuth();
  const { count } = useCart();
  const pathname = usePathname();

  const isActive = (href) => pathname === href;

  const navItems = [
    { href: '/',         label: 'Home',    icon: icons.home },
    { href: '/wishlist', label: 'Saved',   icon: icons.wishlist },
    { href: '/cart',     label: 'Cart',    icon: icons.cart,    badge: count },
    user
      ? { href: '/profile', label: 'Profile', icon: icons.profile }
      : { href: '/login',   label: 'Login',   icon: icons.login },
  ];

  return (
    <>
      <div style={{ height: 70 }} />
      <nav
        id="bottomNav"
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
          background: 'var(--bg-primary)',
          borderTop: '1px solid var(--border-color)',
          display: 'none',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: 70 }}>
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                  textDecoration: 'none',
                  color: active ? '#e60023' : 'var(--text-secondary)',
                  position: 'relative',
                  paddingTop: 6,
                }}
              >
                {/* Active indicator dot */}
                {active && (
                  <span style={{
                    position: 'absolute',
                    top: 0,
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    background: '#e60023',
                  }} />
                )}

                {item.icon}

                <span style={{ fontSize: 10, fontWeight: active ? 700 : 500 }}>
                  {item.label}
                </span>

                {/* Cart badge */}
                {item.badge > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: 4,
                    right: '18%',
                    background: '#e60023',
                    color: '#fff',
                    borderRadius: '50%',
                    width: 16,
                    height: 16,
                    fontSize: 9,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid var(--bg-primary)',
                  }}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      <style>{`
        @media (max-width: 700px) {
          #bottomNav { display: flex !important; }
        }
      `}</style>
    </>
  );
}