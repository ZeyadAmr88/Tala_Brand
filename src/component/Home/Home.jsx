"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import RecentProducts from "../RecentProducts/RecentProducts"
import Loader from "../Loader/Loader"
import useProducts from "../../Hooks/useProducts"
import CategorySlideshow from "../Category/category-slideshow"
import { Button } from "./Button"
import Welcome from "./Welcome"
import { Link } from "react-router-dom";

export default function Home() {
  const { data, isLoading } = useProducts()
  const allProducts = Array.isArray(data) ? data : []
  const [newestProducts, setNewestProducts] = useState([])

  // Get the newest products (assuming products have a createdAt or date field)
  useEffect(() => {
    if (allProducts.length > 0) {
      // Sort products by date (newest first) and take the first 8
      // Adjust the sorting logic based on your actual data structure
      const sorted = [...allProducts]
        .sort((a, b) => {
          const dateA = new Date(a.createdAt || a.date || 0)
          const dateB = new Date(b.createdAt || b.date || 0)
          return dateB - dateA
        })
        .slice(0, 8)

      setNewestProducts(sorted)
    }
  }, [allProducts])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  // Function to render arrow icon since you might not have Lucide icons
  const ArrowRight = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
    >
      <path d="M5 12h14"></path>
      <path d="m12 5 7 7-7 7"></path>
    </svg>
  )

  // Function to render trending up icon
  const TrendingUp = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-pink-500 h-5 w-5"
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
      <polyline points="16 7 22 7 22 13"></polyline>
    </svg>
  )

  return (
    <main className="min-h-screen relative">
      {/* Welcome section */}
      <Welcome />
    <div className="bg-white pt-[100vh]">
      {/* Categories Section */}
      <section className="py-16 px-4 sm:px-8 md:px-12 bg-gradient-to-b from-white to-pink-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-10 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Explore Our <span className="text-pink-500">Categories</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse through our carefully curated collection of fashion categories, designed to help you find exactly
              what you&apos;re looking for.
            </p>
          </motion.div>

          <CategorySlideshow />

          <div className="text-center mt-8">
            <Link to={"/products"}>
              <Button variant="link" className="group">
                View All Categories
                <ArrowRight />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newest Items Section */}
      <section className="py-16 px-4 sm:px-8 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-10 flex flex-col md:flex-row md:items-end justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp />
                <span className="text-pink-500 font-medium uppercase tracking-wider text-sm">Just Arrived</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold">Our Newest Collection</h2>
              <p className="text-gray-600 mt-2 max-w-2xl">
                Be the first to discover our latest arrivals, featuring this season&apos;s most coveted styles.
              </p>
            </div>
            <Link to={"/products"}>
            <Button variant="link" className="group mt-4 md:mt-0 self-start md:self-auto">
              View All New Arrivals
              <ArrowRight />
            </Button>
            </Link>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center items-center py-32">
              <Loader />
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {newestProducts.slice(0, 4).map((product) => (
                <motion.div key={product._id} variants={itemVariants}>
                  <RecentProducts product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

    </div>
    </main>
  )
}

