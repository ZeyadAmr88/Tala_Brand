import axios from "axios";
import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export let CartContext = createContext();

// eslint-disable-next-line react/prop-types
export default function CartContextProvider({ children }) {
    let headers = {
        token: localStorage.getItem('userToken')
    };

    const [cartItems, setCartItems] = useState(null);

    async function createCart(token) {
        if (!token) {
            console.error("Cannot create cart: Token is missing")
            return false
        }

        try {
            const response = await axios.post(
                `https://tala-store.vercel.app/cart/create`,
                {}, 
                {
                    headers: {
                        token: token, 
                    },
                }
            );
            console.log("Cart created successfully", response.data);
            return true;
        } catch (error) {
            console.error("Error creating cart:", error.response?.data?.message || error.message);
            return false;
        }
    }

    // eslint-disable-next-line no-unused-vars
    async function addToCart(productId, quantity) {
        try {
            let { data } = await axios.post(
                `https://tala-store.vercel.app/cart`,
                { "productId": productId, "quantity": 1 },
                { headers }
            );

            toast.success(data.message, { duration: 1000 });
            setCartItems(data.cart || data);
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    }

    async function updateProductCount(productId, quantity) {
        try {
            let { data } = await axios.patch(
                `https://tala-store.vercel.app/cart`,
                { productId, quantity },
                { headers }
            );

            setCartItems(data.cart || data);
            return data;
        } catch (error) {
            console.error("Error updating product count:", error);
        }
    }
    async function deleteProduct(productId) {
        try {
            let { data } = await axios.patch(
                `https://tala-store.vercel.app/cart/${productId}`,
                {},
                { headers }
            );

            return data;
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    }

    async function getCartItems(token) {
        console.log("token",headers.token)
        let { data } = await axios.get(
            `https://tala-store.vercel.app/cart`,
            
             // Empty body, unless you need to send data
            {
                headers: {
                    token: headers.token, // Corrected token usage
                },
            }
        );
        // setCartItems(data?.cart?.products);
        return data;

    }


    useEffect(() => {
        if (headers.token) {
            
            getCartItems(headers.token);
        }
    }, [headers.token]);

    return (
        <CartContext.Provider value={{
            addToCart, getCartItems, cartItems, setCartItems, updateProductCount, deleteProduct, createCart
        }}>
            {children}
        </CartContext.Provider>
    );
}
