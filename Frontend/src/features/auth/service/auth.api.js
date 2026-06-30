const BASE_URL = 'http://localhost:3000/api/auth'; 

export const authAPI = {
  register: async (userData) => {
    try {
      const response = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullname: userData.fullname,  // Backend key se match hona chahiye
          email: userData.email,
          contact: userData.contact,
          password: userData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        
        const errorMsg = data.errors ? data.errors[0].msg : 'Registration failed!';
        throw new Error(errorMsg);
      }

      return data; 
    } catch (error) {
      console.error('Error in authAPI.register:', error.message);
      throw error;
    }
  }
};