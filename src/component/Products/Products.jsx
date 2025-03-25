
import { useMemo } from "react"

import { useState, useEffect } from "react"
import { useLocation, useSearchParams } from "react-router-dom"
import { ChevronDown, Search, X } from "lucide-react"
import Loader from "../Loader/Loader"
import RecentProducts from "../RecentProducts/RecentProducts"
import useProducts from "../../Hooks/useProducts"

export default function Products() {
  const { data, isLoading, error } = useProducts()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("All categories")
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 20

  // Get location and search params for accessing the category
  const location = useLocation()
  const [searchParams] = useSearchParams()

  // Available categories - could be derived from data if needed
  const categories = ["New Born Girls", "New Born Boys", "Girls", "Boys", "Mother and Child", "Women", "Accessories"]

  // Check for category in different sources when component mounts
  useEffect(() => {
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

  // Memoize filtered products to avoid unnecessary recalculations
  const filteredProducts = useMemo(() => {
    if (!data) return []

    let results = [...data]

    if (searchQuery.trim() !== "" || selectedCategory !== "All categories") {
      // Only filter if we have search criteria
      if (searchQuery.trim() !== "") {
        results = results.filter(
          (product) =>
            product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.title?.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      }

      if (selectedCategory !== "All categories") {
        results = results.filter((product) => {
          // Check if category exists and is a string before calling toLowerCase
          if (typeof product.category === "string") {
            return product.category.toLowerCase() === selectedCategory.toLowerCase()
          }
          return false
        })
      }
    }

    return results
  }, [data, searchQuery, selectedCategory])

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [filteredProducts.length])

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen)

  const selectCategory = (category) => {
    setSelectedCategory(category)
    setIsDropdownOpen(false)
    setIsSearching(true)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setIsSearching(true)
  }

  const resetSearch = () => {
    setSearchQuery("")
    setSelectedCategory("All categories")
    setIsSearching(false)
    setCurrentPage(1)
  }

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)

  // Handle keyboard navigation for dropdown
  const handleKeyDown = (e, category) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      selectCategory(category)
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (isDropdownOpen) setIsDropdownOpen(false)
    }

    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [isDropdownOpen])

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
        <div className="px-4 sm:px-8 md:px-12">
          <h1 className="text-2xl font-bold text-center my-6 text-main mt-24">All Products</h1>

          {/* Search Bar */}
          <form className="max-w-lg mx-auto my-8 rounded-md" onSubmit={handleSearch}>
            <div className="flex shadow-sm relative">
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={toggleDropdown}
                  className="py-2.5 px-4 text-white bg-pink-500 border rounded-s-lg hover:bg-pink-600 min-w-[140px] flex items-center justify-between"
                  aria-haspopup="listbox"
                  aria-expanded={isDropdownOpen}
                >
                  <span>{selectedCategory}</span>
                  <ChevronDown className="w-4 h-4 ml-1" />
                </button>
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 bg-white rounded-lg w-[140px] mt-1 shadow-lg z-10">
                    <ul className="py-2 text-sm text-gray-700" role="listbox" aria-labelledby="category-dropdown">
                      <li>
                        <button
                          type="button"
                          onClick={() => selectCategory("All categories")}
                          onKeyDown={(e) => handleKeyDown(e, "All categories")}
                          className="inline-flex w-full px-4 py-2 text-black hover:bg-pink-100 focus:bg-pink-100 focus:outline-none"
                          role="option"
                          aria-selected={selectedCategory === "All categories"}
                          tabIndex={0}
                        >
                          All categories
                        </button>
                      </li>
                      {categories.map((category) => (
                        <li key={category}>
                          <button
                            type="button"
                            onClick={() => selectCategory(category)}
                            onKeyDown={(e) => handleKeyDown(e, category)}
                            className="inline-flex w-full px-4 py-2 text-black hover:bg-pink-100 focus:bg-pink-100 focus:outline-none"
                            role="option"
                            aria-selected={selectedCategory === category}
                            tabIndex={0}
                          >
                            {category}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="relative flex-grow">
                <input
                  type="search"
                  className="p-2.5 w-full text-sm text-gray-900 bg-white border rounded-r-[10px]"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search products"
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="p-2.5 text-white bg-pink-500 rounded-e-lg border hover:bg-pink-600 transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Search status and reset */}
          {isSearching && (
            <div className="flex justify-between items-center max-w-lg mx-auto mb-4">
              <p className="text-sm text-gray-600">
                {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"} found
              </p>
              {(searchQuery || selectedCategory !== "All categories") && (
                <button onClick={resetSearch} className="text-sm text-pink-500 hover:text-pink-700 flex items-center">
                  <X className="w-4 h-4 mr-1" /> Clear filters
                </button>
              )}
            </div>
          )}

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-10">
            {currentProducts.length > 0 ? (
              currentProducts.map((product, index) => <RecentProducts product={product} key={product.id || index} />)
            ) : (
              <div className="col-span-full text-center py-10">
                {selectedCategory !== "All categories" ? (
                  <div>
                    <p className="text-lg text-gray-500 mb-2">
                      We don&apos;t have any products in the <span className="font-semibold">{selectedCategory}</span>{" "}
                      category at the moment.
                    </p>
                    <p className="text-md text-gray-500">Please check back later or try another category.</p>
                  </div>
                ) : (
                  <p className="text-lg text-gray-500">No products found.</p>
                )}
                {isSearching && (
                  <button
                    onClick={resetSearch}
                    className="mt-4 px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 mb-12 items-center">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border rounded-l mr-1 disabled:opacity-50 disabled:cursor-not-allowed bg-white text-pink-500 hover:bg-pink-50"
                aria-label="Previous page"
              >
                &laquo;
              </button>

              {/* Show limited page numbers with ellipsis for better UX */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (page) => page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1),
                )
                .map((page, index, array) => {
                  // Add ellipsis
                  if (index > 0 && page - array[index - 1] > 1) {
                    return (
                      <span key={`ellipsis-${page}`} className="px-3 py-2">
                        &hellip;
                      </span>
                    )
                  }

                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 border mx-1 rounded ${currentPage === page ? "bg-pink-500 text-white" : "bg-white text-pink-500 hover:bg-pink-50"
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
                className="px-3 py-2 border rounded-r ml-1 disabled:opacity-50 disabled:cursor-not-allowed bg-white text-pink-500 hover:bg-pink-50"
                aria-label="Next page"
              >
                &raquo;
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <Loader />
        </div>
      )}
    </>
  )
}

