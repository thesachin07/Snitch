import axios from "axios";

const cartApiInstance = axios.create({
  baseURL: "/api/cart",
  withCredentials: true,
});

export const addItemToCart = async ({ productId, variantId }) => {
  const response = await cartApiInstance.post(`/add/${productId}/${variantId}`);
  return response.data;
};

export const getCart = async () => {
  const response = await cartApiInstance.get('/');
  return response.data;
};

export const incrementCartItemApi = async ({ productId, variantId }) => {
  const response = await cartApiInstance.patch(
    `/quantity/increment/${productId}/${variantId}`,
  );
  return response.data;
};

export const decrementCartItemApi = async ({ productId, variantId }) => {
  const response = await cartApiInstance.patch(
    `/quantity/decrement/${productId}/${variantId}`,
  );
  return response.data;
};

export const removeCartItemApi = async ({ productId, variantId }) => {
  const response = await cartApiInstance.delete(
    `/remove/${productId}/${variantId}`,
  );
  return response.data;
};

export const createCartOrder = async (orderData) => {
  try {
    const response = await cartApiInstance.post("/payment/create/order", orderData || {});
    console.log("Cart Order Response Data:", response.data);
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.status, error.message);
    throw error;
  }
};

export const verifyCartOrder = async ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
    const response = await cartApiInstance.post("/payment/verify/order", {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    })

    return response.data
}

export const getOrderById = async (orderId) => {
  const response = await cartApiInstance.get(`/order/${orderId}`);
  return response.data;
};

export const getMyOrders = async () => {
  const response = await cartApiInstance.get("/orders");
  return response.data;
};