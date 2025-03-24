import { useContext, useEffect, useState } from "react";
import { CartContext } from "../Context/CartContext";
import Loader from "../Loader/Loader";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Cart() {
  let { getCartItems, updateProductCount, deleteProduct } = useContext(CartContext);
  let headers = {
    token: localStorage.getItem('userToken'),
  };

  const [cart, setCart] = useState(null);

  async function getCart(token) {
    if (!token) {
      console.error("Cannot fetch cart: Token is missing");
      return;
    }

    try {
      let data = await getCartItems(token);
      console.log("Cart Data:", data);
      setCart(data?.cart || {});
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  }

  async function updateCart(productId, quantity) {
    if (quantity >= 1) {
      await updateProductCount(productId, quantity);
      await getCart(headers.token);
    } else {
      await deleteCartProduct(productId);
    }
    toast.success("Product Updated Successfully", { duration: 1000 });
  }

  async function deleteCartProduct(productId) {
    try {
      let data = await deleteProduct(productId);
      if (data) {
        toast.success("Product deleted successfully 🗑️", { duration: 1000 });
        await getCart(headers.token);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  }

  useEffect(() => {
    async function fetchCart() {
      await getCart(headers.token);
    }
    fetchCart();
  }, [headers.token]);

  return (
    <>
      {cart === null ? (
        <div className="flex justify-center text-center mt-20 h-screen">
          <Loader />
        </div>
      ) : cart?.products?.length === 0 ? (
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
        <div className="relative overflow-x-auto w-3/4 mx-auto h-screen mt-20">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:text-gray-900">
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
                      <button
                        onClick={() => updateCart(productItem?.productId?._id, productItem.quantity - 1)}
                        className="inline-flex items-center justify-center p-1 text-sm font-medium h-6 w-6 text-main border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 bg-white"
                      >
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1 1h16" />
                        </svg>
                      </button>

                      <span className="mx-3">{productItem?.quantity}</span>

                      <button
                        onClick={() => updateCart(productItem?.productId?._id, productItem.quantity + 1)}
                        className="inline-flex items-center justify-center p-1 text-sm font-medium h-6 w-6 text-main border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 bg-white"
                      >
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 1v16M1 9h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    {productItem?.productId?.finalPrice} EGP
                  </td>
                  <td>
                    <button
                      onClick={() => deleteCartProduct(productItem?.productId?._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

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
