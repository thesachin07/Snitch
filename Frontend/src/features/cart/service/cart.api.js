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

// export const createCartOrder = async () => {
//   const response = await cartApiInstance.post("/payment/create/")
//   return response.data
// }


export const createCartOrder = async (orderData) => {
  try {
    // send order data to the backend endpoint that creates an order
    const response = await cartApiInstance.post("/payment/create/order", orderData || {});
    console.log("Cart Order Response Data:", response.data);
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.status, error.message);
    throw error;
  }
};