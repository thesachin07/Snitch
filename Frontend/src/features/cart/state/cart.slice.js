const guestCartStorageKey = "snitch-guest-cart";

const getGuestCart = () => {
  try {
    const storedCart = localStorage.getItem(guestCartStorageKey);
    return storedCart ? JSON.parse(storedCart) : { items: [] };
  } catch {
    return { items: [] };
  }
};

const saveGuestCart = (cart) => {
  try {
    localStorage.setItem(guestCartStorageKey, JSON.stringify(cart));
  } catch {}
};

const calculateTotalPrice = (items) => {
  if (!Array.isArray(items)) return 0;
  return items.reduce((total, item) => {
    const amount = Number(
      item.currentPrice?.amount ?? item.price?.amount ?? 0,
    );
    const quantity = Number(item.quantity ?? 0);
    return total + amount * quantity;
  }, 0);
};

const normalizeCart = (cart) => ({
  ...cart,
  items: Array.isArray(cart.items) ? cart.items : [],
  totalPrice: calculateTotalPrice(cart.items),
});

export const createCartSlice = (set) => ({
  cart: normalizeCart(getGuestCart()),
  quantities: {},

  setCart: (cart) =>
    set({
      cart: normalizeCart(cart),
      quantities: {},
    }),

  setGuestCart: (cart) => {
    const normalizedCart = normalizeCart(cart);
    saveGuestCart(normalizedCart);
    set({ cart: normalizedCart, quantities: {} });
  },

  loadGuestCart: () =>
    set({
      cart: normalizeCart(getGuestCart()),
      quantities: {},
    }),

  addItem: (item) =>
    set((state) => {
      const items = [...state.cart.items, item];
      return {
        cart: {
          ...state.cart,
          items,
          totalPrice: calculateTotalPrice(items),
        },
      };
    }),

  incrementCartItem: ({ itemId }) =>
    set((state) => {
      const items = state.cart.items.map((item) =>
        item._id === itemId
          ? { ...item, quantity: Number(item.quantity ?? 0) + 1 }
          : item,
      );
      return {
        cart: {
          ...state.cart,
          items,
          totalPrice: calculateTotalPrice(items),
        },
      };
    }),

  decrementCartItem: ({ itemId }) =>
    set((state) => {
      const items = state.cart.items
        .map((item) =>
          item._id === itemId
            ? { ...item, quantity: Math.max(Number(item.quantity ?? 1) - 1, 0) }
            : item,
        )
        .filter((item) => item.quantity > 0);
      return {
        cart: {
          ...state.cart,
          items,
          totalPrice: calculateTotalPrice(items),
        },
      };
    }),

  removeCartItem: ({ itemId }) =>
    set((state) => {
      const items = state.cart.items.filter((item) => item._id !== itemId);
      return {
        cart: {
          ...state.cart,
          items,
          totalPrice: calculateTotalPrice(items),
        },
      };
    }),

  changeQty: (itemId, delta) =>
    set((state) => {
      const items = state.cart.items
        .map((item) =>
          item._id === itemId
            ? { ...item, quantity: Math.max(Number(item.quantity ?? 1) + delta, 0) }
            : item,
        )
        .filter((item) => item.quantity > 0);
      return {
        cart: {
          ...state.cart,
          items,
          totalPrice: calculateTotalPrice(items),
        },
      };
    }),
});