/* eslint-disable react/prop-types */
import { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../Context/CartContext";

export default function RecentProducts({ products }) {
    let { addToCart } = useContext(CartContext);

    return (
        <div className="bg-white shadow-md rounded-lg p-4 product my-10 hover:shadow-lg transition-all">
            <Link to={`productdetails/${products.id}`} className="block">
                {/* Image Container */}
                <div className="flex justify-center mb-3">
                    <img
                        src={products.imageCover}
                        alt={products.title}
                        className="object-contain h-40 w-full rounded-lg"
                    />
                </div>

                {/* Category */}
                <h2 className="text-main text-sm font-semibold">{products.category.name}</h2>

                {/* Product Title */}
                <h2 className="font-medium text-black truncate">{products.title}</h2>

                {/* Price & Rating */}
                <div className="flex justify-between my-2">
                    <h3 className="text-black font-bold">{products.price} EGP</h3>
                    <h3 className="text-black flex items-center">
                        <i className="fas fa-star text-yellow-400 mr-1"></i>
                        {products.ratingsAverage}
                    </h3>
                </div>
            </Link>

            {/* Add to Cart Button */}
            <button
                onClick={() => addToCart(products.id)}
                className="w-full bg-main text-white rounded-md py-2 mt-2 transition hover:bg-opacity-90"
            >
                ADD TO CART
            </button>
        </div>
    );
}
