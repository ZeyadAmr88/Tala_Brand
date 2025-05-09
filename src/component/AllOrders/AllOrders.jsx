"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { useOrders } from "../Context/OrderContext"

const AllOrders = () => {
  const { orders, loading, getAllOrders, getOrderStatus, formatOrderDate, calculateOrderTotal, getPaymentImageUrl } =
    useOrders()

  const [selectedStatus, setSelectedStatus] = useState("all")

  useEffect(() => {
    getAllOrders()
  }, [])

  const filteredOrders =
    selectedStatus === "all" ? orders || [] : (orders || []).filter((order) => order.status === selectedStatus)


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden p-8 text-center">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-8 w-48 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-3 w-full">
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden p-8 text-center"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Orders Yet</h2>
            <p className="text-gray-600 mb-6">
              You haven&apos;t placed any orders yet. Start shopping to see your orders here.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            >
              Start Shopping
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Your Orders</h2>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedStatus("all")}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    selectedStatus === "all" ? "bg-pink-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setSelectedStatus("pending")}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    selectedStatus === "pending"
                      ? "bg-yellow-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setSelectedStatus("cancelled")}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    selectedStatus === "cancelled"
                      ? "bg-red-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Cancelled
                </button>
                <button
                  onClick={() => setSelectedStatus("confirmed")}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    selectedStatus === "confirmed"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Confirmed
                </button>
                <button
                  onClick={() => setSelectedStatus("completed")}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    selectedStatus === "completed"
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Delivered
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {filteredOrders.map((order) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300"
                >
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Order #{order._id}</h3>
                        <p className="text-sm text-gray-500">{formatOrderDate(order.createdAt)}</p>
                      </div>
                      <span
                        className={`mt-2 sm:mt-0 px-3 py-1 rounded-full text-sm font-medium ${getOrderStatus(order.status).color}`}
                      >
                        {getOrderStatus(order.status).text}
                      </span>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Products</h4>
                      <div className="space-y-4">
                        {order.products.map((item) => (
                          <div key={item._id} className="flex items-center">
                            {item.product?.images?.[0]?.url && (
                              <img
                                src={item.product.images[0].url || "/placeholder.svg"}
                                alt={item.product.name}
                                className="h-16 w-16 rounded object-cover"
                              />
                            )}
                            <div className="ml-4 flex-1">
                              <p className="text-sm font-medium text-gray-900">{item.product?.name}</p>
                              <p className="text-sm text-gray-500">
                                Qty: {item.quantity} x {Number(item.product?.finalPrice)} EGP
                              </p>
                            </div>
                            <p className="text-sm font-medium text-gray-900">
                              {(Number(item.product?.finalPrice) * item.quantity).toFixed(2)} EGP
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <div className="flex justify-between flex-wrap md:flex-nowrap items-center">
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-500">Subtotal</p>
                            <p className="text-sm text-gray-700">
                              {order.totalPrice?.toFixed(2)}{" "}
                              EGP
                            </p>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-500">Shipping Fee</p>
                            <p className="text-sm text-gray-700">
                              {order.address?.includes("Cairo")
                                ? "80.00"
                                : order.address?.includes("Giza")
                                  ? "50.00"
                                  : "0.00"}{" "}
                              EGP
                            </p>
                          </div>
                          <div className="flex justify-between items-center pt-1 gap-4">
                            <p className="text-sm font-medium text-gray-700">Total Amount </p>
                            <p className="text-lg font-medium text-gray-900">
                              {calculateOrderTotal(order.products, order.address).toFixed(2)} EGP
                            </p>
                          </div>
                        </div>
                        {order.paymentImage && (
                          <div className="flex items-center space-x-2">
                            <img
                              src={getPaymentImageUrl(order) || "/placeholder.svg"}
                              alt="Payment Proof"
                              className="h-12 w-12 rounded object-cover"
                            />
                            <span className="text-sm text-gray-500">Payment Proof</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AllOrders
