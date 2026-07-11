import axios from "axios";

const productApiInstance = axios.create({
    baseURL: "api/products",
    withCredentials: true,
})

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
        const response = await productApiInstamce.get("/seller")
        return response.data;
    }
