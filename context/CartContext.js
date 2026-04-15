'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('shoppin_cart');
    if (saved) setCart(JSON.parse(saved));
  }, []);

  const saveCart = (items) => {
    setCart(items);
    localStorage.setItem('shoppin_cart', JSON.stringify(items));
  };

  const addToCart = (product, quantity = 1) => {
    const existing = cart.find((i) => i._id === product._id);
    if (existing) {
      saveCart(cart.map((i) =>
        i._id === product._id ? { ...i, quantity: i.quantity + quantity } : i
      ));
    } else {
      saveCart([...cart, { ...product, quantity }]);
    }
  };

  const removeFromCart = (id) => saveCart(cart.filter((i) => i._id !== id));

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return removeFromCart(id);
    saveCart(cart.map((i) => i._id === id ? { ...i, quantity } : i));
  };

  const clearCart = () => saveCart([]);

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);