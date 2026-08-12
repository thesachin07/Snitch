import axios from "axios";
import { API_BASE_URL } from "../../../config/api.js";

const homepageApiInstance = axios.create({
  baseURL: `${API_BASE_URL}/homepage`,
  withCredentials: true,
});

export async function getHomepage() {
  const response = await homepageApiInstance.get("/");
  return response.data;
}