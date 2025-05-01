/* eslint-disable react/prop-types */
import { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../Context/CartContext";
import { useFavorites } from "../Context/FavoritesContext";
import { UserContext } from "../Context/UserContext";
import { toast } from "react-hot-toast";

export default function RecentProducts({ product }) {
  const { addToCart } = useContext(CartContext);
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { userData } = useContext(UserContext);

  const handleFavoriteClick = (e) => {
    e.preventDefault();

    if (userData?.role === "admin") {
      toast.error("Admins cannot add products to favorites.");
      return;
    }

    if (!product) {
      toast.error("Product not found.");
      return;
    }

    if (isFavorite(product._id)) {
      removeFromFavorites(product._id);
      toast("Removed from favorites");
    } else {
      addToFavorites({
        _id: product._id,
        name: product.name,
        price: product.price || product.finalPrice,
        description: product.description,
        defaultImage: product.defaultImage || { url: product.images?.[0]?.url },
        category: product.category,
      });
      toast.success("Added to favorites ❤️");
    }
  };

  const hasDiscount = parseFloat(product?.discount) > 0;
  const isOutOfStock = product?.avaliableItems === 0;

  return (
    <div
      className={`bg-white shadow-md rounded-2xl p-4 sm:p-5 product my-6 hover:shadow-lg transition-all duration-300 relative ${
        isOutOfStock ? "opacity-70" : ""
      }`}
    >
      {/* ❤️ Favorite Button */}
      <button
        onClick={handleFavoriteClick}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white shadow hover:bg-gray-100 transition"
        title="Add to Favorites ❤️"
      >
        <svg
          className={`w-6 h-6 transition ${
            isFavorite(product?._id)
              ? "text-red-500 fill-current"
              : "text-gray-400"
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>

      <Link to={`/productdetails/${product?._id}`} className="block group">
        {/* 🖼️ Product Image */}
        <div className="flex justify-center mb-4 relative">
          <img
            src={product?.defaultImage?.url}
            alt={product?.name || "No Name"}
            className="object-contain h-48 sm:h-56 md:h-64 w-full rounded-xl transition-transform duration-300 group-hover:scale-105"
          />
          {isOutOfStock && (
            <div className="absolute inset-0 bg-white bg-opacity-80 rounded-xl flex items-center justify-center">
              <span className="text-red-600 font-bold text-lg">Out of Stock</span>
            </div>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-sm text-main font-medium uppercase tracking-wide">
            {product?.category?.name || "Unknown Category"}
          </p>

          <h2 className="font-bold text-gray-800 text-base sm:text-lg truncate">
            {product?.name || "No Product Name"}
          </h2>

          {/* 💸 Pricing */}
          <div className="flex items-center gap-2 flex-wrap">
            {hasDiscount ? (
              <>
                <span className="text-sm line-through text-gray-400">
                  {product?.price} EGP
                </span>
                <span className="text-red-600 font-bold text-base">
                  {product?.finalPrice} EGP
                </span>
                <span className="ml-auto bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs font-semibold">
                  -{product?.discount}%
                </span>
              </>
            ) : (
              <span className="text-black font-medium text-base">
                {product?.finalPrice
                  ? `${product.finalPrice} EGP`
                  : "No Price Available"}
              </span>
            )}
          </div>

          {/* ⭐ Rating */}
          <div className="flex items-center gap-1 text-sm text-gray-700">
            <span className="text-yellow-400">⭐</span>
            {product?.averageRating ? product.averageRating.toFixed(1) : "0"}
          </div>
        </div>
      </Link>

      {/* 🛒 Add to Cart */}
      <button
        onClick={() => !isOutOfStock && addToCart(product?._id, 1)}
        disabled={isOutOfStock}
        className={`w-full rounded-lg py-2 mt-4 font-semibold text-sm sm:text-base transition ${
          isOutOfStock
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : "bg-main text-white hover:bg-opacity-90"
        }`}
      >
        {isOutOfStock ? "OUT OF STOCK" : "ADD TO CART"}
      </button>
    </div>
  );
}
