import useAppStore from "../../../app/app.store";
import { addItemToCart, getCart } from "../service/cart.api";

export const useCart = () => {

    const addItemToStore = useAppStore((state) => state.addItem);
    const setCartInStore = useAppStore((state) => state.setCart);

    async function handleAddItem({ productId, variantId }) {
        const data = await addItemToCart({ productId, variantId });

        addItemToStore(data.item);  
        return data;
    }

   async function handleGetCart() {
        const data = await getCart();
      
        if (setCartInStore) setCartInStore(data.cart); 

        return data; 
    }

    return {
        handleAddItem,
          handleGetCart,
    };
};