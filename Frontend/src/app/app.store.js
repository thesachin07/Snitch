import { create } from 'zustand';
import { createAuthSlice } from '../features/auth/state/auth.slice.js';

const useAppStore = create((...a) => ({
  ...createAuthSlice(...a),
}));

export default useAppStore;