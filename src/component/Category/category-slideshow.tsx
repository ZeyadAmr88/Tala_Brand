"use client";

import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useMediaQuery } from "../../Hooks/use-media-query";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// Define the category type
type Category = {
  id: string;
  name: string;
  slug: string;
  image: { url: string };
};

const CategorySlideshow: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();

  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(min-width: 641px) and (max-width: 1024px)");
  const isLargeScreen = useMediaQuery("(min-width: 1280px)");

  const slidesToShow = isMobile ? 1 : isTablet ? 2 : isLargeScreen ? 4 : 3;

  useEffect(() => {
    setLoading(true);
    axios
      .get("https://tala-store.vercel.app/category")
      .then((response) => {
        if (response.data.success) {
          setCategories(response.data.categories);
        } else {
          setError("Failed to load categories");
        }
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setError("Error loading categories. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, []);

  const totalSlides = categories.length;
  const maxIndex = Math.max(totalSlides - slidesToShow, 0);

  useEffect(() => {
    if (categories.length === 0 || isPaused) return;

    const interval = setInterval(() => {
      setActiveIndex((prevIndex) =>
        prevIndex >= maxIndex ? 0 : prevIndex + 1
      );
    }, 2500);

    return () => clearInterval(interval);
  }, [categories, maxIndex, isPaused]);

  // Function to handle category click
  const handleCategoryClick = (category: Category) => {
    navigate("/products", {
      state: { selectedCategory: category.name },
    });
    localStorage.setItem("selectedCategory", category.name);
  };

  const nextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex >= maxIndex ? 0 : prevIndex + 1));
  };

  const prevSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex <= 0 ? maxIndex : prevIndex - 1));
  };

  // Render loading state
  if (loading) {
    return (
      <div className="py-12 flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="relative w-16 h-16">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-pink-200 rounded-full animate-ping opacity-75"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-pink-500 rounded-full animate-pulse"></div>
          </div>
          <p className="mt-4 text-pink-600 font-medium">
            Loading categories...
          </p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="py-12 flex justify-center items-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-red-500 mb-4 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg font-medium text-red-800 text-center mb-2">
            Failed to Load Categories
          </h3>
          <p className="text-red-600 text-center">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 w-full bg-red-100 hover:bg-red-200 text-red-800 font-medium py-2 px-4 rounded-md transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Render empty state
  if (categories.length === 0) {
    return (
      <div className="py-12 flex justify-center items-center">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-gray-400 mb-4 mx-auto"
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
          <h3 className="text-xl font-medium text-gray-800 mb-2">
            No Categories Available
          </h3>
          <p className="text-gray-600">
            We couldn't find any categories to display at the moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-12 overflow-hidden">
      <div className="container mx-auto px-4">
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <div className="overflow-hidden rounded-xl">
            <motion.div
              className="flex"
              initial={false}
              animate={{ x: `-${activeIndex * (100 / slidesToShow)}%` }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe =
                  offset.x < -50 || (offset.x < 0 && velocity.x < -300)
                    ? 1
                    : offset.x > 50 || (offset.x > 0 && velocity.x > 300)
                    ? -1
                    : 0;

                if (swipe === 1) {
                  nextSlide();
                } else if (swipe === -1) {
                  prevSlide();
                }
              }}
            >
              {categories.map((category, index) => (
                <div
                  key={category.id}
                  className="flex-shrink-0"
                  style={{ width: `${100 / slidesToShow}%`, padding: "0 8px" }}
                >
                  <motion.div
                    whileHover={{ y: -8 }}
                    onClick={() => handleCategoryClick(category)}
                    className="cursor-pointer h-full"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <div
                      className={`overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 h-full`}
                    >
                      <div className="relative group h-full">
                        <div className="aspect-square overflow-hidden">
                          <motion.img
                            src={category.image.url || "/placeholder.svg"}
                            alt={category.name}
                            className="w-full h-full object-cover"
                            whileHover={{ scale: 1.08 }}
                            transition={{ duration: 0.3 }}
                            loading="lazy"
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                        <div className="absolute bottom-0 w-full p-5">
                          <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
                            {category.name}
                          </h3>
                          <div className="w-0 group-hover:w-full h-0.5 bg-pink-400 transition-all duration-200"></div>
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileHover={{ opacity: 1, y: 0 }}
                            className="mt-2 text-white/80 text-sm"
                          >
                            Click to explore
                          </motion.div>
                        </div>

                        {/* Hover effect overlay */}
                        <motion.div
                          className="absolute inset-0 bg-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          whileHover={{ opacity: 1 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Navigation buttons */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-pink-50 transition-colors z-10"
            aria-label="Previous slide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-pink-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-pink-50 transition-colors z-10"
            aria-label="Next slide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-pink-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </motion.button>

          {/* Slide indicators */}
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  activeIndex === index
                    ? "w-8 bg-pink-500"
                    : "w-2 bg-pink-200 hover:bg-pink-300"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Swipe instruction for mobile */}
          <div className="text-center mt-4 text-xs text-gray-500 md:hidden">
            Swipe left or right to navigate
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategorySlideshow;
