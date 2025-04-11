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
import ManageCategory from './component/Category/ManageCategory'
import CategoryForm from './component/Category/CategoryForm'
import ProtectedAdminRoute from './component/ProtectedRoute/ProtectedAdminRoute'
import { FavoritesProvider } from './component/Context/FavoritesContext'
import Favorites from './component/Favorites/Favorites'

let query = new QueryClient()

let routes = createBrowserRouter([
  {
    path: '', element: <Layout />, children: [
      { index: true, element: <ProtectedRoute> <Home /></ProtectedRoute> },
      { path: 'cart', element: <ProtectedRoute> <Cart /></ProtectedRoute> },
      { path: 'categories', element: <ProtectedRoute><Category /></ProtectedRoute> },
      { path: 'products', element: <ProtectedRoute><Products /></ProtectedRoute> },
      { path: 'productdetails/:id', element: <ProtectedRoute><ProductDetails /></ProtectedRoute> },
      { path: 'checkout', element: <ProtectedRoute><CheckOut /></ProtectedRoute> },
      { path: 'allorders', element: <ProtectedRoute><AllOrders /></ProtectedRoute> },
      { path: 'favorites', element: <ProtectedRoute><Favorites /></ProtectedRoute> },
      { path: 'register', element: <Register /> },
      { path: 'login', element: <Login /> },
      { path: '*', element: <NotFound /> },
      { path: 'dashboard', element: <ProtectedAdminRoute><Dashboard /></ProtectedAdminRoute> },
      { path: 'dashboard/manage', element: <ProtectedAdminRoute><ManageProduct /></ProtectedAdminRoute> },
      { path: 'dashboard/manage/create', element: <ProtectedAdminRoute><ProductForm /></ProtectedAdminRoute> },
      { path: 'dashboard/manage/edit/:id', element: <ProtectedAdminRoute><ProductForm /></ProtectedAdminRoute> },
      { path: 'dashboard/manage_category', element: <ProtectedAdminRoute><ManageCategory /></ProtectedAdminRoute> },
      { path: 'manage_category/new', element: <ProtectedAdminRoute><CategoryForm /></ProtectedAdminRoute> },
      { path: 'dashboard/manage_category/edit/:id', element: <ProtectedAdminRoute><CategoryForm /></ProtectedAdminRoute> },

    ]
  }
])
function App() {


  return (
    <QueryClientProvider client={query}>

      
        <UserContextProvider>
        <CartContextProvider>
          <FavoritesProvider>
            <RouterProvider router={routes} />
            <ReactQueryDevtools />
            <Toaster />
          </FavoritesProvider>
      </CartContextProvider>
        </UserContextProvider>

    </QueryClientProvider>
  );

}

export default App
