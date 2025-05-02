"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, Sparkles } from "lucide-react";
import { useRef } from "react";

export default function Welcome() {
  const welcomeRef = useRef(null);
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 600], [1, 0]);
  const scale = useTransform(scrollY, [0, 200], [1, 0.9]);
  const titleY = useTransform(scrollY, [0, 300], [0, -50]);
  const buttonScale = useTransform(scrollY, [0, 200], [1, 0.95]);
  const backgroundY = useTransform(scrollY, [0, 300], [0, 100]);

  const scrollToProducts = () => {
    window.scrollTo({
      top: window.innerHeight - 80,
      behavior: "smooth",
    });
  };

  return (
    <motion.div
      ref={welcomeRef}
      style={{ opacity, scale }}
      className="absolute top-0 left-0 w-full h-[100vh] flex flex-col items-center justify-center
            bg-gradient-to-br from-pink-400 via-pink-500 to-pink-600 text-white overflow-hidden"
    >
      {/* Decorative elements */}
      <motion.div
        className="absolute inset-0 overflow-hidden"
        style={{ y: backgroundY }}
      >
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 rounded-full bg-white/10 blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 8,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-80 h-80 md:w-[30rem] md:h-[30rem] rounded-full bg-pink-300/20 blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 10,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        {/* Additional decorative elements */}
        <motion.div
          className="absolute top-1/3 right-1/4 w-40 h-40 md:w-64 md:h-64 rounded-full bg-pink-200/10 blur-3xl hidden md:block"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 12,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        <motion.div
          className="absolute bottom-1/4 left-1/3 w-32 h-32 md:w-48 md:h-48 rounded-full bg-white/5 blur-3xl"
          animate={{
            x: [0, -20, 0],
            y: [0, -40, 0],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 9,
            ease: "easeInOut",
            delay: 1.5,
          }}
        />
      </motion.div>

      {/* Content */}
      <motion.div
        className="text-center px-4 max-w-4xl z-10"
        style={{ y: titleY }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="text-pink-200 h-5 w-5" />
            <span className="uppercase tracking-widest text-sm font-medium text-pink-100">
              Premium Collection
            </span>
            <Sparkles className="text-pink-200 h-5 w-5" />
          </div>

          <h1
            className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 font-serif relative inline-block"
            translate="no"
          >
            <span className="relative z-10">Tala Brand</span>
            <motion.span
              className="absolute -bottom-3 left-0 w-full h-3 bg-pink-300/30 rounded-full z-0"
              animate={{ width: ["0%", "100%"] }}
              transition={{ duration: 1.2, delay: 0.5 }}
            />
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl mb-10 text-pink-50 max-w-xl mx-auto leading-relaxed">
            Discover our exclusive collection of fashion accessories and
            clothing designed for the modern individual
          </p>

          {/* Desktop button */}
          <motion.div
            style={{ scale: buttonScale }}
            className="hidden md:block"
          >
            <button
              onClick={scrollToProducts}
              className="group relative flex items-center justify-center gap-2 bg-white text-pink-600 px-10 py-4 rounded-full font-medium
                hover:bg-pink-50 transition-colors shadow-lg hover:shadow-xl"
            >
              <span className="relative z-10">Explore Collection</span>
              <ChevronDown className="group-hover:animate-bounce transition-all duration-300" />
              <motion.span className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-100 to-white z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </motion.div>

          {/* Mobile button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="md:hidden mt-6"
          >
            <button
              onClick={scrollToProducts}
              className="group relative flex items-center justify-center gap-2 bg-white text-pink-600 px-8 py-3 rounded-full font-medium
                shadow-lg active:scale-95 transition-transform"
            >
              <span className="relative z-10">Shop Now</span>
              <ChevronDown className="animate-bounce transition-all duration-300" />
            </button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 2,
          ease: "easeInOut",
        }}
      >
        <div className="w-6 h-10 border-2 border-white/70 rounded-full flex items-start justify-center p-1">
          <motion.div
            className="w-1 h-2 bg-white rounded-full"
            animate={{ y: [0, 15, 0] }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 2,
              ease: "easeInOut",
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
