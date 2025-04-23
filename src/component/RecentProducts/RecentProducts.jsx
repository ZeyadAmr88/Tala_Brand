/* eslint-disable react/prop-types */
import { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../Context/CartContext";
import { useFavorites } from "../Context/FavoritesContext";

export default function RecentProducts({ product }) {
    let { addToCart } = useContext(CartContext);
    const { favorites, addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

    const handleFavoriteClick = (e) => {
        e.preventDefault(); // Prevent triggering Link navigation
        if (!product) return;

        if (isFavorite(product._id)) {
            removeFromFavorites(product._id);
            console.log('Removed from favorites:', product.name);
        } else {
            addToFavorites({
                _id: product._id,
                name: product.name,
                price: product.price || product.finalPrice,
                description: product.description,
                defaultImage: product.defaultImage || { url: product.images?.[0]?.url },
                category: product.category
            });
            console.log('Added to favorites:', product.name);
        }
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-4 product my-10 hover:shadow-lg transition-all relative">
            <button
                onClick={handleFavoriteClick}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
            >
                <svg
                    className={`w-6 h-6 ${isFavorite(product?._id) ? "text-red-500 fill-current" : "text-gray-400"
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

            <Link to={`/productdetails/${product?._id}`} className="block">
                <div className="flex justify-center mb-3">
                    <img
                        src={product?.defaultImage?.url}
                        alt={product?.name || "No Name"}
                        className="object-contain h-[15rem] w-full rounded-lg"
                    />
                </div>

                <h2 className="text-main text-sm font-semibold">{product?.category?.name || "Unknown Category"}</h2>

                <h2 className="font-medium text-black truncate">{product?.name || "No Product Name"}</h2>

                <div className="flex justify-between my-2">
                    <h3 className="text-black font-bold">{product?.finalPrice ? `${product.finalPrice} EGP` : "No Price Available"}</h3>
                    <h3 className="text-black flex items-center">
                        <i className="fas fa-star text-yellow-400 mr-1"></i>
                        {product?.averageRating ? product.averageRating.toFixed(1) : "0"}
                    </h3>
                </div>
            </Link>
            <button
                onClick={() => {
                    addToCart(product?._id, 1)
                }}
                className="w-full bg-main text-white rounded-md py-2 mt-2 transition hover:bg-opacity-90"
            >
                ADD TO CART
            </button>
        </div>
    );
}
