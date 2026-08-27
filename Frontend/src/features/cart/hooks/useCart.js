import useAppStore from "../../../app/app.store";
import {
  addItemToCart,
  getCart,
  incrementCartItemApi,
  decrementCartItemApi,
  removeCartItemApi,
  createCartOrder,
  verifyCartOrder,
  getOrderById,
  getMyOrders,
  
} from "../service/cart.api";

export const useCart = () => {
  const user = useAppStore((state) => state.user);
  const setCartInStore = useAppStore((state) => state.setCart);
  const setGuestCart = useAppStore((state) => state.setGuestCart);

  async function handleAddItem({ productId, variantId, product, variant }) {
    if (!user) {
      const currentCart = useAppStore.getState().cart;
      const existingItem = currentCart.items.find(
        (item) => item.product?._id === productId && item.variant === variantId,
      );
      const items = existingItem
        ? currentCart.items.map((item) =>
            item === existingItem
              ? { ...item, quantity: Number(item.quantity ?? 1) + 1 }
              : item,
          )
        : [
            ...currentCart.items,
            {
              _id: `${productId}-${variantId}`,
              product,
              variant: variantId,
              price: variant?.price ?? product?.price,
              quantity: 1,
            },
          ];

      setGuestCart({ ...currentCart, items });
      return { success: true, cart: useAppStore.getState().cart };
    }

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
    if (!user) {
      return { success: true, cart: useAppStore.getState().cart };
    }

    const data = await getCart();

    if (data?.cart && setCartInStore) {
      setCartInStore(data.cart);
    }

    return data;
  }

  async function handleIncrementCartItem({ productId, variantId }) {
    if (!user) {
      const currentCart = useAppStore.getState().cart;
      const items = currentCart.items.map((item) =>
        item.product?._id === productId && item.variant === variantId
          ? { ...item, quantity: Number(item.quantity ?? 1) + 1 }
          : item,
      );
      setGuestCart({ ...currentCart, items });
      return { success: true, cart: useAppStore.getState().cart };
    }

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
    if (!user) {
      const currentCart = useAppStore.getState().cart;
      const items = currentCart.items
        .map((item) =>
          item.product?._id === productId && item.variant === variantId
            ? { ...item, quantity: Number(item.quantity ?? 1) - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0);
      setGuestCart({ ...currentCart, items });
      return { success: true, cart: useAppStore.getState().cart };
    }

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
    if (!user) {
      const currentCart = useAppStore.getState().cart;
      const items = currentCart.items.filter(
        (item) => !(item.product?._id === productId && item.variant === variantId),
      );
      setGuestCart({ ...currentCart, items });
      return { success: true, cart: useAppStore.getState().cart };
    }

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
 async function handleGetMyOrders(){
  const data = await getMyOrders()
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
    handleGetOrderById,
    handleGetMyOrders
  };
};