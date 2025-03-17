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
            <Loader color="pink" />
          </div>
        )}
      </section>
    </main>
  );
}
