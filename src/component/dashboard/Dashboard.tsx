import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { Package } from "lucide-react"

interface DashboardStats {
    totalProducts: number
    totalCategories: number
    totalOrders: number
    totalCustomers: number
    revenue: number
    recentProducts: any[]
    allProducts: any[] // Added to store all products
}

const Dashboard = () => {
    const navigate = useNavigate()
    const handleManageProduct = () => {
        navigate("manage")
    }
    const handleManageCategory = () => {
        navigate("manage_category")
    }

    const [stats, setStats] = useState<DashboardStats>({
        totalProducts: 0,
        totalCategories: 0,
        totalOrders: 0,
        totalCustomers: 0,
        revenue: 0,
        recentProducts: [],
        allProducts: [] // Initialize the state for all products
    })

    const [loading, setLoading] = useState(true)
    const [showAllProducts, setShowAllProducts] = useState(false) // State to control showing all products

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
                    totalOrders: 25, // Mock data
                    totalCustomers: 120, // Mock data
                    revenue: 15000, // Mock data
                    recentProducts: products.slice(0, 5), // Get the 5 most recent products
                    allProducts: products, // Store all products
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
        setShowAllProducts(!showAllProducts) // Toggle the display of all products
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
        <div className="space-y-6 h-screen mt-24 text-center">
            <div>
                <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
                <p className="mt-1 text-sm text-gray-500">Welcome to your TalaStore admin dashboard</p>
                <button onClick={handleManageProduct} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mt-4 m-5">
                    Manage Products
                </button>
                <button onClick={handleManageCategory} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mt-4">
                    Manage Categories
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">Products</h2>
                </div>
                <div className="divide-y divide-gray-200">
                    {displayedProducts.length > 0 ? (
                        displayedProducts.map((product) => (
                            <div key={product.id} className="px-6 py-4 flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 rounded bg-gray-200 overflow-hidden">
                                    {product.defaultImage?.url ? (
                                        <img
                                            src={product.defaultImage.url || "/placeholder.svg"}
                                            alt={product.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center bg-gray-100">
                                            <Package className="h-5 w-5 text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                <div className="ml-4 flex-1">
                                    <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
                                    <p className="text-sm text-gray-500">${product.price} · {product.avaliableItems} in stock</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="px-6 py-8 text-center">
                            <div className="bg-white rounded-lg p-6 max-w-sm mx-auto border border-gray-100 shadow-sm">
                                <div className="relative mb-4 mx-auto w-16 h-16">
                                    <div className="absolute inset-0 bg-blue-100 rounded-full opacity-30 animate-pulse"></div>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-16 w-16 text-blue-500 mx-auto relative z-10"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2">No Products Available</h3>
                                <p className="text-gray-600 mb-4 text-sm">
                                    Add products to your inventory to see them displayed here.                                
                                </p>
                                <Link
                                    to="/dashboard/manage/create"
                                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Add Product
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <button onClick={handleShowAllProducts} className="text-sm font-medium text-pink-600 hover:text-pink-500">
                        {showAllProducts ? 'Hide all products' : 'View all products'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
