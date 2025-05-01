"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import toast from "react-hot-toast"
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Filter,
  X,
  ShoppingBag,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Tag,
  Package,
} from "lucide-react"

const ManageProduct = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("")
  const [categories, setCategories] = useState([])
  const [filterTrigger, setFilterTrigger] = useState(0)
  const [isDeleting, setIsDeleting] = useState(null)

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append("search", searchTerm)
      if (selectedCategory) params.append("slug", selectedCategory)
      params.append("page", currentPage.toString())

      const response = await axios.get(`https://tala-store.vercel.app/product?${params.toString()}`)

      if (response.data.success) {
        setProducts(response.data.products || [])
        setTotalPages(response.data.totalPages || Math.ceil(response.data.totalCount / 10) || 1)
      } else {
        toast.error("Failed to fetch products")
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      toast.error("Error fetching products")
    } finally {
      setTimeout(() => setLoading(false), 300) // Small delay for smoother transition
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

  useEffect(() => {
    fetchProducts()
  }, [currentPage, filterTrigger])

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    setFilterTrigger((prev) => prev + 1)
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return
    }

    setIsDeleting(id)
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
    } finally {
      setIsDeleting(null)
    }
  }

  const applyFilters = () => {
    setCurrentPage(1)
    setFilterTrigger((prev) => prev + 1)
    setShowFilters(false)
    toast.success("Filters applied")
  }

  const clearFilters = () => {
    setSelectedCategory("")
    setSearchTerm("")
    setCurrentPage(1)
    setFilterTrigger((prev) => prev + 1)
    toast.success("Filters cleared")
  }

  // Get the selected category name for display
  const selectedCategoryName = selectedCategory
    ? categories.find((cat) => cat.slug === selectedCategory)?.name || "Selected Category"
    : ""

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16 sm:mt-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
            <ShoppingBag className="h-7 w-7 mr-3 text-pink-600" />
            Products
          </h1>
          <p className="mt-1 text-sm text-gray-500">Manage your product inventory</p>
        </div>
        <Link
          to="create"
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-100 transition-all duration-200">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <form onSubmit={handleSearch} className="flex-1 md:max-w-md">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-pink-500 focus:border-pink-500 sm:text-sm transition-colors duration-200"
                  placeholder="Search products"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <span className="text-xs font-medium text-pink-600 hover:text-pink-800 transition-colors duration-200">
                    Search
                  </span>
                </button>
              </div>
            </form>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-200"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {selectedCategory && (
                <span className="ml-2 bg-pink-100 text-pink-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  {selectedCategoryName}
                </span>
              )}
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100 animate-fadeIn">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium text-gray-700 flex items-center">
                  <Tag className="h-4 w-4 mr-2 text-pink-600" />
                  Filter Products
                </h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-500 hover:text-gray-700 flex items-center transition-colors duration-200"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear Filters
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    id="category"
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm rounded-md transition-colors duration-200"
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
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-200"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Current Filter Display */}
        {selectedCategory && (
          <div className="px-4 py-2 bg-pink-50 flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-sm text-pink-800">
                Filtered by category: <strong>{selectedCategoryName}</strong>
              </span>
            </div>
            <button
              onClick={clearFilters}
              className="ml-2 text-pink-600 hover:text-pink-800 transition-colors duration-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Products Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center">
                <Loader2 className="h-10 w-10 text-pink-600 animate-spin" />
                <p className="mt-4 text-sm text-gray-500">Loading products...</p>
              </div>
            </div>
          ) : products.length > 0 ? (
            <div className="min-w-full divide-y divide-gray-200">
              {/* Desktop Table */}
              <div className="hidden md:block">
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
                        Discount
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Final Price
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
                      <tr key={product.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12 rounded-md bg-gray-200 overflow-hidden border border-gray-200">
                              {product.defaultImage?.url ? (
                                <img
                                  src={product.defaultImage.url || "/placeholder.svg"}
                                  alt={product.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center bg-gray-100">
                                  <Package className="h-6 w-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                            {product.category?.name || "Uncategorized"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{product.price} EGP</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {product.discount > 0 ? (
                            <span className="px-2.5 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                              {product.discount}%
                            </span>
                          ) : (
                            <span className="text-sm text-gray-500">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-green-600 font-semibold">{product.finalPrice} EGP</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div
                            className={`text-sm font-medium ${
                              product.avaliableItems > 10
                                ? "text-green-600"
                                : product.avaliableItems > 0
                                  ? "text-yellow-600"
                                  : "text-red-600"
                            }`}
                          >
                            {product.avaliableItems}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-3">
                            <Link
                              to={`edit/${product.id}`}
                              className="text-pink-600 hover:text-pink-900 transition-colors duration-200 p-1 rounded-full hover:bg-pink-50"
                            >
                              <Edit className="h-5 w-5" />
                            </Link>
                            <button
                              onClick={() => handleDelete(product.id)}
                              disabled={isDeleting === product.id}
                              className="text-red-600 hover:text-red-900 transition-colors duration-200 p-1 rounded-full hover:bg-red-50 disabled:opacity-50"
                            >
                              {isDeleting === product.id ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                              ) : (
                                <Trash2 className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-gray-200">
                {products.map((product) => (
                  <div key={product.id} className="p-4 hover:bg-gray-50 transition-colors duration-150">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-16 w-16 rounded-md bg-gray-200 overflow-hidden border border-gray-200">
                        {product.defaultImage?.url ? (
                          <img
                            src={product.defaultImage.url || "/placeholder.svg"}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-gray-100">
                            <Package className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="font-medium text-gray-900">{product.name}</div>
                        <div className="mt-1 flex flex-wrap gap-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {product.category?.name || "Uncategorized"}
                          </span>
                          {product.discount > 0 && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {product.discount}% off
                            </span>
                          )}
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-500">Price:</span>{" "}
                            <span className="line-through">{product.price} EGP</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Final:</span>{" "}
                            <span className="text-green-600 font-semibold">{product.finalPrice} EGP</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Stock:</span>{" "}
                            <span
                              className={`font-medium ${
                                product.avaliableItems > 10
                                  ? "text-green-600"
                                  : product.avaliableItems > 0
                                    ? "text-yellow-600"
                                    : "text-red-600"
                              }`}
                            >
                              {product.avaliableItems}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end space-x-3">
                      <Link
                        to={`edit/${product.id}`}
                        className="inline-flex items-center px-3 py-1.5 border border-pink-600 text-xs font-medium rounded text-pink-600 bg-white hover:bg-pink-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-200"
                      >
                        <Edit className="h-3.5 w-3.5 mr-1" />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        disabled={isDeleting === product.id}
                        className="inline-flex items-center px-3 py-1.5 border border-red-600 text-xs font-medium rounded text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 disabled:opacity-50"
                      >
                        {isDeleting === product.id ? (
                          <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5 mr-1" />
                        )}
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 px-4">
              <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto border border-gray-100">
                <div className="relative mb-6 mx-auto">
                  <div className="absolute inset-0 bg-pink-100 rounded-full opacity-30 animate-pulse"></div>
                  <Package className="h-20 w-20 text-pink-500 mx-auto relative z-10" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">No Products Found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || selectedCategory
                    ? "No products match your search criteria. Try adjusting your filters."
                    : "There are no products in your inventory yet. Get started by adding your first product."}
                </p>
                <div className="space-y-3">
                  <Link
                    to="/dashboard/manage/create"
                    className="w-full inline-flex items-center justify-center px-5 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-300"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Your First Product
                  </Link>
                  {(searchTerm || selectedCategory) && (
                    <button
                      onClick={clearFilters}
                      className="w-full inline-flex items-center justify-center px-5 py-3 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-300"
                    >
                      <X className="h-5 w-5 mr-2" />
                      Clear Filters
                    </button>
                  )}
                  <Link
                    to="/dashboard"
                    className="w-full inline-flex items-center justify-center px-5 py-3 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-300"
                  >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Return to Dashboard
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {products.length > 0 && (
          <div className="bg-white px-4 py-4 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing page <span className="font-medium">{currentPage}</span> of{" "}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Previous</span>
                </button>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-4 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ArrowRight className="h-4 w-4 ml-1 sm:ml-2" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ManageProduct
