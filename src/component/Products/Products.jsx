"use client"

import { useMemo, useState, useEffect, useRef } from "react"
import { useLocation, useSearchParams, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import Loader from "../Loader/Loader"
import RecentProducts from "../RecentProducts/RecentProducts"
import NoProductsFound from "../common/NoProductsFound"
import useProducts from "../../Hooks/useProducts"
import { FaTimes, FaFilter, FaCheck } from "react-icons/fa"

export default function Products() {
  const { data, isLoading, error } = useProducts()
  const [selectedCategory, setSelectedCategory] = useState("All categories")
  const [searchQuery, setSearchQuery] = useState("")
  // eslint-disable-next-line no-unused-vars
  const [isSearching, setIsSearching] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortOption, setSortOption] = useState("featured")
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [maxPrice, setMaxPrice] = useState(1000)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedAvailability, setSelectedAvailability] = useState("all") // all, inStock, outOfStock
  const productsPerPage = 12
  // eslint-disable-next-line no-unused-vars
  const [availableCategories, setAvailableCategories] = useState([])

  // Get location, search params, and navigate for routing
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const filtersRef = useRef(null)

  // Available categories - could be derived from data if needed
  const categories = ["New Born Girls", "New Born Boys", "Girls", "Boys", "Mother and Child", "Women", "Accessories"]

  // Find max price from products when data loads and extract actual categories from data
  useEffect(() => {
    if (data && data.length > 0) {
      const highestPrice = Math.max(...data.map((product) => product.price || 0))
      setMaxPrice(highestPrice > 0 ? Math.ceil(highestPrice) : 1000)
      setPriceRange([0, highestPrice > 0 ? Math.ceil(highestPrice) : 1000])

      // Extract actual categories from data for debugging
      const extractedCategories = [
        ...new Set(
          data
            .map((product) => {
              if (typeof product.category === "string") {
                return product.category
              } else if (Array.isArray(product.category)) {
                return product.category[0] // Take first if it's an array
              } else if (product.category && typeof product.category === "object") {
                return JSON.stringify(product.category) // Convert object to string for display
              }
              return String(product.category)
            })
            .filter(Boolean),
        ),
      ]

      setAvailableCategories(extractedCategories)
    }
  }, [data])

  // Check for category and search query in different sources when component mounts
  useEffect(() => {
    // Check for search query in URL parameters
    if (searchParams.get("search")) {
      setSearchQuery(searchParams.get("search"))
      setIsSearching(true)
    }

    // Priority 1: Check React Router state
    if (location.state && location.state.selectedCategory) {
      setSelectedCategory(location.state.selectedCategory)
      setIsSearching(true)
      // Clear the state after using it to prevent it from persisting on refresh
      window.history.replaceState({}, document.title)
    }
    // Priority 2: Check URL parameters
    else if (searchParams.get("category")) {
      const categoryFromUrl = searchParams.get("category")
      if (categoryFromUrl && (categories.includes(categoryFromUrl) || categoryFromUrl === "All categories")) {
        setSelectedCategory(categoryFromUrl)
        setIsSearching(true)
      }
    }
    // Priority 3: Check localStorage (fallback)
    else {
      const savedCategory = localStorage.getItem("selectedCategory")
      if (savedCategory && (categories.includes(savedCategory) || savedCategory === "All categories")) {
        setSelectedCategory(savedCategory)
        setIsSearching(true)
        // Clear localStorage after using it
        localStorage.removeItem("selectedCategory")
      }
    }
  }, [location, searchParams, categories])

  // Close filters when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filtersRef.current && !filtersRef.current.contains(event.target) && window.innerWidth < 768) {
        setShowFilters(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Helper function to normalize strings for comparison
  const normalizeString = (str) => {
    if (str === null || str === undefined) return ""
    return String(str).toLowerCase().trim()
  }

  // Helper function to check if a product belongs to a category
  const productMatchesCategory = (product, categoryToMatch) => {
    const normalizedCategoryToMatch = normalizeString(categoryToMatch)

    // If product has no category data
    if (!product.category) return false

    // If category is a string
    if (typeof product.category === "string") {
      return normalizeString(product.category).includes(normalizedCategoryToMatch)
    }

    // If category is an array
    if (Array.isArray(product.category)) {
      return product.category.some((cat) => normalizeString(cat).includes(normalizedCategoryToMatch))
    }

    // If category is an object with a name property (common pattern)
    if (product.category && typeof product.category === "object" && product.category.name) {
      return normalizeString(product.category.name).includes(normalizedCategoryToMatch)
    }

    // Last resort: try to match against stringified object
    return normalizeString(JSON.stringify(product.category)).includes(normalizedCategoryToMatch)
  }

  // Memoize filtered products to avoid unnecessary recalculations
  const filteredProducts = useMemo(() => {
    if (!data) return []

    let results = [...data]

    // Filter by category
    if (selectedCategory !== "All categories") {
      results = results.filter((product) => productMatchesCategory(product, selectedCategory))

      
    }

    // Filter by search query
    if (searchQuery.trim() !== "") {
      results = results.filter(
        (product) =>
          (product.name && product.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (product.title && product.title.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    // Filter by price range
    results = results.filter(
      (product) => (product.price || 0) >= priceRange[0] && (product.price || 0) <= priceRange[1],
    )

    // Filter by availability
    if (selectedAvailability !== "all") {
      results = results.filter((product) => {
        if (selectedAvailability === "inStock") {
          return product.inStock === true || product.stock > 0
        } else {
          return product.inStock === false || product.stock === 0
        }
      })
    }

    // Sort products
    switch (sortOption) {
      case "priceAsc":
        results.sort((a, b) => (a.price || 0) - (b.price || 0))
        break
      case "priceDesc":
        results.sort((a, b) => (b.price || 0) - (a.price || 0))
        break
      case "nameAsc":
        results.sort((a, b) => (a.name || a.title || "").localeCompare(b.name || b.title || ""))
        break
      case "nameDesc":
        results.sort((a, b) => (b.name || b.title || "").localeCompare(a.name || a.title || ""))
        break
      case "newest":
        results.sort((a, b) => {
          const dateA = new Date(a.createdAt || a.date || 0)
          const dateB = new Date(b.createdAt || b.date || 0)
          return dateB - dateA
        })
        break
      default: // featured or any other case
        // Keep original order or implement featured logic
        break
    }

    return results
  }, [data, searchQuery, selectedCategory, priceRange, selectedAvailability, sortOption])

  
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [filteredProducts.length])

  // Enhanced reset filters function that also resets URL

  // Clear all filters button handler
  const clearAllFilters = () => {
    // Reset all state
    setSearchQuery("")
    setSelectedCategory("All categories")
    setPriceRange([0, maxPrice])
    setSelectedAvailability("all")
    setSortOption("featured")
    setIsSearching(false)
    setCurrentPage(1)

    // Reset URL to base products page without parameters
    navigate("/products", { replace: true })
  }

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)

  // Handle price range change
  const handlePriceChange = (e) => {
    const value = Number.parseInt(e.target.value)
    if (e.target.id === "min-price") {
      setPriceRange([value, priceRange[1]])
    } else {
      setPriceRange([priceRange[0], value])
    }
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="text-center">
          <p className="text-red-500 mb-4">Failed to load products</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      {!isLoading ? (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 ">
          <div className="flex flex-col md:flex-row gap-8 ">
            {/* Mobile filter toggle */}
            <div className="md:hidden flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-pink-600">Products</h1>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-pink-100 text-pink-600 rounded-md hover:bg-pink-200 transition-colors"
              >
                {showFilters ? (
                  <>
                    <FaTimes className="w-4 h-4" />
                    <span>Hide Filters</span>
                  </>
                ) : (
                  <>
                    <FaFilter className="w-4 h-4" />
                    <span>Show Filters</span>
                  </>
                )}
              </button>
            </div>

            {/* Sidebar Filters */}
            <AnimatePresence>
              {(showFilters || window.innerWidth >= 768) && (
                <motion.div
                  ref={filtersRef}
                  initial={{ x: -300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className={`w-full md:w-72 bg-white p-4 rounded-lg shadow-md ${
                    window.innerWidth < 768 ? "fixed top-0 left-0 h-full z-50 overflow-y-auto" : ""
                  }`}
                >
                  {window.innerWidth < 768 && (
                    <div className="flex justify-between items-center mb-4 sticky top-0 bg-white py-2">
                      <h2 className="text-xl font-bold text-pink-600">Filters</h2>
                      <button 
                        onClick={() => setShowFilters(false)} 
                        className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                      >
                        <FaTimes className="w-5 h-5" />
                      </button>
                    </div>
                  )}

                  <div className="hidden md:block mb-6">
                    <h2 className="text-xl font-bold text-pink-600 mb-4">Filters</h2>
                  </div>

                  {/* Categories */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">Categories</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="all-categories"
                          name="category"
                          checked={selectedCategory === "All categories"}
                          onChange={() => setSelectedCategory("All categories")}
                          className="h-4 w-4 text-pink-600 focus:ring-pink-500"
                        />
                        <label htmlFor="all-categories" className="ml-2 text-gray-700">
                          All categories
                        </label>
                      </div>
                      {categories.map((category) => (
                        <div key={category} className="flex items-center">
                          <input
                            type="radio"
                            id={category}
                            name="category"
                            checked={selectedCategory === category}
                            onChange={() => setSelectedCategory(category)}
                            className="h-4 w-4 text-pink-600 focus:ring-pink-500"
                          />
                          <label htmlFor={category} className="ml-2 text-gray-700">
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">Price Range</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                          <label htmlFor="min-price" className="block text-sm text-gray-600 mb-1">
                            Min
                          </label>
                          <input
                            type="number"
                            id="min-price"
                            min="0"
                            max={maxPrice}
                            value={priceRange[0]}
                            onChange={handlePriceChange}
                            className="w-full px-3 py-2 border rounded-md focus:ring-pink-500 focus:border-pink-500"
                          />
                        </div>
                        <div className="flex-1">
                          <label htmlFor="max-price" className="block text-sm text-gray-600 mb-1">
                            Max
                          </label>
                          <input
                            type="number"
                            id="max-price"
                            min="0"
                            max={maxPrice}
                            value={priceRange[1]}
                            onChange={handlePriceChange}
                            className="w-full px-3 py-2 border rounded-md focus:ring-pink-500 focus:border-pink-500"
                          />
                        </div>
                      </div>
                      <div className="px-2">
                        <input
                          type="range"
                          min="0"
                          max={maxPrice}
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value)])}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>${priceRange[0]}</span>
                          <span>${priceRange[1]}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Filter Actions */}
                  <div className="flex flex-col gap-2 sticky bottom-0 bg-white py-4">
                    <button
                      onClick={clearAllFilters}
                      className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <FaTimes className="w-4 h-4" />
                      Clear Filters
                    </button>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="md:hidden w-full py-2 px-4 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <FaCheck className="w-4 h-4" />
                      Apply Filters
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="flex-1">
              {/* Header with count, sort and view options */}
              <div className="hidden md:flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-pink-600">Products</h1>
              </div>

              {/* Search and Filters Bar */}
              {/* Active Filters */}
              <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                  {/* Sort and View Options */}
                  <div className="flex gap-2 items-center">
                    <div className="flex items-center">
                      <label htmlFor="sort" className="mr-2 text-sm text-gray-600 whitespace-nowrap">
                        Sort by:
                      </label>
                      <select
                        id="sort"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="p-2 border rounded-md focus:ring-pink-500 focus:border-pink-500"
                      >
                        <option value="featured">Featured</option>
                        <option value="priceAsc">Price: Low to High</option>
                        <option value="priceDesc">Price: High to Low</option>
                        <option value="nameAsc">Name: A to Z</option>
                        <option value="nameDesc">Name: Z to A</option>
                        <option value="newest">Newest First</option>
                      </select>
                    </div>
                  </div>
                </div>

                {(selectedCategory !== "All categories" ||
                  searchQuery ||
                  priceRange[0] > 0 ||
                  priceRange[1] < maxPrice ||
                  selectedAvailability !== "all") && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedCategory !== "All categories" && (
                      <div className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm flex items-center">
                        Category: {selectedCategory}
                        <button
                          onClick={() => setSelectedCategory("All categories")}
                          className="ml-2 focus:outline-none"
                          aria-label="Remove category filter"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                    {searchQuery && (
                      <div className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm flex items-center">
                        Search: {searchQuery}
                        <button
                          onClick={() => setSearchQuery("")}
                          className="ml-2 focus:outline-none"
                          aria-label="Remove search filter"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                    {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
                      <div className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm flex items-center">
                        Price: {priceRange[0]} - {priceRange[1]}
                        <button
                          onClick={() => setPriceRange([0, maxPrice])}
                          className="ml-2 focus:outline-none"
                          aria-label="Remove price filter"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                    {selectedAvailability !== "all" && (
                      <div className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm flex items-center">
                        {selectedAvailability === "inStock" ? "In Stock" : "Out of Stock"}
                        <button
                          onClick={() => setSelectedAvailability("all")}
                          className="ml-2 focus:outline-none"
                          aria-label="Remove availability filter"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                    <button
                      onClick={clearAllFilters}
                      className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-300 transition-colors"
                    >
                      Clear All
                    </button>
                  </div>
                )}
              </div>

              {/* Results Count */}
              <div className="mb-4 text-gray-600">
                {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"} found
              </div>

              {/* Product Grid */}
              {currentProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
                  {currentProducts.map((product, index) => (
                    <motion.div
                      key={product.id || index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <RecentProducts product={product} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <NoProductsFound 
                  message={searchQuery
                    ? `No products found matching ${searchQuery}`
                    : selectedCategory !== "All categories"
                      ? `No products found in the ${selectedCategory} category`
                      : "No products match your current filters"
                  }
                  highlightedText={searchQuery || (selectedCategory !== "All categories" ? selectedCategory : "")}
                  primaryButtonText="Reset Filters"
                  primaryButtonLink="/products"
                  secondaryButtonText="Browse Categories"
                  secondaryButtonLink="/categories"
                  iconType="smile"
                  accentColor="pink"
                />
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8 mb-4">
                  <nav className="flex items-center space-x-1">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed bg-white text-pink-600 hover:bg-pink-50"
                      aria-label="Previous page"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(
                        (page) =>
                          page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1),
                      )
                      .map((page, index, array) => {
                        // Add ellipsis
                        if (index > 0 && page - array[index - 1] > 1) {
                          return (
                            <span key={`ellipsis-${page}`} className="px-3 py-2 text-gray-500">
                              &hellip;
                            </span>
                          )
                        }

                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-2 rounded-md border ${
                              currentPage === page
                                ? "bg-pink-500 text-white border-pink-500"
                                : "bg-white text-pink-600 hover:bg-pink-50"
                            }`}
                            aria-label={`Page ${page}`}
                            aria-current={currentPage === page ? "page" : undefined}
                          >
                            {page}
                          </button>
                        )
                      })}

                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed bg-white text-pink-600 hover:bg-pink-50"
                      aria-label="Next page"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <Loader />
        </div>
      )}
    </>
  )
}