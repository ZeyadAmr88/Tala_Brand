import axios from "axios";
import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export let CartContext = createContext();

// eslint-disable-next-line react/prop-types
export default function CartContextProvider({ children }) {
    let headers = {
        token: localStorage.getItem('userToken')

    }

    const [cartItems, setCartItems] = useState(null)

    async function addToCart(productId) {
        try {
            let { data } = await axios.post(`https://ecommerce.routemisr.com/api/v1/cart`, { productId }, {
                headers
            })
            toast.success(data.message,
                {
                    duration: 1000
                })
            setCartItems(data)



        } catch (error) {
            console.log(error)
        }
    }
    
    // async function addToWishList(productId) {
    //     try {
    //         let { data } = await axios.post(`https://ecommerce.routemisr.com/api/v1/wishlist`, { productId }, {
    //             headers
    //         })
    //         toast.success(data.message,
    //             {
    //                 duration: 1000
    //             })
    //         setCartItems(data)



    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    async function checkOutSession(shippingAddress) {
        try {
            let { data } = await axios.post(`https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartItems.data._id}?url=http://localhost:5173`, { shippingAddress }, {

                headers
            })

            return data



        } catch (error) {
            console.log(error)
        }
    }


    async function updateProductCount(productId, count) {
        try {
            let { data } = await axios.put(`https://ecommerce.routemisr.com/api/v1/cart/${productId}`, { count }, {
                headers
            })
            return data;





        } catch (error) {
            console.log(error)
        }
    }

    async function deleteProduct(productId) {
        try {
            let { data } = await axios.delete(`https://ecommerce.routemisr.com/api/v1/cart/${productId}`, {
                headers
            })
            setCartItems(data)
            return data;

        } catch (error) {
            console.log(error)
        }
    }

    async function getCartItems() {
        try {
            let { data } = await axios.get(`https://ecommerce.routemisr.com/api/v1/cart`, {
                headers
            })

            setCartItems(data)

            return data

        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getCartItems()
    }, [])
    return (
        <CartContext.Provider value={{
            addToCart, getCartItems, cartItems, setCartItems, updateProductCount, deleteProduct, checkOutSession 
        }}>
            {children}
        </CartContext.Provider>
    )
}
