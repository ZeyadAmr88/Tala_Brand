import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function ProductDetails() {
    let { id } = useParams();
    const [details, setDetails] = useState([]);
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

    // Fetch the details of the selected product
    async function getProductDetails(id) {
        try {
            let { data } = await axios.get(
                `https://ecommerce.routemisr.com/api/v1/products/${id}`
            );
            setDetails(data.data);
            getRelatedProducts(data.data.category._id); // Fetch related products using category ID
        } catch (error) {
            console.error("Error fetching product details:", error);
        }
    }

    // Fetch related products based on category
    async function getRelatedProducts(categoryId) {
        try {
            let { data } = await axios.get(
                `https://ecommerce.routemisr.com/api/v1/products?category=${categoryId}`
            );
            setRelatedProducts(data.data);
        } catch (error) {
            console.error("Error fetching related products:", error);
        }
    }

    useEffect(() => {
        getProductDetails(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    return (
        <>
            <h1 className="text-5xl">Product Details...</h1>
            <div className="flex items-center p-10 container">
                <div className="w-1/4 py-4 pr-4 rounded-md">
                    {details.images && details.images.length > 1 ? (
                        <Slider {...settings}>
                            {details?.images?.map((src, index) => (
                                <img src={src} className="w-full" alt="carousel" key={index} />
                            ))}
                        </Slider>
                    ) : (
                        <img src={details.imageCover} className="w-full" alt="carousel" />
                    )}
                </div>
                <div className="w-3/4">
                    <div>
                        <h1 className="text-black">{details.title}</h1>
                        <p className="text-gray-500 my-6">{details.description}</p>
                        <h3>{details.category?.name}</h3>
                        <div className="flex justify-between my-2">
                            <h3 className="text-black">{details.price} EGP</h3>
                            <h3 className="text-black">
                                <i className="fas fa-star rating-color"></i>{" "}
                                {details.ratingsAverage}
                            </h3>
                        </div>
                    </div>
                    <button className="btn w-full bg-main text-white rounded-md py-1">
                        ADD TO CART
                    </button>
                </div>
            </div>

            <h2 className="text-3xl mx-5 mt-10">Related Products</h2>
            <div className="grid grid-cols-7 gap-4 mt-6 mx-9">
                {relatedProducts.map((product) => (
                    <Link to={`/productdetails/${product._id}`} key={product._id}>
                        <div className="p-4 product">
                            <img
                                src={product.imageCover}
                                alt={product.title}
                                className="w-full"
                            />
                            <h2 className="font-medium text-black">
                                {product.title.split(" ").slice(0, 2).join(" ")}
                            </h2>
                            <p className="text-black">{product.price} EGP</p>
                        </div>
                    </Link>
                ))}
            </div>
        </>
    );
}
