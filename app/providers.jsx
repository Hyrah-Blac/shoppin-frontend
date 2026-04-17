'use client';

import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { ToastProvider } from '@/context/ToastContext';

export default function Providers({ children }) {
return ( <ThemeProvider> <AuthProvider> <CartProvider> <ToastProvider>
{children} </ToastProvider> </CartProvider> </AuthProvider> </ThemeProvider>
);
}
