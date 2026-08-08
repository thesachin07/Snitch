import useAppStore from "../../../app/app.store";
import {
  addItemToCart,
  getCart,
  incrementCartItemApi,
  decrementCartItemApi,
  removeCartItemApi,
  createCartOrder,
  verifyCartOrder,
  getOrderById
} from "../service/cart.api";

export const useCart = () => {
  const setCartInStore = useAppStore((state) => state.setCart);

  async function handleAddItem({ productId, variantId }) {
    const response = await addItemToCart({ productId, variantId });

    if (!response?.success) {
      return response;
    }

    if (response?.cart) {
      setCartInStore(response.cart);
    }

    return response;
  }

  async function handleGetCart() {
    const data = await getCart();

    if (data?.cart && setCartInStore) {
      setCartInStore(data.cart);
    }

    return data;
  }

  async function handleIncrementCartItem({ productId, variantId }) {
    const response = await incrementCartItemApi({ productId, variantId });

    if (!response?.success) {
      return response;
    }

    if (response?.cart) {
      setCartInStore(response.cart);
    }

    return response;
  }

  async function handleDecrementCartItem({ productId, variantId }) {
    const response = await decrementCartItemApi({ productId, variantId });

    if (!response?.success) {
      return response;
    }

    if (response?.cart) {
      setCartInStore(response.cart);
    }

    return response;
  }

  async function handleRemoveCartItem({ productId, variantId }) {
    const response = await removeCartItemApi({ productId, variantId });

    if (!response?.success) {
      return response;
    }

    if (response?.cart) {
      setCartInStore(response.cart);
    }

    return response;
  }

  async function handleCreateCartOrder() {
    const data = await createCartOrder();
    return data;
  }

   async function handleVerifyCartOrder({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
        const data = await verifyCartOrder({ razorpay_order_id, razorpay_payment_id, razorpay_signature })
        return data.success
    }

    async function handleGetOrderById(orderId) {
        const data = await getOrderById(orderId)
        return data
    }

  return {
    handleAddItem,
    handleGetCart,
    handleIncrementCartItem,
    handleDecrementCartItem,
    handleRemoveCartItem,
    handleCreateCartOrder,
    handleVerifyCartOrder,
    handleGetOrderById
  };
};