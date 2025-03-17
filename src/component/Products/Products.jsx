"use client";

import { useState, useEffect } from "react";
import Loader from "../Loader/Loader";
import RecentProducts from "../RecentProducts/RecentProducts";
import useProducts from "../../Hooks/useProducts";

export default function Products() {
  const { data, isLoading } = useProducts();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All categories");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Initialize filtered products with all products when data is loaded
  useEffect(() => {
    if (data) {
      setFilteredProducts(data);
    }
  }, [data]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const selectCategory = (category) => {
    setSelectedCategory(category);
    setIsDropdownOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearching(true);

    // Filter products by name
    if (data) {
      let results = [...data];

      // Filter by search query (product name)
      if (searchQuery.trim() !== "") {
        results = results.filter(
          (product) =>
            product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.title?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Filter by category if a specific category is selected
      if (selectedCategory !== "All categories") {
        results = results.filter(
          (product) =>
            product.category?.toLowerCase() === selectedCategory.toLowerCase()
        );
      }

      setFilteredProducts(results);
    }
  };

  // Reset search
  const resetSearch = () => {
    setSearchQuery("");
    setSelectedCategory("All categories");
    setFilteredProducts(data || []);
    setIsSearching(false);
  };

  const categories = [
    "All categories",
    "Mockups",
    "Templates",
    "Design",
    "Logos",
  ];

  return (
    <>
      {!isLoading ? (
        <div className="px-4 sm:px-8 md:px-12">
          <h1 className="text-2xl font-bold text-center my-6 text-main mt-24">
            All Products
          </h1>

          {/* Search Bar */}
          <form
            className="max-w-lg mx-auto my-8 rounded-md"
            onSubmit={handleSearch}
          >
            <div className="flex shadow-sm">
              <div className="relative">
                <button
                  id="dropdown-button"
                  type="button"
                  onClick={toggleDropdown}
                  className="shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-white bg-pink-500 border border-pink-500 rounded-s-lg hover:bg-pink-600 focus:ring-2 focus:outline-none focus:ring-pink-300 min-w-[140px]"
                >
                  {selectedCategory}
                  <svg
                    className="w-2.5 h-2.5 ms-2.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 4 4 4-4"
                    />
                  </svg>
                </button>
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 z-10 bg-white divide-y divide-gray-100 rounded-lg w-[140px] mt-1">
                    <ul
                      className="py-2 text-sm text-gray-700 dark:text-gray-200"
                      aria-labelledby="dropdown-button"
                    >
                      {categories.slice(1).map((category) => (
                        <li key={category}>
                          <button
                            type="button"
                            onClick={() => selectCategory(category)}
                            className="inline-flex w-full px-4 py-2 text-black hover:bg-pink-600 dark:hover:text-white"
                          >
                            {category}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="relative w-full">
                <input
                  type="search"
                  id="search-dropdown"
                  className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-white border border-gray-300 focus:ring-pink-500 focus:border-pink-500 rounded-r-[10px]"
                  placeholder="Search...."
                  required
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-pink-500 rounded-e-lg border border-pink-500 hover:bg-pink-600 focus:ring-4 focus:outline-none focus:ring-pink-300"
                >
                  <svg
                    className="w-4 h-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                  <span className="sr-only">Search</span>
                </button>
              </div>
            </div>
          </form>

          {/* Search Results Info */}
          {isSearching && (
            <div className="max-w-lg mx-auto mb-4 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                {filteredProducts.length === 0
                  ? "No products found"
                  : `Found ${filteredProducts.length} product${
                      filteredProducts.length !== 1 ? "s" : ""
                    }`}
              </p>
              <button
                onClick={resetSearch}
                className="text-sm text-pink-500 hover:text-pink-700"
              >
                Clear search
              </button>
            </div>
          )}

          {/* Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-10">
            {filteredProducts.length > 0
              ? filteredProducts.map((product, index) => (
                  <RecentProducts products={product} key={index} />
                ))
              : isSearching && (
                  <div className="col-span-full text-center py-10">
                    <p className="text-lg text-gray-500">
                      No products found matching your search criteria.
                    </p>
                  </div>
                )}
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <Loader />
        </div>
      )}
    </>
  );
}
