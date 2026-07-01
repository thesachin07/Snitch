import { useState } from 'react';
import useAppStore from '../../../app/app.store.js';

export const useAuth = () => {
  const registerUserStore = useAppStore((state) => state.registerUser);
  const loginUserStore = useAppStore((state) => state.loginUser);
  const storeError = useAppStore((state) => state.error);
  const storeLoading = useAppStore((state) => state.loading);
  const user = useAppStore((state) => state.user);

  const [isSuccess, setIsSuccess] = useState(false);

  const handleRegister = async (userData) => {
    setIsSuccess(false);

    const result = await registerUserStore(userData);

    if (result.success) {
      setIsSuccess(true);
    }

    return result;
  };

  const handleLogin = async (loginData) => {
    setIsSuccess(false);

    const result = await loginUserStore(loginData);

    if (result.success) {
      setIsSuccess(true);
    }

    return result;
  };

  return {
    user,
    loading: storeLoading,
    error: storeError,
    isSuccess,
    register: handleRegister,
    login: handleLogin,
  };
};