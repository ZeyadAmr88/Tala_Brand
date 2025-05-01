import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { Package, Users, ShoppingBag, DollarSign, BarChart2 } from "lucide-react"

interface DashboardStats {
  totalProducts: number
  totalCategories: number
  recentProducts: any[]
  allProducts: any[]
}

const Dashboard = () => {
  const navigate = useNavigate()
  
  const handleManageProduct = () => navigate("manage")
  const handleManageCategory = () => navigate("manage_category")
  const handleManageOrder = () => navigate("manage_orders")
  
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalCategories: 0,
    recentProducts: [],
    allProducts: []
  })
  
  const [loading, setLoading] = useState(true)
  const [showAllProducts, setShowAllProducts] = useState(false)
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const productsResponse = await axios.get(`https://tala-store.vercel.app/product`)
        const products = productsResponse.data.products || []
  
        const categoriesResponse = await axios.get(`https://tala-store.vercel.app/category`)
        const categories = categoriesResponse.data.categories || []
  
        setStats({
          totalProducts: products.length,
          totalCategories: categories.length,
          recentProducts: products.slice(0, 5),
          allProducts: products,
        })
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }
  
    fetchDashboardData()
  }, [])
  
  const handleShowAllProducts = () => {
    setShowAllProducts(!showAllProducts)
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    )
  }
  
  const displayedProducts = showAllProducts ? stats.allProducts : stats.recentProducts
  
  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 py-28 sm:py-28 space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl shadow-lg p-6 sm:p-8 text-white">
        <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
        <p className="text-pink-100 mt-1">Welcome to your TalaStore admin dashboard</p>
        
        <div className="flex flex-wrap gap-3 sm:gap-4 mt-6">
          <button 
            onClick={handleManageProduct} 
            className="bg-white text-pink-600 hover:bg-pink-50 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium flex items-center shadow-sm hover:shadow"
          >
            <Package className="h-4 w-4 mr-2" />
            Manage Products
          </button>
          <button 
            onClick={handleManageCategory} 
            className="bg-white text-pink-600 hover:bg-pink-50 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium flex items-center shadow-sm hover:shadow"
          >
            <BarChart2 className="h-4 w-4 mr-2" />
            Manage Categories
          </button>
          <button 
            onClick={handleManageOrder} 
            className="bg-white text-pink-600 hover:bg-pink-50 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium flex items-center shadow-sm hover:shadow"
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Manage Orders
          </button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 flex items-center space-x-4 hover:shadow-lg transition-shadow">
          <div className="p-3 rounded-full bg-pink-100 text-pink-600">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Products</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalProducts}</h3>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 flex items-center space-x-4 hover:shadow-lg transition-shadow">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600">
            <BarChart2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Categories</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalCategories}</h3>
          </div>
        </div>
        
        
      </div>
  
      {/* Products Section */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Products</h2>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {displayedProducts.length} of {stats.allProducts.length}
          </span>
        </div>
  
        <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
          {displayedProducts.length > 0 ? (
            displayedProducts.map((product) => (
              <div key={product.id} className="px-6 py-4 flex items-center hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex-shrink-0 h-14 w-14 rounded-lg overflow-hidden bg-gray-200">
                  {product.defaultImage?.url ? (
                    <img
                      src={product.defaultImage.url}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gray-100">
                      <Package className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="ml-4 flex-grow">
                  <div className="flex justify-between items-start">
                    <h3 className="text-base font-semibold text-gray-800">{product.name}</h3>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      ${Number(product.finalPrice)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{product.avaliableItems} in stock</p>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-10 text-center">
              <div className="mx-auto w-full max-w-md bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="relative mb-4 w-16 h-16 mx-auto">
                  <div className="absolute inset-0 bg-blue-100 rounded-full opacity-30 animate-ping"></div>
                  <svg className="h-16 w-16 text-blue-500 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">No Products Available</h3>
                <p className="text-sm text-gray-500 mt-1 mb-4">Add products to your inventory to display them here.</p>
                <Link
                  to="/dashboard/manage/create"
                  className="inline-flex items-center px-4 py-2 bg-pink-600 text-white text-sm font-medium rounded-md hover:bg-pink-700 transition"
                >
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Product
                </Link>
              </div>
            </div>
          )}
        </div>
  
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 text-center">
          <button
            onClick={handleShowAllProducts}
            className="text-sm font-medium text-pink-600 hover:text-pink-800 hover:underline transition-colors flex items-center justify-center mx-auto"
          >
            {showAllProducts ? 'Show recent products only' : 'View all products'}
            <svg className={`ml-1 h-4 w-4 transition-transform ${showAllProducts ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
