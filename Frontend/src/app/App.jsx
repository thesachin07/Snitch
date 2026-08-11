import { useState } from 'react'
import './App.css'
import { RouterProvider } from 'react-router'
import { routes } from './app.routes'
import useAppStore from '../app/app.store.js';
import { useAuth } from '../features/auth/hook/useAuth.js'
import { useEffect } from 'react'
import { ThemeProvider } from 'next-themes'
import { Toaster } from "@/components/ui/sonner";

function App() {

  const { handleGetMe } = useAuth()
  const user = useAppStore((state) => state.user )

  // console.log(user)

  useEffect(() => {
    handleGetMe()
  }, [])
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <RouterProvider router={routes} />
      <Toaster position="top-center" />
    </ThemeProvider>
  )
}

export default App
