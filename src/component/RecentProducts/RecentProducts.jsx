/* eslint-disable react/prop-types */
import { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../Context/CartContext";

export default function RecentProducts({ product }) {
    let { addToCart } = useContext(CartContext);

    return (
        <div className="bg-white shadow-md rounded-lg p-4 product my-10 hover:shadow-lg transition-all">
            <Link to={`/productdetails/${product?._id }`} className="block">
                <div className="flex justify-center mb-3">
                    <img
                        src={product?.images?.[0]?.url || product?.defaultImage?.url}
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
                        {product?.ratingsAverage || "No Rating"}
                    </h3>
                </div>
            </Link>
            <button
                onClick={() => {
                    addToCart(product?._id)
        
                }}
                className="w-full bg-main text-white rounded-md py-2 mt-2 transition hover:bg-opacity-90"

            >
                ADD TO CART
            </button>

        </div>
    );
}
