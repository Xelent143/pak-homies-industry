import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";

export interface CartItem {
  id: string; // local cart item id
  productId: number;
  slug: string;
  title: string;
  mainImage: string;
  selectedSize?: string;
  selectedColor?: string;
  quantity: number;
  unitPrice: number; // resolved from slab
  category: string;
}

interface CartStore {
  sessionId: string;
  items: CartItem[];
  isOpen: boolean;
  // Actions
  addItem: (item: Omit<CartItem, "id">) => void;
  updateQty: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  // Computed
  totalItems: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      sessionId: nanoid(16),
      items: [],
      isOpen: false,

      addItem: (item) => {
        set(state => {
          const existing = state.items.find(
            i => i.productId === item.productId && i.selectedSize === item.selectedSize
          );
          if (existing) {
            return {
              items: state.items.map(i =>
                i.id === existing.id
                  ? { ...i, quantity: i.quantity + item.quantity, unitPrice: item.unitPrice }
                  : i
              ),
              isOpen: true,
            };
          }
          return {
            items: [...state.items, { ...item, id: nanoid(8) }],
            isOpen: true,
          };
        });
      },

      updateQty: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set(state => ({
          items: state.items.map(i => i.id === id ? { ...i, quantity } : i),
        }));
      },

      removeItem: (id) => {
        set(state => ({ items: state.items.filter(i => i.id !== id) }));
      },

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set(state => ({ isOpen: !state.isOpen })),

      totalItems: () => get().items.reduce((sum: number, i: CartItem) => sum + i.quantity, 0),
      subtotal: () => get().items.reduce((sum: number, i: CartItem) => sum + i.unitPrice * i.quantity, 0),
    }),
    {
      name: "xelent-cart",
      partialize: (state) => ({
        sessionId: state.sessionId,
        items: state.items,
      }),
    }
  )
);
