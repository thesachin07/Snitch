import axios from "axios";
import { API_BASE_URL } from "../../../config/api.js";

const productApiInstance = axios.create({
  baseURL: `${API_BASE_URL}/products`,
  withCredentials: true,
});

export async function createProduct(formData) {
    try {
        const response = await productApiInstance.post("/", formData
        );
        return response.data;
    } catch (error) {
        console.error("Error creating product:", error);
        throw error;
    }
}
    export async function getSellerProducts() {
        const response = await productApiInstance.get("/seller")
        return response.data;
    }

export async function getAllProducts(category) {
  try {
    const response = await productApiInstance.get("/", {
      params: category ? { category } : {},
    });

    return response.data;
  } catch (err) {
    console.error(
      `Fetch failed: ${err.response?.status || "Network Error"}`,
      err.message
    );
    throw err;
  }
}
    export async function getProductById(productId) {
        const response = await productApiInstance.get(`/detail/${productId}`)
        return response.data
    }

    export async function addProductVariant(productId, newProductVariant) {    
        const formData = new FormData()

        newProductVariant.images.forEach((image) => {
            formData.append(`images`, image.file)
        })

        formData.append("stock", newProductVariant.stock)
        formData.append("priceAmount", newProductVariant.price ?? 0)
        formData.append("priceCurrency", newProductVariant.currency || "INR")
        formData.append("attributes", JSON.stringify(newProductVariant.attributes))

        const response = await productApiInstance.post(`/${productId}/variants`, formData)

        return response.data
        
    }

    export async function updateProduct(productId, updates) {
    const formData = new FormData();

    if (updates.title !== undefined) formData.append("title", updates.title);
    if (updates.description !== undefined) formData.append("description", updates.description);
    if (updates.category !== undefined) formData.append("category", updates.category);
    if (updates.priceAmount !== undefined) formData.append("priceAmount", updates.priceAmount);
    if (updates.priceCurrency !== undefined) formData.append("priceCurrency", updates.priceCurrency);
    if (updates.removeImageUrls) formData.append("removeImageUrls", JSON.stringify(updates.removeImageUrls));
    (updates.newImages || []).forEach((file) => formData.append("images", file));

    const response = await productApiInstance.patch(`/${productId}`, formData);
    return response.data;
}

export async function deleteProduct(productId) {
    const response = await productApiInstance.delete(`/${productId}`);
    return response.data;
}

export async function updateProductVariant(productId, variantId, updates) {
    const formData = new FormData();

    if (updates.stock !== undefined) formData.append("stock", updates.stock);
    if (updates.priceAmount !== undefined) formData.append("priceAmount", updates.priceAmount);
    if (updates.priceCurrency !== undefined) formData.append("priceCurrency", updates.priceCurrency);
    if (updates.attributes !== undefined) formData.append("attributes", JSON.stringify(updates.attributes));
    if (updates.removeImageUrls) formData.append("removeImageUrls", JSON.stringify(updates.removeImageUrls));
    (updates.newImages || []).forEach((file) => formData.append("images", file));

    const response = await productApiInstance.patch(`/${productId}/variants/${variantId}`, formData);
    return response.data;
}

export async function deleteProductVariant(productId, variantId) {
    const response = await productApiInstance.delete(`/${productId}/variants/${variantId}`);
    return response.data;
}