"use client"

import  React from "react"
import { useEffect, useState } from "react"
import axios from "axios"
import { useMediaQuery } from "../../Hooks/use-media-query"
import { useNavigate } from "react-router-dom"

// Define the category type
type Category = {
  id: string
  name: string
  slug: string
  image: { url: string }
}

const CategorySlideshow: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const isMobile = useMediaQuery("(max-width: 640px)")
  const isTablet = useMediaQuery("(min-width: 641px) and (max-width: 1024px)")

  const slidesToShow = isMobile ? 1 : isTablet ? 2 : 3

  useEffect(() => {
    axios
      .get("https://tala-store.vercel.app/category")
      .then((response) => {
        if (response.data.success) {
          setCategories(response.data.categories)
        }
      })
      .catch((error) => console.error("Error fetching categories:", error))
      .finally(() => setLoading(false))
  }, [])

  const totalSlides = categories.length
  const maxIndex = Math.max(totalSlides - slidesToShow, 0)

  useEffect(() => {
    if (categories.length === 0) return

    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex >= maxIndex ? 0 : prevIndex + 1))
    }, 3000)

    return () => clearInterval(interval)
  }, [categories, maxIndex])

  // Function to handle category click
  const handleCategoryClick = (category: Category) => {
    // Navigate to products page with the selected category as state
    navigate("/products", {
      state: { selectedCategory: category.name },
    })

    // Alternative approach: using URL parameters
    // navigate(`/products?category=${encodeURIComponent(category.name)}`);

    // Store in localStorage as a fallback
    localStorage.setItem("selectedCategory", category.name)
  }

  if (loading) return <p className="text-center text-gray-500">Loading categories...</p>
  if (categories.length === 0) return <p className="text-center text-gray-500">No categories available.</p>

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">Shop by Category</h2>
          <p className="max-w-[700px] mx-auto text-gray-500 md:text-xl">
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
                  <div onClick={() => handleCategoryClick(category)} className="cursor-pointer">
                    <div className="overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                      <div className="relative">
                        <img
                          src={category.image.url || "/placeholder.svg"}
                          alt={category.name}
                          className="w-full aspect-square object-cover transition-transform duration-300 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <div className="absolute bottom-0 w-full p-4">
                          <h3 className="text-xl font-semibold text-white">{category.name}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveIndex((prevIndex) => (prevIndex <= 0 ? maxIndex : prevIndex - 1))}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
            aria-label="Previous slide"
          >
            ❮
          </button>
          <button
            onClick={() => setActiveIndex((prevIndex) => (prevIndex >= maxIndex ? 0 : prevIndex + 1))}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
            aria-label="Next slide"
          >
            ❯
          </button>

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

