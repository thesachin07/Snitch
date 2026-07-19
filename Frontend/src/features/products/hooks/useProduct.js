import useAppStore from "../../../app/app.store";
import { createProduct, getSellerProducts, getAllProducts, getProductById } from "../service/product.api";

export const useProduct = () => {

 const setProducts = useAppStore((state) => state.setProducts);
    const setSellerProducts = useAppStore(
        (state) => state.setSellerProducts
    );


    async function handleCreateProduct(formData) {
        const data = await createProduct(formData);
        return data.product;
    }

    async function handleGetSellerProduct() {
        const data = await getSellerProducts();
        //  console.log("API Response:", data);
          setSellerProducts(data.products);
        return data.products;
    }
       
    async function handleGetAllProducts(){
        const data = await getAllProducts()
//  console.log("API Response:", data);
        setProducts(data.products);
        // console.log("Products from API:", data.products);
        return data.products;
    }

    async function handleGetProductById(productId){
        const data = await getProductById(productId)
    return data.product
    }

async function handleAddProductVariant(productId, newProductVariant){
    const data = await addProductVariant(productId, newProductVariant)
}

    return {
        handleCreateProduct,
        handleGetSellerProduct,
        handleGetAllProducts,
        handleGetProductById,
    };
};