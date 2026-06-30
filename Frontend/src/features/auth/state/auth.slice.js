import { authAPI } from '../service/auth.api.js';

export const createAuthSlice = (set) => ({
  user: null,
  loading: false,
  error: null,

  registerUser: async (userData) => {
    set({ loading: true, error: null });
    try {
      const response = await authAPI.register(userData);
      set({ user: response.user ?? userData, loading: false, error: null });
      return { success: true, data: response };
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, error: err.message };
    }
  },

  logoutUser: () => set({ user: null, error: null }),
});