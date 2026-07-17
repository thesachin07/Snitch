import axios from "axios";

const productApiInstance = axios.create({
    baseURL: "/api/products",
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
        const response = await productApiInstance.get("/seller")
        return response.data;
    }

    export async function getAllProducts(){
       try{
        const response = await productApiInstance.get("/")
        return response.data
       }catch(err){
  console.error(`Fetch failed: ${err.response?.status || 'Network Error'}`, err.message);        throw err;
       }
    }