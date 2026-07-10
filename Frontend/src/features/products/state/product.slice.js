export const createProductSlice = (set) => ({

    sellerProducts: [],
    products: [],

    setSellerProducts: (sellerProducts) =>
        set({
            sellerProducts,
        }),

    setProducts: (products) =>
        set({
            products,
        }),
});