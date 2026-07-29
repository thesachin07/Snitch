import useAppStore from "../../../app/app.store";
import { addItemToCart, getCart } from "../service/cart.api";

export const useCart = () => {
    const setCartInStore = useAppStore((state) => state.setCart);

    async function handleAddItem({ productId, variantId }) {
        const response = await addItemToCart({ productId, variantId });

        if (!response?.success) {
            return response;
        }

        const cartResponse = await getCart();
        if (cartResponse?.cart) {
            setCartInStore(cartResponse.cart);
        }

        return cartResponse;
    }

    async function handleGetCart() {
        const data = await getCart();

        if (data?.cart && setCartInStore) {
            setCartInStore(data.cart);
        }

        return data;
    }

    return {
        handleAddItem,
        handleGetCart,
    };
};