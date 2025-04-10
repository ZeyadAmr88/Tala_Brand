import axios from "axios";
import { Fragment, useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { CartContext } from "../Context/CartContext";
import { useFavorites } from "../Context/FavoritesContext";
import Loader from "../Loader/Loader";

export default function ProductDetails() {
    let { addToCart } = useContext(CartContext);
    const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
    let { id } = useParams();
    const [details, setDetails] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handleFavoriteClick = () => {
        if (details) {
            if (isFavorite(details._id)) {
                removeFromFavorites(details._id);
            } else {
                addToFavorites(details);
            }
        }
    };

    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        afterChange: (current) => setCurrentImageIndex(current),
        customPaging: (i) => (
            <div className="w-2 h-2 rounded-full bg-gray-300 mt-4"></div>
        ),
    };

    async function getProductDetails(id) {
        try {
            let { data } = await axios.get(
                `https://tala-store.vercel.app/product/${id}`
            );
            if (data.success && data.product) {
                setDetails(data.product);
                getRelatedProducts(data.product.category.id);
            } else {
                console.error("Unexpected response structure:", data);
            }
        } catch (error) {
            console.error("Error fetching product details:", error);
        }
    }

    async function getRelatedProducts(categoryId) {
        try {
            let { data } = await axios.get(
                `https://tala-store.vercel.app/product?category=${categoryId}`
            );
            if (data.success && Array.isArray(data.products)) {
                setRelatedProducts(data.products);
            } else {
                console.error("Unexpected response structure:", data);
            }
        } catch (error) {
            console.error("Error fetching related products:", error);
        }
    }

    useEffect(() => {
        getProductDetails(id);
    }, [id]);

    return (
        <div className="min-h-screen bg-gray-50">
            {details === null ? (
                <div className="flex justify-center items-center h-screen">
                    <Loader />
                </div>
            ) : (
                <Fragment>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-32">
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <div className="flex flex-col md:flex-row">
                                {/* Product Images */}
                                <div className="w-full md:w-1/2 p-6">
                                    <div className="relative">
                                        {details.images && details.images.length > 1 ? (
                                            <Slider {...settings}>
                                                {details.images.map((image, index) => (
                                                    <div key={index} className="relative aspect-square">
                                                        <img 
                                                            src={image.url} 
                                                            alt={`Product view ${index + 1}`}
                                                            className="w-full h-full object-contain"
                                                        />
                                                    </div>
                                                ))}
                                            </Slider>
                                        ) : (
                                            <img 
                                                src={details.defaultImage?.url || details.imageCover} 
                                                alt={details.name}
                                                className="w-full h-full object-contain"
                                            />
                                        )}
                                    </div>
                                    {/* Thumbnails */}
                                    {details.images && details.images.length > 1 && (
                                        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                                            {details.images.map((image, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setCurrentImageIndex(index)}
                                                    className={`w-16 h-16 flex-shrink-0 border-2 rounded-md overflow-hidden ${
                                                        currentImageIndex === index ? 'border-main' : 'border-transparent'
                                                    }`}
                                                >
                                                    <img 
                                                        src={image.url} 
                                                        alt={`Thumbnail ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Product Info */}
                                <div className="w-full md:w-1/2 p-6">
                                    <div className="space-y-6">
                                        <div>
                                            <h1 className="text-3xl font-bold text-gray-900">{details.name}</h1>
                                            <div className="flex items-center mt-2">
                                                <div className="flex items-center">
                                                    {[...Array(5)].map((_, i) => (
                                                        <svg
                                                            key={i}
                                                            className={`w-5 h-5 ${
                                                                i < Math.floor(details.ratingsAverage || 0)
                                                                    ? 'text-yellow-400'
                                                                    : 'text-gray-300'
                                                            }`}
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    ))}
                                                </div>
                                                <span className="ml-2 text-gray-600">
                                                    {details.ratingsAverage || "No ratings yet"}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-3xl font-bold text-main">
                                                {details.finalPrice} EGP
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                Category: {details.category?.name}
                                            </span>
                                        </div>

                                        <p className="text-gray-600 leading-relaxed">
                                            {details.description}
                                        </p>

                                        <div className="flex gap-4">
                                            <button
                                                onClick={() => addToCart(details?._id, 1)}
                                                className="flex-1 bg-main text-white py-3 px-6 rounded-lg font-medium transition-all duration-300 hover:bg-pink-700 hover:shadow-lg transform hover:-translate-y-1"
                                            >
                                                Add to Cart
                                            </button>
                                            <button
                                                onClick={handleFavoriteClick}
                                                className="p-3 rounded-lg border-2 border-main transition-all duration-300 hover:bg-main hover:text-white transform hover:-translate-y-1"
                                            >
                                                <svg
                                                    className={`w-6 h-6 ${
                                                        isFavorite(details._id) ? "text-red-500 fill-current" : "text-main"
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
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Related Products */}
                        <div className="mt-16">
                            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                {relatedProducts.map((product) => (
                                    <Link 
                                        to={`/productdetails/${product.id}`} 
                                        key={product.id}
                                        className="group"
                                    >
                                        <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1">
                                            <div className="aspect-square relative">
                                                <img
                                                    src={product.defaultImage?.url || product.imageCover}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">
                                                    {product.name}
                                                </h3>
                                                <p className="text-main font-semibold">
                                                    {product.finalPrice} EGP
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </Fragment>
            )}
        </div>
    );
}
