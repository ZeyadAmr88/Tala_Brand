/* eslint-disable react/prop-types */

import { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../Context/CartContext";


export default function RecentProducts({ products }) {
    let { addToCart } = useContext(CartContext)

    return (

        <>
            <div className="w-1/6 product px-2 py-4">
                <div >
                    <Link to={`productdetails/${products.id}`}>
                        <img src={products.imageCover} alt={products.title} />
                        <h2 className="text-main text-sm">{products.category.name}</h2>
                        <h2 className="font-medium text-black">{products.title.split(' ').slice(0, 2).join(' ')}</h2>
                        <div className="flex justify-between my-2">
                            <h3 className="text-black">{products.price} EGP</h3>
                            <h3 className="text-black"><i className="fas fa-star rating-color "></i> {products.ratingsAverage}</h3>
                        </div>
                    </Link>
                    <button onClick={() => {
                        addToCart(products.id)
                    }} className="btn w-full bg-main text-white rounded-md py-1 ">ADD TO CART</button>
                </div>

            </div>
        </>
    )
}
