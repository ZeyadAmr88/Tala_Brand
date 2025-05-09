import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  RefreshCw,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Package,
  User,
  MapPin,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  TruckIcon,
  Eye,
  AlertCircle,
} from "lucide-react";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchId, setSearchId] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("userToken")) {
      fetchOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
      };

      if (statusFilter !== "all") {
        params.status = statusFilter;
      }

      const response = await axios.get(`https://tala-store.vercel.app/order`, {
        headers: {
          token: localStorage.getItem("userToken"),
        },
        params,
      });
      setOrders(response.data.results);
      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
    toast.success("Orders refreshed");
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.patch(
        `https://tala-store.vercel.app/order/${orderId}/status`,
        { status: newStatus },
        {
          headers: {
            token: localStorage.getItem("userToken"),
          },
        }
      );
      toast.success("Order status updated successfully");
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border border-red-200";
      case "completed":
        return "bg-green-100 text-green-800 border border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-3.5 w-3.5 mr-1" />;
      case "confirmed":
        return <CheckCircle className="h-3.5 w-3.5 mr-1" />;
      case "cancelled":
        return <XCircle className="h-3.5 w-3.5 mr-1" />;
      case "completed":
        return <TruckIcon className="h-3.5 w-3.5 mr-1" />;
      default:
        return <Clock className="h-3.5 w-3.5 mr-1" />;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="flex justify-between items-center mb-8">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="flex items-center space-x-4">
            <div className="h-10 w-48 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="border-b border-gray-100 pb-4 mb-4 last:border-0 last:mb-0 last:pb-0"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-4 w-24 bg-gray-100 rounded animate-pulse"></div>
                  </div>
                  <div className="hidden md:block flex-1">
                    <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse"></div>
                  </div>
                  <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }
  const filteredOrders = searchId.trim()
    ? orders.filter((order) =>
        order._id.toLowerCase().includes(searchId.toLowerCase())
      )
    : orders;

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-md p-6 mb-8"
      >
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center">
              <Package className="h-7 w-7 mr-3 text-pink-600" />
              Manage Orders
            </h1>
            <p className="text-gray-500 mt-1">
              View and manage all customer orders
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by Order ID"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              />
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <select
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 appearance-none"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Delivered</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </div>

              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors duration-200"
                title="Refresh orders"
              >
                <RefreshCw
                  className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`}
                />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {filteredOrders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-lg shadow-md p-8 text-center"
        >
          <div className="flex flex-col items-center justify-center">
            <AlertCircle className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Orders Found
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {searchId.trim()
                ? `No orders matching "${searchId}" were found.`
                : statusFilter !== "all"
                ? `No orders with status "${statusFilter}" were found.`
                : "There are no orders to display."}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {searchId.trim() && (
                <button
                  onClick={() => setSearchId("")}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors duration-200"
                >
                  Clear Search
                </button>
              )}
              {statusFilter !== "all" && (
                <button
                  onClick={() => setStatusFilter("all")}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors duration-200"
                >
                  Show All Orders
                </button>
              )}
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-md transition-colors duration-200 flex items-center"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </motion.div>
      ) : (
        <>
          {/* Desktop View */}
          <div className="hidden md:block overflow-hidden rounded-lg shadow">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Products
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-4 py-4 text-sm text-gray-900">
                      <Link
                        to={`/dashboard/order/${order._id}`}
                        className="text-pink-600 hover:text-pink-800 font-medium hover:underline"
                      >
                        {order._id.substring(0, 10)}...
                      </Link>
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <div>
                        <p className="font-medium text-gray-800">
                          {order.name}
                        </p>
                        <p className="text-gray-500 text-xs">{order.phone}</p>
                        <p className="text-gray-500 text-xs truncate max-w-[200px]">
                          {order.address}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <div className="max-h-24 overflow-y-auto pr-2">
                        {order.products.map((item) => (
                          <div
                            key={item._id}
                            className="flex items-center space-x-2 mb-2 last:mb-0"
                          >
                            {item.product?.images?.[0]?.url ? (
                              <img
                                src={item.product.images[0].url}
                                alt={item.product?.name}
                                className="w-8 h-8 object-cover rounded-md border border-gray-200"
                              />
                            ) : (
                              <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center">
                                <Package className="h-4 w-4 text-gray-400" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-xs text-gray-800">
                                {item.product?.name}
                              </p>
                              <p className="text-gray-500 text-xs">
                                {item.quantity} x {item.product?.finalPrice} EGP
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">
                      {order.totalPrice} EGP
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <span
                        className={`px-3 py-1 inline-flex items-center rounded-full text-xs font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm">
                      {order.paymentImage ? (
                        <div className="relative group">
                          <img
                            src={order.paymentImage.url}
                            alt="Payment"
                            className="w-16 h-16 object-cover rounded-md border border-gray-200 group-hover:opacity-90 transition-opacity"
                          />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link
                              to={`/dashboard/order/${order._id}`}
                              className="p-1 bg-black bg-opacity-50 rounded-full"
                            >
                              <Eye className="h-4 w-4 text-white" />
                            </Link>
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">No image</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <div className="relative">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value)
                          }
                          className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="completed">Delivered</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="md:hidden space-y-4">
            {filteredOrders.map((order) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <div>
                    <Link
                      to={`/dashboard/order/${order._id}`}
                      className="text-pink-600 hover:text-pink-800 font-medium text-sm hover:underline"
                    >
                      #{order._id.substring(0, 8)}...
                    </Link>
                    <p className="text-xs text-gray-500">
                      <Calendar className="inline h-3 w-3 mr-1" />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 inline-flex items-center rounded-full text-xs font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusIcon(order.status)}
                    {order.status}
                  </span>
                </div>

                <div className="p-4">
                  <div className="flex items-start mb-3">
                    <User className="h-4 w-4 text-gray-400 mt-0.5 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">Customer</p>
                      <p className="text-sm font-medium">{order.name}</p>
                      <p className="text-xs text-gray-500">{order.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start mb-3">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">Address</p>
                      <p className="text-sm">{order.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start mb-3">
                    <Package className="h-4 w-4 text-gray-400 mt-0.5 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">Products</p>
                      <div className="mt-1 space-y-2">
                        {order.products.slice(0, 2).map((item) => (
                          <div key={item._id} className="flex items-center">
                            {item.product?.images?.[0]?.url ? (
                              <img
                                src={item.product.images[0].url}
                                alt={item.product?.name}
                                className="w-8 h-8 object-cover rounded-md border border-gray-200 mr-2"
                              />
                            ) : (
                              <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center mr-2">
                                <Package className="h-4 w-4 text-gray-400" />
                              </div>
                            )}
                            <div>
                              <p className="text-xs font-medium">
                                {item.product?.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {item.quantity} x {item.product?.finalPrice} EGP
                              </p>
                            </div>
                          </div>
                        ))}
                        {order.products.length > 2 && (
                          <p className="text-xs text-gray-500">
                            +{order.products.length - 2} more items
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start mb-4">
                    <DollarSign className="h-4 w-4 text-gray-400 mt-0.5 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">Total</p>
                      <p className="text-sm font-bold text-pink-600">
                        {order.totalPrice} EGP
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white"
                    >
                      <option value="pending">Mark as Pending</option>
                      <option value="confirmed">Mark as Confirmed</option>
                      <option value="cancelled">Mark as Cancelled</option>
                      <option value="completed">Mark as Delivered</option>
                    </select>

                    <Link
                      to={`/dashboard/order/${order._id}`}
                      className="w-full px-3 py-2 bg-pink-600 text-white text-sm font-medium rounded-md hover:bg-pink-700 transition-colors duration-200 flex items-center justify-center"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* Pagination */}
      {filteredOrders.length > 0 && totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mt-8"
        >
          <nav className="flex items-center bg-white px-4 py-3 rounded-lg shadow-sm">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="mr-2 p-2 rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent transition-colors duration-200 flex items-center"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex items-center space-x-1">
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                const isCurrentPage = pageNumber === currentPage;

                // Show current page, first, last, and pages around current
                const shouldShow =
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= currentPage - 1 &&
                    pageNumber <= currentPage + 1);

                // Show dots for breaks in sequence
                const showLeftDots = pageNumber === 2 && currentPage > 3;
                const showRightDots =
                  pageNumber === totalPages - 1 && currentPage < totalPages - 2;

                if (showLeftDots) {
                  return (
                    <span key={pageNumber} className="px-2 py-1 text-gray-500">
                      ...
                    </span>
                  );
                }

                if (showRightDots) {
                  return (
                    <span key={pageNumber} className="px-2 py-1 text-gray-500">
                      ...
                    </span>
                  );
                }

                if (shouldShow) {
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors duration-200 ${
                        isCurrentPage
                          ? "bg-pink-600 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                }

                return null;
              })}
            </div>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="ml-2 p-2 rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent transition-colors duration-200 flex items-center"
              aria-label="Next page"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </nav>
        </motion.div>
      )}
    </div>
  );
};

export default ManageOrders;
