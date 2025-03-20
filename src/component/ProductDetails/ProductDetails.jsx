import axios from "axios";
import { Fragment, useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { CartContext } from "../Context/CartContext";
import Loader from "../Loader/Loader";

export default function ProductDetails() {

    let { addToCart } = useContext(CartContext);

    let { id } = useParams();
    const [details, setDetails] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);

    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplayspeed: 1000
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

        <>
            {details === null ? (
                <div className="flex justify-center text-center mt-20 h-screen">
                    <Loader />
                </div>
            ) : (
                <Fragment className="h-screen">
                    <h1 className="text-3xl mt-24 text-center font-mono">Product Details...</h1>
                    <div className="flex items-center p-10 container">
                        <div className="w-1/4 py-4 pr-4 rounded-md">
                            {details.images && details.images.length > 1 ? (
                                <Slider {...settings}>
                                    {details.images.map((image, index) => (
                                        <img src={image.url} className="w-full" alt="carousel" key={index} />
                                    ))}
                                </Slider>
                            ) : (
                                <img src={details.defaultImage?.url || details.imageCover} className="w-full " alt="carousel" />
                            )}
                        </div>
                        <div className="w-3/4">
                            <div>
                                <h1 className="text-black">{details.name}</h1>
                                <p className="text-gray-500 my-6">{details.description}</p>
                                <h3>{details.category?.name}</h3>
                                <div className="flex justify-between my-2">
                                    <h3 className="text-black">{details.finalPrice} EGP</h3>
                                    <h3 className="text-black">
                                        <i className="fas fa-star rating-color"></i>{" "}
                                        {details.ratingsAverage || "N/A"}
                                    </h3>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    addToCart(details?._id)
                                }}
                                className="w-full bg-main  text-white rounded-md py-2 mt-2 transition hover:bg-pink-700 ">
                                ADD TO CART
                            </button>
                        </div>
                    </div>

                    <h2 className="text-3xl mx-5 mt-10">Related Products</h2>
                    <div className="grid grid-cols-7 gap-4 mt-6 mx-9">
                        {relatedProducts.map((product) => (
                            <Link to={`/productdetails/${product.id}`} key={product.id}>
                                <div className="p-4 product">
                                    <img
                                        src={product.defaultImage?.url || product.imageCover}
                                        alt={product.name}
                                        className="w-full"
                                    />
                                    <h2 className="font-medium text-black">
                                        {product.name.split(" ").slice(0, 2).join(" ")}
                                    </h2>
                                    <p className="text-black">{product.finalPrice} EGP</p>
                                </div>
                            </Link>
                        ))}
                    </div>

                </Fragment>
            )
            }
        </>
    );
}
