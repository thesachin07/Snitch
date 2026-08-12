import { create } from 'zustand';
import { createAuthSlice } from '../features/auth/state/auth.slice.js';
import { createProductSlice } from "../features/products/state/product.slice.js";
import { createCartSlice } from "../features/cart/state/cart.slice.js"
// import { createHomepageSlice } from "../features/products/service/homepage.api.js";

const useAppStore = create((...a) => ({
  ...createAuthSlice(...a),
   ...createProductSlice(...a),
    ...createCartSlice(...a),
  //  ...createHomepageSlice(...a),
}));

export default useAppStore;