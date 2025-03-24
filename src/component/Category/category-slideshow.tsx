"use client"

import  React from "react"
import { useEffect, useState } from "react"
import { useMediaQuery } from "../../Hooks/use-media-query"

// Define the category type
type Category = {
  id: number
  name: string
  image: string
  slug: string
}

// Sample categories data
const categories: Category[] = [
  { id: 1, name: "New Born Boys", image: "https://via.placeholder.com/300", slug: "new-born-boys" },
  { id: 2, name: "New Born Girls", image: "https://via.placeholder.com/300", slug: "new-born-girls" },
  { id: 3, name: "Girls", image: "https://via.placeholder.com/300", slug: "girls" },
  { id: 4, name: "Boys", image: "https://via.placeholder.com/300", slug: "boys" },
  { id: 5, name: "Mother and Child", image: "https://via.placeholder.com/300", slug: "mother-and-child" },
  { id: 6, name: "Women", image: "https://via.placeholder.com/300", slug: "women" },
  { id: 7, name: "Accessories", image: "https://via.placeholder.com/300", slug: "accessories" },
  { id: 8, name: "Shoes", image: "https://via.placeholder.com/300", slug: "shoes" },
]

const CategorySlideshow: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0)

  // Custom hook for responsive design
  const isMobile = useMediaQuery("(max-width: 640px)")
  const isTablet = useMediaQuery("(min-width: 641px) and (max-width: 1024px)")

  // Set the number of visible slides based on screen size
  const slidesToShow = isMobile ? 1 : isTablet ? 2 : 3

  // Calculate total number of slides
  const totalSlides = categories.length
  const maxIndex = totalSlides - slidesToShow

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex >= maxIndex ? 0 : prevIndex + 1))
    }, 3000) // Change slide every 3 seconds

    return () => clearInterval(interval)
  }, [maxIndex])

  // Handle manual navigation
  const goToPrevious = () => {
    setActiveIndex((prevIndex) => (prevIndex <= 0 ? maxIndex : prevIndex - 1))
  }

  const goToNext = () => {
    setActiveIndex((prevIndex) => (prevIndex >= maxIndex ? 0 : prevIndex + 1))
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Shop by Category</h2>
          <p className="max-w-[700px] text-gray-500 md:text-xl">
            Explore our wide range of products across different categories
          </p>
        </div>

        <div className="mt-8 relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * (100 / slidesToShow)}%)` }}
            >
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex-shrink-0"
                  style={{ width: `${100 / slidesToShow}%`, padding: "0 8px" }}
                >
                  <a href={`/category/${category.slug}`} className="block">
                    <div className="overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                      <div className="relative">
                        <img
                          src={category.image || "/placeholder.svg"}
                          alt={category.name}
                          className="w-full aspect-square object-cover transition-transform duration-300 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <div className="absolute bottom-0 w-full p-4">
                          <h3 className="text-xl font-semibold text-white">{category.name}</h3>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
            aria-label="Previous slide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
            aria-label="Next slide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          {/* Slide counter */}
          <div className="flex justify-center mt-4">
            <span className="text-sm text-gray-500">
              {activeIndex + 1} / {maxIndex + 1}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CategorySlideshow

