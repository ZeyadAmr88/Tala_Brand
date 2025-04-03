import { useContext, useEffect, useState } from "react";
import { CartContext } from "../Context/CartContext";
import Loader from "../Loader/Loader";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Cart() {
  const { getCartItems, updateProductCount, deleteProduct } = useContext(CartContext);
  const [cart, setCart] = useState(null);
  const token = localStorage.getItem("userToken");

  // Fetch Cart Items
  async function fetchCart() {
    if (!token) {
      console.error("Token is missing");
      return;
    }

    try {
      const data = await getCartItems(token);
      console.log("Fetched Cart Data:", data);

      if (data?.cart) {
        setCart(prevCart => ({ ...prevCart, ...data.cart }));
      } else {
        setCart({});
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Failed to load cart");
    }
  }

  // Update Product Quantity in Cart
  async function handleUpdateQuantity(productId, quantity) {
    if (quantity >= 1) {
      await updateProductCount(productId, quantity);
    } else {
      await handleDeleteProduct(productId);
    }
    await fetchCart();
    toast.success("Product Updated Successfully", { duration: 1000 });
  }

  // Delete Product from Cart
  async function handleDeleteProduct(productId) {
    try {
      await deleteProduct(productId);
      toast.success("Product deleted successfully 🗑️", { duration: 1000 });
      await fetchCart();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  }

  useEffect(() => {
    fetchCart();
  }, [token]);

  return (
    <>
      {/* Show Loader if Cart is Null */}
      {cart === null ? (
        <div className="flex justify-center text-center mt-20 h-screen">
          <Loader />
        </div>
      ) : cart?.products?.length === 0 ? (
        // Show Empty Cart Message
        <div className="items-center flex justify-center h-screen">
          <div className="text-center text-gray-600">
            <h2 className="text-xl font-semibold">Your Cart is Empty 🛒</h2>
            <p className="text-sm">Browse our products and add items to your cart!</p>
            <Link to="/" className="text-blue-500 hover:underline hover:text-pink-600">
              Go Shopping
            </Link>
          </div>
        </div>
      ) : (
        // Show Cart Items
        <div className="relative overflow-x-auto w-3/4 mx-auto h-screen mt-20">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-16 py-3"><span className="sr-only">Image</span></th>
                <th scope="col" className="px-6 py-3">Product</th>
                <th scope="col" className="px-6 py-3">Qty</th>
                <th scope="col" className="px-6 py-3">Price</th>
                <th scope="col" className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.products?.map((productItem) => (
                <tr key={productItem.productId?._id} className="bg-white border-b hover:bg-gray-100 text-black">
                  <td className="p-4">
                    <img
                      src={productItem?.productId?.defaultImage?.url}
                      className="w-16 md:w-32 max-w-full max-h-full"
                      alt={productItem?.productId?.name}
                    />
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    {productItem?.productId?.name}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {/* Decrease Quantity */}
                      <button
                        onClick={() => handleUpdateQuantity(productItem?.productId?._id, productItem.quantity - 1)}
                        className="inline-flex items-center justify-center p-1 h-6 w-6 text-main border border-gray-300 rounded-full hover:bg-gray-100"
                      >
                        <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                          <path stroke="currentColor" strokeLinecap="round" strokeWidth={2} d="M1 1h16" />
                        </svg>
                      </button>

                      <span className="mx-3">{productItem?.quantity}</span>

                      {/* Increase Quantity */}
                      <button
                        onClick={() => handleUpdateQuantity(productItem?.productId?._id, productItem.quantity + 1)}
                        className="inline-flex items-center justify-center p-1 h-6 w-6 text-main border border-gray-300 rounded-full hover:bg-gray-100"
                      >
                        <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                          <path stroke="currentColor" strokeLinecap="round" strokeWidth={2} d="M9 1v16M1 9h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    {productItem?.productId?.finalPrice} EGP
                  </td>
                  <td>
                    <button
                      onClick={() => handleDeleteProduct(productItem?.productId?._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Total Cart Price */}
          <div className="flex justify-between px-8 py-2 my-5">
            <span>Total Cart Price</span>
            <span>{cart.totalCartPrice || 0} EGP</span>
          </div>

          {/* Checkout Button */}
          <button className="btn w-fit bg-main flex mx-auto text-center p-2 text-white rounded-md py-1">
            <Link to={'/checkout'}>Check Out</Link>
          </button>
        </div>
      )}
    </>
  );
}
