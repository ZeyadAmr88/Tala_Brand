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
          <h1 className="text-2xl font-bold text-center my-6 text-main">All Products</h1>

          {/* Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-10">
            {data?.map((product, index) => (
              <RecentProducts products={product} key={index} />
            ))}
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
