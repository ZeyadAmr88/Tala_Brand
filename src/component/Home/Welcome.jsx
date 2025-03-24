import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useRef } from 'react'

export default function Welcome() {
    const welcomeRef = useRef(null);
    const { scrollY } = useScroll();
    const opacity = useTransform(scrollY, [0, 600], [1, 0]);
    const scale = useTransform(scrollY, [0, 200], [1, 0.9]);
    const scrollToProducts = () => {
        window.scrollTo({
            top: window.innerHeight - 100,
            behavior: "smooth",
        });
    };
    return (
        <motion.div
            ref={welcomeRef}
            style={{ opacity, scale }}
            className="absolute top-0 left-0 w-full h-[98vh] flex flex-col items-center rounded-b-[550px] justify-center 
            bg-gradient-to-r from-pink-400 to-pink-600 text-white"
        >

            <div className="text-center px-4 max-w-3xl">
                <h1 className="text-5xl md:text-7xl font-bold mb-6 font-serif" translate="no">Tala Brand</h1>
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
    )
}
