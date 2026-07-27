export const createCartSlice = (set) => ({

    cart: {
        items: [],
        totalPrice: 0,
        currency: "INR",
    },

    setCart: (cart) =>
        set({
            cart,
        }),

    addItem: (item) =>
        set((state) => ({
            cart: {
                ...state.cart,
                items: [...state.cart.items, item],
            },
        })),

    incrementCartItem: ({ productId, variantId }) =>
        set((state) => ({
            cart: {
                ...state.cart,
                items: state.cart.items.map((item) =>

                    item.product._id === productId &&
                    item.variant === variantId

                        ? {
                              ...item,
                              quantity: item.quantity + 1,
                          }

                        : item
                ),
            },
        })),

});