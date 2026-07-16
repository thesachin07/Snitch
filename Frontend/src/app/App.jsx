import { useState } from 'react'
import './App.css'
import { RouterProvider } from 'react-router'
import { routes } from './app.routes'
import useAppStore from '../app/app.store.js';
import { useAuth } from '../features/auth/hook/useAuth.js'
import { useEffect } from 'react'

function App() {

  const { handleGetMe } = useAuth()
  const user = useAppStore((state) => state.user )

  console.log(user)

  useEffect(() => {
    handleGetMe()
  }, [])
  return (
    <>
      <RouterProvider router={routes} />
    </>
  )
}

export default App
