import React, { useEffect } from 'react'
import Nav from '../features/shared/components/nav'
import { Outlet } from 'react-router'
import useAppStore from './app.store'
import { useCart } from '../features/cart/hooks/useCart'

const AppLayout = () => {
  const user = useAppStore((state) => state.user);
  const loadGuestCart = useAppStore((state) => state.loadGuestCart);
  const { handleGetCart } = useCart();

  useEffect(() => {
    if (user) {
      handleGetCart();
    } else {
      loadGuestCart();
    }
  }, [user, loadGuestCart]);

  return (
    <>
      <Nav />
      <Outlet />
    </>
  )
}

export default AppLayout