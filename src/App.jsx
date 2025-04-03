import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Layout from './component/Layout/Layout'
import Home from './component/Home/Home'
import Cart from './component/Cart/Cart'
import Category from './component/Category/Category'
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
import Dashboard from './component/dashboard/Dashboard'
import ProductForm from './component/Products/ProductForm'
import ManageProduct from './component/Products/ManageProduct'

let query = new QueryClient()

let routes = createBrowserRouter([
  {
    path: '', element: <Layout />, children: [
      { index: true, element: <Home /> },
      { path: 'categories', element: <Category /> },
      { path: 'products', element: <Products />},
      { path: 'productdetails/:id', element: <ProductDetails /> },

      { path: 'cart', element: <ProtectedRoute> <Cart /></ProtectedRoute> },
      { path: 'checkout', element: <ProtectedRoute><CheckOut /></ProtectedRoute> },
      { path: 'allorders', element: <ProtectedRoute><AllOrders /></ProtectedRoute> },

      { path: 'register', element: <Register /> },
      { path: 'login', element: <Login /> },

      { path: 'dashboard', element: <ProtectedRoute><Dashboard /></ProtectedRoute> },
      { path: 'manage', element: <ProtectedRoute><ManageProduct /></ProtectedRoute> },
      { path: 'dashboard/manage/create', element: <ProtectedRoute><ProductForm /></ProtectedRoute> },
      
      { path: '*', element: <NotFound /> },



    ]
  }
])
function App() {


  return (
    <QueryClientProvider client={query}>
       {/* Wrap the whole app with AuthProvider */}
        <CartContextProvider>
          <UserContextProvider>
            <RouterProvider router={routes} />
            <ReactQueryDevtools />
            <Toaster />
          </UserContextProvider>
        </CartContextProvider>
      
    </QueryClientProvider>
  );

}

export default App