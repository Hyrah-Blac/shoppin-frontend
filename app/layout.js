import './globals.css';
import Providers from './providers';
import NavbarWrapper from './NavbarWrapper';
import Toast from '@/components/Toast';
import BackToTop from '@/components/BackToTop';

export const metadata = {
  title: 'ShopPin',
  description: 'Discover and save products you love',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <NavbarWrapper />
          <main>{children}</main>
          <BackToTop />
          <Toast />
        </Providers>
      </body>
    </html>
  );
}