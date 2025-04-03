import axios from "axios";
import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode"; 
export let CartContext = createContext();

export default function CartContextProvider({ children }) {
    let token = localStorage.getItem("userToken");
    console.log("Token being used:", token); 
    let userData = token ? jwtDecode(token) : null;
    let isAdmin = userData?.role === "admin" || userData?.isAdmin === true;

    let headers = { token };

    const [cartItems, setCartItems] = useState(null);

    async function createCart() {
        if (!token || isAdmin) return false;

        try {
            const response = await axios.post(
                `https://tala-store.vercel.app/cart/create`,
                {},
                { headers }
            );
            console.log("Cart created successfully", response.data);
            return true;
        } catch (error) {
            console.error("Error creating cart:", error.response?.data?.message || error.message);
            return false;
        }
    }

    async function addToCart(productId, quantity) {
        if (isAdmin) return; // ✅ منع Admin من إضافة منتجات للسلة

        try {
            let { data } = await axios.post(
                `https://tala-store.vercel.app/cart`,
                { productId, quantity },
                { headers }
            );
            toast.success(data.message, { duration: 1000 });
            setCartItems(data.cart || data);
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    }

    async function updateProductCount(productId, quantity) {
        if (isAdmin) return; 

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
        if (isAdmin) return; 

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

    async function getCartItems() {
        if (!token || isAdmin) return null; 

        try {
            let { data } = await axios.get(
                `https://tala-store.vercel.app/cart`,
                { headers }
            );
            return data;
        } catch (error) {
            console.error("Error fetching cart:", error);
            return null;
        }
    }

    useEffect(() => {
        if (token && !isAdmin) {
            getCartItems();
        }
    }, [token, isAdmin]);

    return (
        <CartContext.Provider value={{
            addToCart, getCartItems, cartItems, setCartItems,
            updateProductCount, deleteProduct, createCart
        }}>
            {children}
        </CartContext.Provider>
    );
}
