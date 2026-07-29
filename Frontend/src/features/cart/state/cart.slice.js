const getCartTotal = (items = []) =>
    items.reduce((sum, item) => {
        const priceAmount = item?.price?.amount ?? item?.product?.price?.amount ?? 0;
        return sum + Number(priceAmount) * Number(item?.quantity ?? 1);
    }, 0);

const getCartItemId = (item) =>
    item?._id ??
    (typeof item?.product === 'string'
        ? `${item.product}-${item.variant ?? 'unknown'}`
        : `${item?.product?._id ?? 'unknown'}-${item?.variant ?? 'unknown'}`);

const getQuantitiesMap = (items = []) =>
    items.reduce((acc, item) => {
        const itemId = getCartItemId(item);
        acc[itemId] = item?.quantity ?? 1;
        return acc;
    }, {});

export const createCartSlice = (set) => ({
    cart: {
        items: [],
        totalPrice: 0,
        currency: 'INR',
    },
    quantities: {},

    setCart: (cart) =>
        set((state) => ({
            cart: {
                ...state.cart,
                ...(cart ?? {}),
                items: cart?.items ?? [],
                totalPrice: cart?.totalPrice ?? getCartTotal(cart?.items ?? []),
                currency: cart?.currency ?? state.cart.currency ?? 'INR',
            },
            quantities: getQuantitiesMap(cart?.items ?? []),
        })),

    addItem: (item) =>
        set((state) => {
            const existingItemIndex = state.cart.items.findIndex((existingItem) => {
                const existingProductId =
                    typeof existingItem?.product === 'string'
                        ? existingItem.product
                        : existingItem?.product?._id;

                return (
                    existingProductId === (typeof item?.product === 'string' ? item.product : item?.product?._id) &&
                    existingItem?.variant === item?.variant
                );
            });

            const nextItems = existingItemIndex > -1
                ? state.cart.items.map((existingItem, index) =>
                    index === existingItemIndex
                        ? { ...existingItem, quantity: (existingItem.quantity ?? 1) + (item?.quantity ?? 1) }
                        : existingItem
                )
                : [...state.cart.items, item];

            return {
                cart: {
                    ...state.cart,
                    items: nextItems,
                    totalPrice: getCartTotal(nextItems),
                },
                quantities: getQuantitiesMap(nextItems),
            };
        }),

    incrementCartItem: (itemId) =>
        set((state) => {
            const nextItems = state.cart.items.map((item) =>
                item._id === itemId
                    ? {
                          ...item,
                          quantity: (item.quantity ?? 1) + 1,
                      }
                    : item
            );

            return {
                cart: {
                    ...state.cart,
                    items: nextItems,
                    totalPrice: getCartTotal(nextItems),
                },
                quantities: getQuantitiesMap(nextItems),
            };
        }),

    changeQty: (itemId, delta) =>
        set((state) => {
            const nextItems = state.cart.items
                .map((item) => {
                    if (item._id !== itemId) {
                        return item;
                    }

                    const nextQuantity = (item.quantity ?? 1) + delta;
                    return nextQuantity > 0 ? { ...item, quantity: nextQuantity } : null;
                })
                .filter(Boolean);

            return {
                cart: {
                    ...state.cart,
                    items: nextItems,
                    totalPrice: getCartTotal(nextItems),
                },
                quantities: getQuantitiesMap(nextItems),
            };
        }),

    removeCartItem: (itemId) =>
        set((state) => {
            const nextItems = state.cart.items.filter((item) => item._id !== itemId);

            return {
                cart: {
                    ...state.cart,
                    items: nextItems,
                    totalPrice: getCartTotal(nextItems),
                },
                quantities: getQuantitiesMap(nextItems),
            };
        }),
});