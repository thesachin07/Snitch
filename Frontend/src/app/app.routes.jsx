import { createBrowserRouter } from "react-router";
import Home from "../features/products/pages/Home.jsx";
import Register from "../features/auth/pages/register.jsx";
import Login from "../features/auth/pages/login.jsx";
import Cart from "../features/cart/pages/Cart.jsx";
import ProductDetail from "../features/products/pages/ProductDetail.jsx";
import CreateProduct from "../features/products/pages/CreateProduct.jsx";
import Dashboard from "../features/products/pages/Dashboard";
import SellerProductDetails from "../features/products/pages/SellerProductDetails.jsx";
import Protected from "../features/auth/components/Protected.jsx";
import AppLayout from "./AppLayout.jsx";
import { Children } from "react";
import OrderSuccess from "../features/cart/pages/OrderSuccess.jsx";
import Orders from "../features/cart/pages/Order.jsx";

export const routes = createBrowserRouter([
   {
        path: "/register",
        element: <Register />,
    },
    {
        path: "/login",
        element: <Login />,
    },

{
  element: <AppLayout />,
  children: [
     {
                path: "/",
                element: <Home />,
            },

  {
    path: "/product/:productId",
    element: <ProductDetail />,
  },

  {
        path: "/cart",
        element: <Protected> 
          <Cart />
        </Protected>
      },

      {
        path: "order-success",
        element: <OrderSuccess />
      },
{ 
  path: "/orders",
   element: <Orders />
   },

  {
    path: "/seller",
    children: [
      {
        path: "/seller/create-product",
        element: (
          <Protected role="seller">
            <CreateProduct />
          </Protected>
        ),
      },

      {
        path: "/seller/dashboard",
        element: (
          <Protected role="seller">
            <Dashboard />
          </Protected>
        ),
      },

{
        path: "/seller/product/:productId",
        element: 
          <Protected role="seller">
            <SellerProductDetails />
          </Protected>   
}, 
      
    ]
}
]}])
