import axios from "axios";
import { createContext, useEffect, useState, useContext } from "react";
import toast from "react-hot-toast";
import { UserContext } from "./UserContext"; // استيراد سياق المستخدم

export let CartContext = createContext();

// Custom hook to use cart context
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartContextProvider');
  }
  return context;
}

// eslint-disable-next-line react/prop-types
export default function CartContextProvider({ children }) {
    const { userData, isAdmin } = useContext(UserContext); // استخدام بيانات المستخدم وصلاحيات الأدمن
    const token = userData?.token;
    const headers = token ? { token } : {};

    const [cartItems, setCartItems] = useState(null);

    async function createCart() {
        if (!token || isAdmin) {
            if (isAdmin) {
                console.warn("Admin users don't have a cart.");
            }
            return false;
        }

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
        if (isAdmin) {
            toast.error("Admins are not allowed to add items to cart");
            return;
        }

        try {
            const { data } = await axios.post(
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
    const refreshCart = async () => {
        try {
            const { data } = await axios.get(`https://tala-store.vercel.app/cart`, {
                headers,
            });
            setCartItems(data.cart || data);
        } catch (error) {
            console.error("Error refreshing cart:", error);
        }
    };


    async function updateProductCount(productId, quantity) {
        if (isAdmin) return;

        try {
            const { data } = await axios.patch(
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
            const { data } = await axios.patch(
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
        console.log("Fetching cart with token:", token);
        try {
            const { data } = await axios.get(
                `https://tala-store.vercel.app/cart`,
                { headers }
                
            );
            console.log("Response =>", data.data);
            return data;
            
        } catch (error) {
            console.error("Error fetching cart:", error);
            return null;
        }
    }

    async function clearCart() {
        if (isAdmin) return;
        try {
            await axios.delete(`https://tala-store.vercel.app/cart`, {
                headers,
            });
            setCartItems(null);
            toast.success("Cart cleared successfully");
        } catch (error) {
            console.error("Error clearing cart:", error);
            toast.error("Failed to clear cart");
        }
    }

    useEffect(() => {
        if (token && !isAdmin) {
            getCartItems().then((data) => {
                if (data) {
                    setCartItems(data.cart || data);
                }
            });
        }
    }, [token, isAdmin]);

    return (
        <CartContext.Provider value={{
            addToCart,
            getCartItems,
            cartItems,
            setCartItems,
            updateProductCount,
            deleteProduct,
            createCart,
            refreshCart,
            clearCart
        }}>
            {children}
        </CartContext.Provider>
    );
}
