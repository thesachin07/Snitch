import { createProduct, getSellerProducts } from "../service/product.api";

export const useProduct = () => {

    async function handleCreateProduct(formData) {
        const data = await createProduct(formData);
        return data.product;
    }

    async function handleGetSellerProduct() {
        const data = await getSellerProducts();
        return data.products;
    }

    return {
        handleCreateProduct,
        handleGetSellerProduct,
    };
};