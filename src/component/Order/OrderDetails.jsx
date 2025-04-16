import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        fetchOrderDetails();
    }, [id]);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("userToken");
            if (!token) {
                toast.error('Please login to view order details');
                navigate('/login');
                return;
            }

            if (!id) {
                toast.error('Invalid order ID');
                navigate('/dashboard/manage_orders');
                return;
            }

            const response = await axios.get(
                `https://tala-store.vercel.app/order/${id}`,
                {
                    headers: {
                        token: token
                    }
                }
            );

            if (response.data.success) {
                setOrder(response.data.results);
            } else {
                toast.error(response.data.message || 'Failed to fetch order details');
            }
        } catch (error) {
            console.error('Error fetching order details:', error);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Failed to fetch order details');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (newStatus) => {
        try {
            const token = localStorage.getItem("userToken");
            await axios.patch(
                `https://tala-store.vercel.app/order/${id}/status`,
                { status: newStatus },
                {
                    headers: {
                        token: token
                    }
                }
            );
            toast.success('Order status updated successfully');
            fetchOrderDetails(); // Refresh order details
        } catch (error) {
            console.error('Error updating order status:', error);
            toast.error('Failed to update order status');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'confirmed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl);
        setShowImageModal(true);
    };

    const handleDownload = async (imageUrl) => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `payment-proof-${order._id}.jpg`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            toast.success('Image downloaded successfully');
        } catch (error) {
            console.error('Error downloading image:', error);
            toast.error('Failed to download image');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Order Not Found</h1>
                <button
                    onClick={() => navigate('/dashboard/manage_orders')}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                    Back to Orders
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 mt-20">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Order Details</h1>
                <button
                    onClick={() => navigate('/dashboard/manage_orders')}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                    Back to Orders
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                {/* Order Status */}
                <div className="p-6 border-b">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-lg font-semibold">Order #{order._id}</h2>
                            <p className="text-gray-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <select
                                value={order.status}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                className="px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                {order.status}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Customer Information */}
                <div className="p-6 border-b">
                    <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-gray-600">Name</p>
                            <p className="font-medium">{order.name}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Phone</p>
                            <p className="font-medium">{order.phone}</p>
                        </div>
                        <div className="md:col-span-2">
                            <p className="text-gray-600">Address</p>
                            <p className="font-medium">{order.address}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Email</p>
                            <p className="font-medium">{order.createdBy?.email}</p>
                        </div>
                    </div>
                </div>

                {/* Order Items */}
                <div className="p-6 border-b">
                    <h3 className="text-lg font-semibold mb-4">Order Items</h3>
                    <div className="space-y-4">
                        {order.products.map((item) => (
                            <div key={item._id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                                {item.product?.images?.[0]?.url && (
                                    <img
                                        src={item.product.images[0].url}
                                        alt={item.product.name}
                                        className="w-20 h-20 object-cover rounded"
                                    />
                                )}
                                <div className="flex-1">
                                    <h4 className="font-medium">{item.product?.name}</h4>
                                    <p className="text-gray-500">Category: {item.product?.category?.name}</p>
                                    <p className="text-gray-500">Quantity: {item.quantity}</p>
                                    <p className="text-gray-500">Price: ${item.product?.price}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium">${item.product?.price * item.quantity}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Payment Information */}
                <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-gray-600">Payment Type</p>
                            <p className="font-medium capitalize">{order.paymentType}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Total Amount</p>
                            <p className="font-medium text-xl">${order.totalPrice}</p>
                        </div>
                        {order.paymentImage && (
                            <div className="md:col-span-2">
                                <p className="text-gray-600 mb-2">Payment Proof</p>
                                <div className="flex flex-col space-y-4">
                                    <img
                                        src={order.paymentImage.url}
                                        alt="Payment Proof"
                                        className="w-48 h-48 object-cover rounded-lg"
                                    />
                                    <div className="flex space-x-4">
                                        <button
                                            onClick={() => handleImageClick(order.paymentImage.url)}
                                            className="bg-slate-300 text-black px-4 py-2 rounded-md hover:bg-slate-500 transition-colors"
                                        >
                                            View Image
                                        </button>
                                        <button
                                            onClick={() => handleDownload(order.paymentImage.url)}
                                            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                                        >
                                            Download Image
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Payment Proof</h3>
                            <button
                                onClick={() => setShowImageModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>
                        <img
                            src={selectedImage}
                            alt="Payment Proof"
                            className="max-w-full h-auto"
                        />
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => handleDownload(selectedImage)}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                            >
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
