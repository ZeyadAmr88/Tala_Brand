"use client"

import React from "react"

import { useEffect, useState } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import axios from "axios"
import { Package, Tag, ShoppingCart, Users, TrendingUp, DollarSign } from "lucide-react"

interface DashboardStats {
    totalProducts: number
    totalCategories: number
    totalOrders: number
    totalCustomers: number
    revenue: number
    recentProducts: any[]
}

const Dashboard = () => {
    const navigate = useNavigate()
    const handleCreateProduct = () => {
        // Navigate to the create product page
       navigate ("manage/create")
    }
    const [stats, setStats] = useState<DashboardStats>({
        totalProducts: 0,
        totalCategories: 0,
        totalOrders: 0,
        totalCustomers: 0,
        revenue: 0,
        recentProducts: [],
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // In a real app, you would fetch this data from your API
                // For now, we'll simulate it with a timeout

                // Fetch products count
                const productsResponse = await axios.get(`https://tala-store.vercel.app/product`)
                const products = productsResponse.data.products || []

                // Fetch categories count
                const categoriesResponse = await axios.get(`https://tala-store.vercel.app/category`)
                const categories = categoriesResponse.data.categories || []

                setStats({
                    totalProducts: products.length,
                    totalCategories: categories.length,
                    totalOrders: 25, // Mock data
                    totalCustomers: 120, // Mock data
                    revenue: 15000, // Mock data
                    recentProducts: products.slice(0, 5), // Get the 5 most recent products
                })
            } catch (error) {
                console.error("Error fetching dashboard data:", error)
                // Set some mock data in case of error
                setStats({
                    totalProducts: 45,
                    totalCategories: 8,
                    totalOrders: 25,
                    totalCustomers: 120,
                    revenue: 15000,
                    recentProducts: [],
                })
            } finally {
                setLoading(false)
            }
        }

        fetchDashboardData()
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6 h-screen mt-24 text-center">
            <div>
                <h1 className="text-2xl font-semibold text-gray-900 ">Dashboard</h1>
                <p className="mt-1 text-sm text-gray-500">Welcome to your TalaStore admin dashboard</p>
                <button onClick={handleCreateProduct}>
                    Create New Product
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <StatsCard
                    title="Total Products"
                    value={stats.totalProducts}
                    icon={Package}
                    color="bg-blue-500"
                    link="/products"
                />
                <StatsCard
                    title="Total Categories"
                    value={stats.totalCategories}
                    icon={Tag}
                    color="bg-green-500"
                    link="/categories"
                />
                <StatsCard
                    title="Total Orders"
                    value={stats.totalOrders}
                    icon={ShoppingCart}
                    color="bg-yellow-500"
                    link="/orders"
                />
                <StatsCard
                    title="Total Customers"
                    value={stats.totalCustomers}
                    icon={Users}
                    color="bg-purple-500"
                    link="/customers"
                />
            </div>

            {/* Revenue Chart */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-gray-900">Revenue Overview</h2>
                    <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-gray-900">${stats.revenue.toLocaleString()}</span>
                        <span className="flex items-center text-sm font-medium text-green-600">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            12%
                        </span>
                    </div>
                </div>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                    <div className="text-center">
                        <DollarSign className="h-12 w-12 text-gray-400 mx-auto" />
                        <p className="mt-2 text-sm text-gray-500">Revenue chart will be displayed here</p>
                    </div>
                </div>
            </div>

            {/* Recent Products */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">Recent Products</h2>
                </div>
                <div className="divide-y divide-gray-200">
                    {stats.recentProducts.length > 0 ? (
                        stats.recentProducts.map((product) => (
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
                                    <p className="text-sm text-gray-500">
                                        ${product.price} · {product.avaliableItems} in stock
                                    </p>
                                </div>
                                <Link
                                    to={`/products/edit/${product.id}`}
                                    className="ml-2 text-sm font-medium text-pink-600 hover:text-pink-500"
                                >
                                    Edit
                                </Link>
                            </div>
                        ))
                    ) : (
                        <div className="px-6 py-4 text-center text-sm text-gray-500">No products found</div>
                    )}
                </div>
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <Link to="/products" className="text-sm font-medium text-pink-600 hover:text-pink-500">
                        View all products
                    </Link>
                </div>
            </div>
        </div>
    )
}

interface StatsCardProps {
    title: string
    value: number
    icon: React.ElementType
    color: string
    link: string
}

const StatsCard = ({ title, value, icon: Icon, color, link }: StatsCardProps) => {
    return (
        <Link to={link} className="block">
            <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                    <div className="flex items-center">
                        <div className={`flex-shrink-0 rounded-md p-3 ${color}`}>
                            <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
                                <dd>
                                    <div className="text-lg font-medium text-gray-900">{value.toLocaleString()}</div>
                                </dd>
                            </dl>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                    <div className="text-sm">
                        <div className="font-medium text-pink-600 hover:text-pink-500">View all</div>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default Dashboard

