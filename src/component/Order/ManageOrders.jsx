import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ManageOrders = () => {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        if (localStorage.getItem("userToken")) {
            fetchOrders();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`https://tala-store.vercel.app/order`, {
                headers: {
                    token: localStorage.getItem("userToken"),
                },
                params: {
                    page: currentPage,
                    limit: 10,
                },
            });
            setOrders(response.data.results);
            setTotalPages(response.data.pagination.pages);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
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
            toast.success('Order status updated successfully');
            fetchOrders();
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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-8">Manage Orders</h1>

            <div className="overflow-x-auto rounded-lg shadow">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                Order ID
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                Customer
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                                Products
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                Total
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                Status
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                                Payment
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {orders.map((order) => (
                            <tr key={order._id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                                    {order._id.slice(-6)}
                                </td>
                                <td className="px-4 py-3 text-sm">
                                    <div>
                                        <p className="font-medium">{order.name}</p>
                                        <p className="text-gray-500 text-xs">{order.phone}</p>
                                        <p className="text-gray-500 text-xs hidden md:block">{order.address}</p>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-sm hidden md:table-cell">
                                    {order.products.map((item) => (
                                        <div key={item._id} className="flex items-center space-x-2 mb-2">
                                            {item.product?.images?.[0]?.url && (
                                                <img
                                                    src={item.product.images[0].url}
                                                    alt={item.product.name}
                                                    className="w-8 h-8 object-cover rounded"
                                                />
                                            )}
                                            <div>
                                                <p className="font-medium text-xs">{item.product?.name}</p>
                                                <p className="text-gray-500 text-xs">
                                                    {item.quantity} x ${item.product?.price}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                                    ${order.totalPrice}
                                </td>
                                <td className="px-4 py-3 text-sm">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-sm hidden md:table-cell">
                                    {order.paymentImage && (
                                        <img
                                            src={order.paymentImage.url}
                                            alt="Payment"
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                    )}
                                </td>
                                <td className="px-4 py-3 text-sm">
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                        className="block w-full px-2 py-1 text-xs border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-8">
                <nav className="flex items-center space-x-2">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 text-sm rounded border disabled:opacity-50 hover:bg-gray-50"
                    >
                        Previous
                    </button>
                    <span className="px-3 py-1 text-sm">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 text-sm rounded border disabled:opacity-50 hover:bg-gray-50"
                    >
                        Next
                    </button>
                </nav>
            </div>
        </div>
    );
};

export default ManageOrders;
