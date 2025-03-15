
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Layout from './component/Layout/Layout'
import Home from './component/Home/Home'
import Cart from './component/Cart/Cart'
import Category from './component/Category/Category'
import Brands from './component/Brands/Brands'
import Products from './component/Products/Products'
import Register from './component/Register/Register'
import Login from './component/Login/Login'
import NotFound from './component/NotFound/NotFound'
import UserContextProvider from './component/Context/UserContext'
import ProtectedRoute from './component/ProtectedRoute/ProtectedRoute'
import ProductDetails from './component/ProductDetails/ProductDetails'
import CartContextProvider from './component/Context/CartContext'
import { Toaster } from 'react-hot-toast'
import CheckOut from './component/CheckOut/CheckOut'
import AllOrders from './component/AllOrders/AllOrders'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

let query = new QueryClient()

let routes = createBrowserRouter([
  {
    path: '', element: <Layout />, children: [
      { index: true, element: <ProtectedRoute> <Home /></ProtectedRoute> },
      { path: 'cart', element: <ProtectedRoute> <Cart /></ProtectedRoute> },
      { path: 'categories', element: <ProtectedRoute><Category /></ProtectedRoute> },
      { path: 'brands', element: <ProtectedRoute><Brands /></ProtectedRoute> },
      { path: 'products', element: <ProtectedRoute><Products /></ProtectedRoute> },
      { path: 'productdetails/:id', element: <ProtectedRoute><ProductDetails /></ProtectedRoute> },
      { path: 'checkout', element: <ProtectedRoute><CheckOut /></ProtectedRoute> },
      { path: 'allorders', element: <ProtectedRoute><AllOrders /></ProtectedRoute> },
      { path: 'register', element: <Register /> },
      { path: 'login', element: <Login /> },
      { path: '*', element: <NotFound /> },
    ]
  }
])
function App() {


  return (

    <QueryClientProvider client={query}>
      <CartContextProvider>
        <UserContextProvider>

          <RouterProvider router={routes}></RouterProvider>
          <ReactQueryDevtools />
          <Toaster />

        </UserContextProvider>
      </CartContextProvider>
    </QueryClientProvider>
   
  )

}

export default App
