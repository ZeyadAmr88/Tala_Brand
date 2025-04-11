import { useContext, useState } from "react";
import { CartContext } from "../Context/CartContext";
import Loader from "../Loader/Loader";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function Cart() {
  const { cartItems, updateProductCount, deleteProduct, refreshCart } = useContext(CartContext);
  const [isUpdating, setIsUpdating] = useState(false);

  // Update Product Quantity in Cart
  async function handleUpdateQuantity(productId, quantity) {
    if (isUpdating) return; // Prevent multiple updates at once
    
    try {
      setIsUpdating(true);
      
      if (!productId) {
        toast.error("Invalid product ID");
        return;
      }

      // Find the current product data before updating
      const currentItem = cartItems?.products?.find(item => {
        const product = item?.productId || item;
        return product?._id === productId;
      });

      if (!currentItem) {
        toast.error("Product not found in cart");
        return;
      }

      if (quantity >= 1) {
        await updateProductCount(productId, quantity);
      } else {
        await handleDeleteProduct(productId);
        return;
      }

      // Wait for the cart to be refreshed
      await refreshCart();
      toast.success("Product Updated Successfully", { duration: 1000 });
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error(error.response?.data?.message || "Failed to update quantity");
    } finally {
      setIsUpdating(false);
    }
  }

  // Delete Product from Cart
  async function handleDeleteProduct(productId) {
    if (isUpdating) return; // Prevent multiple updates at once
    
    try {
      setIsUpdating(true);
      
      if (!productId) {
        toast.error("Invalid product ID");
        return;
      }
      await deleteProduct(productId);
      await refreshCart();
      toast.success("Product deleted successfully 🗑️", { duration: 1000 });
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error(error.response?.data?.message || "Failed to delete product");
    } finally {
      setIsUpdating(false);
    }
  }

  // Calculate total price with null checks
  const totalPrice = cartItems?.products?.reduce((total, item) => {
    const product = item?.productId || item;
    return total + (product?.price || 0) * (item?.quantity || 0);
  }, 0) || 0;

  const shippingCost = 50; // Example shipping cost
  const grandTotal = totalPrice + shippingCost;

  return (
    <div className="min-h-screen bg-gray-50 py-28 sm:py-28">
      <div className="container mx-auto px-2 sm:px-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-8">Shopping Cart</h1>

        {cartItems === null ? (
          <div className="flex justify-center items-center h-[60vh]">
            <Loader />
          </div>
        ) : !cartItems?.products?.length ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-[60vh] bg-white rounded-lg shadow-sm p-4 sm:p-8"
          >
            <div className="text-center">
              <div className="text-5xl sm:text-6xl mb-4">🛒</div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">Your Cart is Empty</h2>
              <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
              <Link 
                to="/" 
                className="inline-block bg-main text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium hover:bg-pink-700 transition-colors duration-300"
              >
                Start Shopping
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-lg shadow-sm overflow-hidden"
          >
            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {cartItems?.products?.map((item) => {
                    const product = item?.productId || item;
                    return (
                      <motion.tr 
                        key={product?._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="px-4 sm:px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12 sm:h-16 sm:w-16">
                              <img
                                src={product?.defaultImage?.url || "https://via.placeholder.com/150?text=No+Image"}
                                alt={product?.name || "Product"}
                                className="h-full w-full object-cover rounded-md"
                                onError={(e) => {
                                  e.target.src = "https://via.placeholder.com/150?text=No+Image";
                                }}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {product?.name || "Unnamed Product"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {product?.price || 0} EGP
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleUpdateQuantity(product?._id, (item?.quantity || 0) - 1)}
                              className="p-1 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors duration-200"
                              disabled={isUpdating}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                              </svg>
                            </button>
                            <span className="text-sm font-medium w-8 text-center">{item?.quantity || 0}</span>
                            <button
                              onClick={() => handleUpdateQuantity(product?._id, (item?.quantity || 0) + 1)}
                              className="p-1 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors duration-200"
                              disabled={isUpdating}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            </button>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {(product?.price || 0) * (item?.quantity || 0)} EGP
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <button
                            onClick={() => handleDeleteProduct(product?._id)}
                            className="text-red-600 hover:text-red-800 transition-colors duration-200"
                            disabled={isUpdating}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="sm:hidden">
              {cartItems?.products?.map((item) => {
                const product = item?.productId || item;
                return (
                  <motion.div
                    key={product?._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-b border-gray-200 p-4"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 h-20 w-20">
                        <img
                          src={product?.defaultImage?.url || "https://via.placeholder.com/150?text=No+Image"}
                          alt={product?.name || "Product"}
                          className="h-full w-full object-cover rounded-md"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/150?text=No+Image";
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {product?.name || "Unnamed Product"}
                        </div>
                        <div className="mt-1 text-sm text-gray-500">
                          Price: {product?.price || 0} EGP
                        </div>
                        <div className="mt-2 flex items-center space-x-2">
                          <button
                            onClick={() => handleUpdateQuantity(product?._id, (item?.quantity || 0) - 1)}
                            className="p-1 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors duration-200"
                            disabled={isUpdating}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="text-sm font-medium w-8 text-center">{item?.quantity || 0}</span>
                          <button
                            onClick={() => handleUpdateQuantity(product?._id, (item?.quantity || 0) + 1)}
                            className="p-1 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors duration-200"
                            disabled={isUpdating}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>
                        <div className="mt-2 flex justify-between items-center">
                          <div className="text-sm font-medium text-gray-900">
                            Total: {(product?.price || 0) * (item?.quantity || 0)} EGP
                          </div>
                          <button
                            onClick={() => handleDeleteProduct(product?._id)}
                            className="text-red-600 hover:text-red-800 transition-colors duration-200"
                            disabled={isUpdating}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="border-t border-gray-200 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div className="space-y-2">
                  <div className="text-base sm:text-lg font-medium text-gray-900">
                    Subtotal: {totalPrice} EGP
                  </div>
                  <div className="text-base sm:text-lg font-medium text-gray-900">
                    Shipping: {shippingCost} EGP
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-gray-900">
                    Total: {grandTotal} EGP
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                  <Link
                    to="/"
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200 text-center"
                  >
                    Continue Shopping
                  </Link>
                  <Link
                    to="/checkout"
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-main text-white rounded-md hover:bg-pink-700 transition-colors duration-200 text-center"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
