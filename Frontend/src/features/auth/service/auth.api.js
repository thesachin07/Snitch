const BASE_URL = import.meta.env.VITE_API_URL || '/api/auth';

export const authAPI = {
  register: async (userData) => {
    try {
      const response = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          fullname: userData.fullname,
          email: userData.email,
          contact: userData.contact,
          password: userData.password,
          isSeller: userData.isSeller ?? false,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errorMsg = data.errors?.[0]?.msg || data.message || 'Registration failed!';
        throw new Error(errorMsg);
      }

      return data;
    } catch (error) {
      console.error('Error in authAPI.register:', error.message);
      throw error;
    }
  },

  login: async (credentials) => {
    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errorMsg = data.errors?.[0]?.msg || data.message || 'Login failed!';
        throw new Error(errorMsg);
      }

      return data;
    } catch (error) {
      console.error('Error in authAPI.login:', error.message);
      throw error;
    }
  },

  getMe: async () => {
  const response = await fetch(`${BASE_URL}/me`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch user");
  }

  return data;
}
};
