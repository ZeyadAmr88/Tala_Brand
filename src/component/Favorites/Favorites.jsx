import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useFavorites } from "../Context/FavoritesContext";
import { CartContext } from "../Context/CartContext";
import { Heart } from "lucide-react";

export default function Favorites() {
  const { favorites, removeFromFavorites } = useFavorites();
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleCardClick = (e, productId) => {
    // Don't navigate if clicking on buttons
    if (e.target.closest('button')) return;
    navigate(`/productdetails/${productId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-28 sm:py-28">
      <div className="container mx-auto px-2 sm:px-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-8">My Favorites</h1>

        {!favorites?.length ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-[60vh] bg-white rounded-lg shadow-sm p-4 sm:p-8"
          >
            <div className="text-center">
              <div className="relative h-32">
                <div className="absolute top-1/2 left-1/2  -translate-x-1/2 -translate-y-1/2 animate-bounce">
                  <Heart className="h-12 w-12 text-pink-400" fill="#f472b6" />
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">Your Favorites is Empty</h2>
              <p className="text-gray-600 mb-6">Looks like you haven&apos;t added any items to your favorites yet.</p>
              <Link 
                to="/" 
                className="inline-block bg-main text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium hover:bg-pink-700 transition-colors duration-300"
              >
                Start Shopping
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {favorites.map((product) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={(e) => handleCardClick(e, product._id)}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer"
              >
                <div className="relative">
                  <img
                    src={product.defaultImage?.url || "https://via.placeholder.com/150?text=No+Image"}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/150?text=No+Image";
                    }}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromFavorites(product._id);
                    }}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200"
                  >
                    <svg className="w-5 h-5 text-red-500 fill-current" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2 hover:text-main transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex justify-between items-center flex-col md:flex-row">
                    <span className="text-sm font-bold text-gray-900">
                      {product.price} EGP
                    </span>
                    <button
                      onClick={() => {
                        addToCart(product?._id, 1)
                    }}
                      className="text-main hover:text-pink-700 transition-colors duration-200 flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
} 