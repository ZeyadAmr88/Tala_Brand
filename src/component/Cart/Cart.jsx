import { useContext } from "react";
import { CartContext } from "../Context/CartContext";
import Loader from "../Loader/Loader";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function Cart() {
  const { cartItems, updateProductCount, deleteProduct } = useContext(CartContext);

  // Update Product Quantity in Cart
  async function handleUpdateQuantity(productId, quantity) {
    if (quantity >= 1) {
      await updateProductCount(productId, quantity);
    } else {
      await handleDeleteProduct(productId);
    }
    toast.success("Product Updated Successfully", { duration: 1000 });
  }

  // Delete Product from Cart
  async function handleDeleteProduct(productId) {
    try {
      if (!productId) {
        toast.error("Invalid product ID");
        return;
      }
      await deleteProduct(productId);
      // The cart state will be updated automatically by the context
      toast.success("Product deleted successfully 🗑️", { duration: 1000 });
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error(error.response?.data?.message || "Failed to delete product");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

        {cartItems === null ? (
          <div className="flex justify-center items-center h-[60vh]">
            <Loader />
          </div>
        ) : cartItems?.products?.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-[60vh] bg-white rounded-lg shadow-sm p-8"
          >
            <div className="text-center">
              <div className="text-6xl mb-4">🛒</div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Your Cart is Empty</h2>
              <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
              <Link 
                to="/" 
                className="inline-block bg-main text-white px-6 py-3 rounded-lg font-medium hover:bg-pink-700 transition-colors duration-300"
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
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {cartItems?.products?.map((productItem) => {
                    const product = productItem?.productId || productItem;
                    return (
                      <motion.tr 
                        key={product?._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-16 w-16">
                              <img
                                src={product?.defaultImage?.url}
                                alt={product?.name}
                                className="h-full w-full object-cover rounded-md"
                                onError={(e) => {
                                  e.target.src = "https://via.placeholder.com/150?text=No+Image";
                                }}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {product?.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {product?.finalPrice} EGP
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleUpdateQuantity(product?._id, productItem.quantity - 1)}
                              className="p-1 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors duration-200"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                              </svg>
                            </button>
                            <span className="text-sm font-medium w-8 text-center">{productItem?.quantity}</span>
                            <button
                              onClick={() => handleUpdateQuantity(product?._id, productItem.quantity + 1)}
                              className="p-1 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors duration-200"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product?.finalPrice * productItem?.quantity} EGP
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDeleteProduct(product?._id)}
                            className="text-red-600 hover:text-red-800 transition-colors duration-200"
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

            <div className="border-t border-gray-200 px-6 py-4">
              <div className="flex justify-between items-center">
                <div className="text-lg font-medium text-gray-900">
                  Total: {cartItems?.totalCartPrice || 0} EGP
                </div>
                <div className="flex space-x-4">
                  <Link
                    to="/"
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    Continue Shopping
                  </Link>
                  <Link
                    to="/checkout"
                    className="px-6 py-2 bg-main text-white rounded-md hover:bg-pink-700 transition-colors duration-200"
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
