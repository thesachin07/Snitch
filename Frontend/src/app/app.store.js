import { create } from 'zustand';
import { createAuthSlice } from '../features/auth/state/auth.slice.js';
import { createProductSlice } from "../features/products/state/product.slice.js";

const useAppStore = create((...a) => ({
  ...createAuthSlice(...a),
   ...createProductSlice(...a),
  
}));

export default useAppStore;