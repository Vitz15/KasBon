import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  items: [],
  customer: null,
  paymentMethod: 'cash',
  amountPaid: 0,
  dueDate: '',
  notes: '',

  setCustomer: (customer) => set({ customer }),
  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
  setAmountPaid: (amountPaid) => set({ amountPaid }),
  setDueDate: (dueDate) => set({ dueDate }),
  setNotes: (notes) => set({ notes }),

  addItem: (product) => {
    const { items } = get();
    const existingIndex = items.findIndex((item) => item.product.id === product.id);

    if (existingIndex > -1) {
      const newItems = [...items];
      // Check stock limit
      if (newItems[existingIndex].quantity < product.stock) {
        newItems[existingIndex].quantity += 1;
        set({ items: newItems });
      }
    } else {
      if (product.stock > 0) {
        set({ items: [...items, { product, quantity: 1 }] });
      }
    }
  },

  removeItem: (productId) => {
    const { items } = get();
    set({ items: items.filter((item) => item.product.id !== productId) });
  },

  updateQuantity: (productId, quantity) => {
    const { items } = get();
    const newItems = items.map((item) => {
      if (item.product.id === productId) {
        const qty = Math.max(1, Math.min(quantity, item.product.stock));
        return { ...item, quantity: qty };
      }
      return item;
    });
    set({ items: newItems });
  },

  clearCart: () => set({ 
    items: [], 
    customer: null, 
    paymentMethod: 'cash', 
    amountPaid: 0, 
    dueDate: '', 
    notes: '' 
  }),

  getTotalAmount: () => {
    const { items } = get();
    return items.reduce((sum, item) => sum + (item.quantity * item.product.selling_price), 0);
  },

  getTotalQty: () => {
    const { items } = get();
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }
}));