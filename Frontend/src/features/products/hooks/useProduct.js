import useAppStore from "../../../app/app.store";
import {
    createProduct,
    getSellerProducts,
    getAllProducts,
    getProductById,
    addProductVariant,
    updateProduct,
    deleteProduct,
    updateProductVariant,
    deleteProductVariant
} from "../service/product.api";

export const useProduct = () => {
    
    const products = useAppStore((state) => state.products);

    const setProducts = useAppStore((state) => state.setProducts);
    const setSellerProducts = useAppStore((state) => state.setSellerProducts);

    // Pagination selectors
    const pagination = useAppStore((state) => state.productPagination);
    const productsLoading = useAppStore((state) => state.productsLoading);
    const productsError = useAppStore((state) => state.productsError);
    const getAllProductsStore = useAppStore((state) => state.getAllProducts);

    // ─── EXISTING HANDLERS ───
    async function handleCreateProduct(formData) {
        const data = await createProduct(formData);
        return data.product;
    }

    async function handleGetSellerProduct() {
        const data = await getSellerProducts();
        setSellerProducts(data.products);
        return data.products;
    }

    async function handleGetAllProducts(paramsOrCategory) {
        
        if (typeof paramsOrCategory === "object" && paramsOrCategory !== null) {
            return await getAllProductsStore(paramsOrCategory);
        }

        
        const data = await getAllProducts(paramsOrCategory);
        setProducts(data.products);
        return data.products;
    }

    async function handleGetProductById(productId) {
        const data = await getProductById(productId);
        return data.product;
    }

    async function handleAddProductVariant(productId, newProductVariant) {
        const data = await addProductVariant(productId, newProductVariant);
        return data;
    }

    async function handleUpdateProduct(productId, updates) {
        const data = await updateProduct(productId, updates);
        return data;
    }

    async function handleDeleteProduct(productId) {
        const data = await deleteProduct(productId);
        return data;
    }

    async function handleUpdateProductVariant(productId, variantId, updates) {
        const data = await updateProductVariant(productId, variantId, updates);
        return data;
    }

    async function handleDeleteProductVariant(productId, variantId) {
        const data = await deleteProductVariant(productId, variantId);
        return data;
    }

    return {
        // ✅ YE ADD KARO (products!)
        products,

        handleCreateProduct,
        handleGetSellerProduct,
        handleGetAllProducts,
        handleGetProductById,
        handleAddProductVariant,
        handleUpdateProduct,
        handleDeleteProduct,
        handleUpdateProductVariant,
        handleDeleteProductVariant,
        pagination,
        productsLoading,
        productsError
    };
};