"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import toast from "react-hot-toast"
import { Plus, Search, Edit, Trash2, ChevronLeft, ChevronRight, Filter, X } from "lucide-react"

const ManageProduct = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [showFilters, setShowFilters] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState("")
    const [categories, setCategories] = useState([])
    // Add a filter trigger state to force re-fetching
    const [filterTrigger, setFilterTrigger] = useState(0)

    const fetchProducts = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (searchTerm) params.append("search", searchTerm)
            if (selectedCategory) params.append("slug", selectedCategory)
            params.append("page", currentPage.toString())

            console.log("Fetching products with params:", params.toString())

            const response = await axios.get(`https://tala-store.vercel.app/product?${params.toString()}`)

            if (response.data.success) {
                console.log("Products fetched:", response.data.products?.length || 0)
                setProducts(response.data.products || [])
                setTotalPages(response.data.totalPages || Math.ceil(response.data.totalCount / 10) || 1)
            } else {
                toast.error("Failed to fetch products")
            }
        } catch (error) {
            console.error("Error fetching products:", error)
            toast.error("Error fetching products")
        } finally {
            setLoading(false)
        }
    }

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`https://tala-store.vercel.app/category`)
            if (response.data.success) {
                setCategories(response.data.categories || [])
            }
        } catch (error) {
            console.error("Error fetching categories:", error)
        }
    }

    // Only depend on currentPage and filterTrigger
    useEffect(() => {
        fetchProducts()

    }, [currentPage, filterTrigger])

    useEffect(() => {
        fetchCategories()
    }, [])

    const handleSearch = (e) => {
        e.preventDefault()
        setCurrentPage(1)
        // Increment filter trigger to force re-fetch
        setFilterTrigger((prev) => prev + 1)
    }

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) {
            return
        }

        try {
            const response = await axios.delete(`https://tala-store.vercel.app/product/${id}`, {
                headers: {
                    token: localStorage.getItem("userToken"),
                },
            })
            if (response.data.success) {
                toast.success("Product deleted successfully")
                fetchProducts()
            } else {
                toast.error("Failed to delete product")
            }
        } catch (error) {
            console.error("Error deleting product:", error)
            toast.error("Error deleting product")
        }
    }

    const applyFilters = () => {
        setCurrentPage(1)
        // Increment filter trigger to force re-fetch
        setFilterTrigger((prev) => prev + 1)
        toast.success("Filters applied")
    }

    const clearFilters = () => {
        setSelectedCategory("")
        setSearchTerm("")
        setCurrentPage(1)
        // Increment filter trigger to force re-fetch
        setFilterTrigger((prev) => prev + 1)
        toast.success("Filters cleared")
    }

    // Get the selected category name for display
    const selectedCategoryName = selectedCategory
        ? categories.find((cat) => cat.slug === selectedCategory)?.name || "Selected Category"
        : "";


    return (
        <div className="space-y-6 mt-24 mx-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
                    <p className="mt-1 text-sm text-gray-500">Manage your product inventory</p>
                </div>
                <Link
                    to="create"
                    className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                </Link>
            </div>

            {/* Search and Filter */}
            <div className="bg-white shadow rounded-lg">
                <div className="p-4 border-b border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <form onSubmit={handleSearch} className="flex-1 md:max-w-md">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                                    placeholder="Search products"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </form>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="mt-3 md:mt-0 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                        >
                            <Filter className="h-4 w-4 mr-2" />
                            Filters
                            {selectedCategory && (
                                <span className="ml-1 bg-pink-100 text-pink-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                                    {selectedCategoryName}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Filter Panel */}
                    {showFilters && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-md">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-sm font-medium text-gray-700">Filter Products</h3>
                                <button onClick={clearFilters} className="text-sm text-gray-500 hover:text-gray-700 flex items-center">
                                    <X className="h-4 w-4 mr-1" />
                                    Clear Filters
                                </button>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                                        Category
                                    </label>
                                    <select
                                        id="category"
                                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm rounded-md"
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                    >
                                        <option value="">All Categories</option>
                                        {categories.map((category) => (
                                            <option key={category._id} value={category.slug}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={applyFilters}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Current Filter Display */}
                {selectedCategory && (
                    <div className="px-4 py-2 bg-pink-50">
                        <div className="flex items-center">
                            <span className="text-sm text-pink-800">
                                Filtered by category: <strong>{selectedCategoryName}</strong>
                            </span>
                            <button onClick={clearFilters} className="ml-2 text-pink-600 hover:text-pink-800">
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Products Table */}
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
                        </div>
                    ) : products.length > 0 ? (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Product
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Category
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Price
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Stock
                                    </th>

                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {products.map((product) => (
                                    <tr key={product.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 rounded bg-gray-200 overflow-hidden">
                                                    {product.defaultImage?.url ? (
                                                        <img
                                                            src={product.defaultImage.url || "/placeholder.svg"}
                                                            alt={product.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center bg-gray-100">
                                                            <span className="text-xs text-gray-500">No image</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{product.category?.name || "Uncategorized"}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">${product.price}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{product.avaliableItems}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link to={`edit/${product.id}`} className="text-pink-600 hover:text-pink-900 mr-4">
                                                <Edit className="h-5 w-5" />
                                            </Link>
                                            <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900">
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-center py-8 sm:py-12 px-4">
                            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 max-w-md mx-auto border border-gray-100">
                                <div className="relative mb-6 mx-auto">
                                    <div className="absolute inset-0 bg-blue-100 rounded-full opacity-30 animate-pulse"></div>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-16 w-16 sm:h-20 sm:w-20 text-blue-500 mx-auto relative z-10"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">No Products Found</h3>
                                <p className="text-gray-600 mb-6 text-sm sm:text-base">
                                    There are no products in your inventory yet. Get started by adding your first product.
                                </p>
                                <div className="space-y-3">
                                    <Link
                                        to="/dashboard/manage/create"
                                        className="w-full inline-flex items-center justify-center px-5 py-3 border border-transparent rounded-lg shadow-sm text-sm sm:text-base font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-300"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Add Your First Product
                                    </Link>
                                    <Link
                                        to="/dashboard"
                                        className="w-full inline-flex items-center justify-center px-5 py-3 border border-gray-300 rounded-lg shadow-sm text-sm sm:text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-300"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                        </svg>
                                        Return to Dashboard
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {products.length > 0 && (
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing page <span className="font-medium">{currentPage}</span> of{" "}
                                    <span className="font-medium">{totalPages}</span>
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    <button
                                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span className="sr-only">Previous</span>
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span className="sr-only">Next</span>
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ManageProduct
