"use client";

import { useEffect, useState, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import RecentProducts from "../RecentProducts/RecentProducts";
import Loader from "../Loader/Loader";
import useProducts from "../../Hooks/useProducts";

export default function Home() {

  const welcomeRef = useRef(null);
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.9]);
  let { data, isLoading } = useProducts();

  

  const scrollToProducts = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <main className="min-h-screen">
      {/* Welcome Screen */}
      <motion.div
        ref={welcomeRef}
        style={{ opacity, scale }}
        className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-r from-pink-400 to-pink-600 text-white z-10"
      >
        <div className="text-center px-4 max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 font-serif">Tala Brand</h1>
          <p className="text-xl md:text-2xl mb-8">
            Discover our exclusive collection of fashion accessories and clothing
          </p>
          <button
            onClick={scrollToProducts}
            className="flex items-center justify-center gap-2 bg-white text-pink-600 px-8 py-3 rounded-full font-medium hover:bg-pink-100 transition-colors"
          >
            Explore Collection
            <ChevronDown className="animate-bounce" />
          </button>
        </div>
      </motion.div>

      {/* Navigation Bar */}
      <header className="sticky top-0 bg-pink-500 text-white z-20 shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-serif">Tala Brand</h1>
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="hover:underline">Home</a>
            <a href="#" className="hover:underline">Cart</a>
            <a href="#" className="hover:underline">Brands</a>
            <a href="#" className="hover:underline">Products</a>
            <a href="#" className="hover:underline">Categories</a>
          </nav>
          <div className="flex items-center space-x-4">
            <a href="#" className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="absolute -top-2 -right-2 bg-white text-pink-500 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">2</span>
            </a>
            <a href="#" className="hover:underline">Logout</a>
          </div>
        </div>
      </header>

      {/* Products Section */}
      <section className="pt-[100vh] px-4 sm:px-8 md:px-12">
        {!isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-16">
            {data?.map((product, index) => (
              <RecentProducts products={product} key={index} />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-screen">
            <Loader />
          </div>
        )}
      </section>
    </main>
  );
}
