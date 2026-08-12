import { getHomepage } from "../service/homepage.api.js";

export const createHomepageSlice = (set) => ({
  homepage: null,
  homepageLoading: false,
  homepageError: null,

  handleGetHomepage: async () => {
    set({
      homepageLoading: true,
      homepageError: null,
    });

    try {
      const homepage = await getHomepage();

      set({
        homepage,
        homepageLoading: false,
      });

      return {
        success: true,
        data: homepage,
      };
    } catch (error) {
      console.error("Failed to fetch homepage:", error);

      set({
        homepageLoading: false,
        homepageError: "Failed to load homepage",
      });

      return {
        success: false,
        error,
      };
    }
  },
});