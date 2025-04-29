import { create } from 'zustand';

export const useCartStore = create((set) => ({
  cartItems: [],
  addToCart: (product) => set((state) => ({
    cartItems: [...state.cartItems, product],
  })),
  removeFromCart: (id) => set((state) => ({
    cartItems: state.cartItems.filter(item => item.id !== id),
  })),
  clearCart: () => set({ cartItems: [] }),
}));
