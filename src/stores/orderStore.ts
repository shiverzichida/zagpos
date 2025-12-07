import { create } from 'zustand';
import { CartItem, Product, SelectedModifier } from '@/types';

interface OrderState {
  items: CartItem[];
  addItem: (product: Product, modifiers: SelectedModifier[]) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  items: [],

  addItem: (product, modifiers) => {
    const modifierTotal = modifiers.reduce((sum, m) => sum + m.price_adjustment, 0);
    const subtotal = product.price + modifierTotal;
    
    const newItem: CartItem = {
      id: `${product.id}-${Date.now()}`,
      product,
      quantity: 1,
      modifiers,
      subtotal,
    };

    set((state) => ({
      items: [...state.items, newItem],
    }));
  },

  removeItem: (itemId) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== itemId),
    }));
  },

  updateQuantity: (itemId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(itemId);
      return;
    }

    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity,
              subtotal:
                (item.product.price +
                  item.modifiers.reduce((sum, m) => sum + m.price_adjustment, 0)) *
                quantity,
            }
          : item
      ),
    }));
  },

  clearCart: () => {
    set({ items: [] });
  },

  getTotal: () => {
    return get().items.reduce((sum, item) => sum + item.subtotal, 0);
  },
}));
