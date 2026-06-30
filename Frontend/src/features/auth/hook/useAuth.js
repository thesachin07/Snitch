import { useState } from 'react'
import useAppStore from "../../../app/app.store.js";

export const useAuth = () => {

  const registerUserStore = useAppStore((state) => state.registerUser)
  const storeError = useAppStore((state) => state.error)
  const storeLoading = useAppStore((state) => state.loading)
  const user = useAppStore((state) => state.user)

  const [isSuccess, setIsSuccess] = useState(false)

  const handleRegister = async (userData) => {
    setIsSuccess(false)
    
    // Yahan tu chahe toh extra client-side pre-validation bhi daal sakta hai
    const result = await registerUserStore(userData)
    
    if (result.success) {
      setIsSuccess(true)
    }
    
    return result
  }

  // Jo bhi cheezein UI component ko chahiye, wo yahan se return kar do
  return {
    user,
    loading: storeLoading,
    error: storeError,
    isSuccess,
    register: handleRegister,
  }
}