import useAppStore from "../../../app/app.store";
import { createProduct, getSellerProducts } from "../service/product.api";

export const useProduct = () => {


    const setSellerProducts = useAppStore(
        (state) => state.setSellerProducts
    );


    async function handleCreateProduct(formData) {
        const data = await createProduct(formData);
        return data.product;
    }

    async function handleGetSellerProduct() {
        const data = await getSellerProducts();
          setSellerProducts(data.products);
        return data.products;
    }
       

    return {
        handleCreateProduct,
        handleGetSellerProduct,
    };
};