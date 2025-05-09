"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  ArrowLeft,
  Calendar,
  Download,
  Eye,
  Loader2,
  MapPin,
  Package,
  Phone,
  Mail,
  User,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  ShoppingBag,
  TruckIcon,
  Truck,
} from "lucide-react";
const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("userToken");
      if (!token) {
        toast.error("Please login to view order details");
        navigate("/login");
        return;
      }

      if (!id) {
        toast.error("Invalid order ID");
        navigate("/dashboard/manage_orders");
        return;
      }

      const response = await axios.get(
        `https://tala-store.vercel.app/order/${id}`,
        {
          headers: {
            token: token,
          },
        }
      );

      if (response.data.success) {
        setOrder(response.data.results);
      } else {
        toast.error(response.data.message || "Failed to fetch order details");
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to fetch order details");
      }
    } finally {
      setTimeout(() => setLoading(false), 300); // Small delay for smoother transition
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdatingStatus(true);
      const token = localStorage.getItem("userToken");
      await axios.patch(
        `https://tala-store.vercel.app/order/${id}/status`,
        { status: newStatus },
        {
          headers: {
            token: token,
          },
        }
      );
      toast.success("Order status updated successfully");
      fetchOrderDetails(); // Refresh order details
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "confirmed":
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "completed":
        return <TruckIcon className="h-5 w-5 text-green-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  const handleDownload = async (imageUrl) => {
    try {
      toast.loading("Downloading image...");
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `payment-proof-${order._id}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.dismiss();
      toast.success("Image downloaded successfully");
    } catch (error) {
      console.error("Error downloading image:", error);
      toast.dismiss();
      toast.error("Failed to download image");
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const getShippingFee = (address) => {
    if (!address) return 0;

    // Check if the address contains Cairo or Giza
    if (address.toLowerCase().includes("cairo")) {
      return 80;
    } else if (address.toLowerCase().includes("giza")) {
      return 50;
    }

    return 0;
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <Loader2 className="h-12 w-12 text-pink-600 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Order Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The order you&apos;re looking for doesn&apos;t exist or you
            don&apos;t have permission to view it.
          </p>
          <button
            onClick={() => navigate("/dashboard/manage_orders")}
            className="w-full px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors duration-200 flex items-center justify-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16 sm:mt-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
          <ShoppingBag className="h-7 w-7 mr-3 text-pink-600" />
          Order Details
        </h1>
        <button
          onClick={() => navigate("/dashboard/manage_orders")}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        {/* Order Status Header */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <div className="flex items-center mb-2">
                <h2 className="text-lg font-semibold text-gray-900">
                  Order #{order._id}
                </h2>
                <span
                  className={`ml-3 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                    order.status
                  )}`}
                >
                  {getStatusIcon(order.status)}
                  <span className="ml-1 inline-block">
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                </span>
              </div>
              <div className="flex items-center text-gray-600 text-sm">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Placed on {formatDate(order.createdAt)}</span>
              </div>
            </div>

            <div className="flex items-center">
              <div className="relative">
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={updatingStatus}
                  className="pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white shadow-sm appearance-none disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <option value="pending">Mark as Pending</option>
                  <option value="confirmed">Mark as Confirmed</option>
                  <option value="cancelled">Mark as Cancelled</option>
                  <option value="completed">Mark as Delivered</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  {updatingStatus ? (
                    <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
                  ) : (
                    <svg
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      viewBox="0 0 20 20"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 lg:divide-x">
          {/* Customer Information */}
          <div className="p-6 border-b lg:border-b-0">
            <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900">
              <User className="h-5 w-5 mr-2 text-pink-600" />
              Customer Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <User className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium text-gray-900">{order.name}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900">{order.phone}</p>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium text-gray-900">{order.address}</p>
                </div>
              </div>

              {order.createdBy?.email && (
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">
                      {order.createdBy.email}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="p-6 border-b lg:border-b-0 lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900">
              <Package className="h-5 w-5 mr-2 text-pink-600" />
              Order Items
            </h3>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {order.products.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-pink-200 transition-colors duration-200"
                >
                  <div className="flex-shrink-0 w-full sm:w-auto flex justify-center">
                    {item.product?.images?.[0]?.url ? (
                      <img
                        src={item.product.images[0].url || "/placeholder.svg"}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Package className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-gray-900">
                        {item.product?.name}
                      </h4>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        ID: {item._id}
                      </span>
                    </div>
                    <div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                      <p className="text-gray-500">
                        Category:{" "}
                        <span className="text-gray-700">
                          {item.product?.category?.name || "N/A"}
                        </span>
                      </p>
                      <p className="text-gray-500">
                        Quantity:{" "}
                        <span className="text-gray-700">{item.quantity}</span>
                      </p>
                      <p className="text-gray-500">
                        Unit Price:{" "}
                        <span className="text-gray-700">
                          EGP {item.product?.finalPrice}
                        </span>
                      </p>
                      <p className="text-gray-500">
                        Subtotal:{" "}
                        <span className="font-medium text-pink-600">
                          EGP {item.product?.finalPrice * item.quantity}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900">
            <CreditCard className="h-5 w-5 mr-2 text-pink-600" />
            Payment Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                  <CreditCard className="h-5 w-5 text-pink-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Payment Type</p>
                  <p className="font-medium text-gray-900 capitalize">
                    {order.paymentType}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                  <ShoppingBag className="h-5 w-5 text-pink-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Subtotal</p>
                  <p className="font-medium text-gray-900">
                    EGP{" "}
                    {order.totalPrice
                      ? Number(order.totalPrice).toFixed(2)
                      : "0.00"}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                  <Truck className="h-5 w-5 text-pink-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Shipping Fee</p>
                  <p className="font-medium text-gray-900">
                    EGP {getShippingFee(order.address).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                  <CreditCard className="h-5 w-5 text-pink-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="font-medium text-2xl text-pink-600">
                    EGP{" "}
                    {(
                      (order.totalPrice ? Number(order.totalPrice) : 0) +
                      getShippingFee(order.address)
                    ).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {order.paymentImage && (
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <p className="text-sm text-gray-500 mb-3 font-medium">
                  Payment Proof
                </p>
                <div className="flex flex-col space-y-4">
                  <div className="relative group">
                    <img
                      src={order.paymentImage.url || "/placeholder.svg"}
                      alt="Payment Proof"
                      className="w-full h-48 object-cover rounded-lg border border-gray-200 group-hover:opacity-90 transition-opacity duration-200"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() => handleImageClick(order.paymentImage.url)}
                        className="bg-black bg-opacity-70 text-white p-2 rounded-full"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleImageClick(order.paymentImage.url)}
                      className="flex-1 flex items-center justify-center bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </button>
                    <button
                      onClick={() => handleDownload(order.paymentImage.url)}
                      className="flex-1 flex items-center justify-center bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors duration-200"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={() => setShowImageModal(false)}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-4xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Payment Proof
              </h3>
              <button
                onClick={() => setShowImageModal(false)}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-4 overflow-auto">
              <img
                src={selectedImage || "/placeholder.svg"}
                alt="Payment Proof"
                className="max-w-full h-auto mx-auto"
              />
            </div>
            <div className="p-4 border-t flex justify-end">
              <button
                onClick={() => handleDownload(selectedImage)}
                className="flex items-center bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors duration-200"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
