import { getAllProducts as getAllProductsAPI } from "../service/product.api.js";

export const createProductSlice = (set, get) => ({
    
    sellerProducts: [],
    products: [],

    productPagination: {
        page: 1,
        limit: 9,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false
    },
    productsLoading: false,
    productsError: null,


    setSellerProducts: (sellerProducts) =>
         set({ 
            sellerProducts
         }),

    setProducts: (products) =>
         set({
             products
             }),

   
    getAllProducts: async ({ page = 1, limit = 9, category, featured, sort } = {}) => {
        set({ productsLoading: true, productsError: null });

        try {
            const data = await getAllProductsAPI({ page, limit, category, featured, sort });

            set({
                products: data.products || [],
                productPagination: data.pagination || {
                    page: 1,
                    limit: 9,
                    total: 0,
                    totalPages: 0,
                    hasNext: false,
                    hasPrev: false
                },
                productsLoading: false
            });

            return { success: true, data };
        } catch (err) {
            set({
                productsError: err.message || "Failed to fetch products",
                productsLoading: false
            });
            return { success: false, error: err.message };
        }
    }
});