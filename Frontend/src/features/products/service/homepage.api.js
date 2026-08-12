import axios from "axios";

const homepageApi = axios.create({
  baseURL: "/api/homepage",
  withCredentials: true,
});

export const getHomepage = async () => {
  const response = await homepageApi.get("/");
  return response.data;
};