import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useOrders } from '../Context/OrderContext'

const AllOrders = () => {
  const { 
    orders, 
    loading, 
    pagination, 
    getAllOrders, 
    getOrderStatus,
    formatOrderDate,
    calculateOrderTotal,
    getPaymentImageUrl
  } = useOrders()
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    getAllOrders(currentPage)
  }, [currentPage])

  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedStatus)

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo(0, 0)
  }

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

  if (orders.length === 0) {
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
            <p className="text-gray-600 mb-6">You haven't placed any orders yet. Start shopping to see your orders here.</p>
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
                  onClick={() => setSelectedStatus('all')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    selectedStatus === 'all'
                      ? 'bg-pink-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setSelectedStatus('pending')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    selectedStatus === 'pending'
                      ? 'bg-yellow-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setSelectedStatus('cancelled')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    selectedStatus === 'cancelled'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Cancelled
                </button>
                <button
                  onClick={() => setSelectedStatus('completed')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    selectedStatus === 'completed'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Completed
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {filteredOrders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300"
                >
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          Order #{order._id}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {formatOrderDate(order.createdAt)}
                        </p>
                      </div>
                      <span className={`mt-2 sm:mt-0 px-3 py-1 rounded-full text-sm font-medium ${getOrderStatus(order.status).color}`}>
                        {getOrderStatus(order.status).text}
                        {`status: ${order.status}`}
                      </span>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Products</h4>
                      <div className="space-y-4">
                        {order.products.map((item) => (
                          <div key={item._id} className="flex items-center">
                            {item.product.images?.[0]?.url && (
                              <img
                                src={item.product.images[0].url}
                                alt={item.product.name}
                                className="h-16 w-16 rounded object-cover"
                              />
                            )}
                            <div className="ml-4 flex-1">
                              <p className="text-sm font-medium text-gray-900">{item.product.name}</p>
                              <p className="text-sm text-gray-500">
                                Qty: {item.quantity} × {item.product.price} EGP
                              </p>
                            </div>
                            <p className="text-sm font-medium text-gray-900">
                              {(item.product.price * item.quantity).toFixed(2)} EGP
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-500">Payment Method</p>
                          <p className="text-sm font-medium text-gray-900 capitalize">
                            {order.paymentType}
                          </p>
                          {order.paymentType === 'instapay' && (
                            <img 
                              src={getPaymentImageUrl(order)}
                              alt="Payment Receipt"
                              className="mt-2 h-20 w-auto rounded border border-gray-200"
                            />
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Total Amount</p>
                          <p className="text-lg font-bold text-gray-900">
                            {calculateOrderTotal(order.products).toFixed(2)} EGP
                          </p>
                        </div>
                      </div>
                    </div>

                    {order.status !== 'completed' && order.status !== 'cancelled' && (
                      <div className="mt-4 p-3 bg-pink-50 rounded-lg">
                        <p className="text-sm text-pink-700">
                          To cancel this order, please call: <span className="font-semibold">01020516108</span>
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center space-x-2">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 text-sm font-medium rounded-md ${
                        currentPage === page
                          ? 'bg-pink-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </nav>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AllOrders
