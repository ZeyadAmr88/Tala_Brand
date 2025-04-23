import { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext';
import { toast } from 'react-hot-toast';

export const OrderContext = createContext();

// eslint-disable-next-line react/prop-types
export function OrderProvider({ children }) {
    const [orders, setOrders] = useState([]);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const { userData } = useContext(UserContext);

    const getAllOrders = async () => {
        setLoading(true)
        try {
            const storedToken = localStorage.getItem('userToken');
            const config = {
                headers: {
                    'token': storedToken
                }
            }


            const response = await axios.get(
                'https://tala-store.vercel.app/order/user/orders',
                config
            )
            console.log("333", response);


            if (response.data.success) {
                setOrders(response.data.results)
            }
        } catch (error) {
            console.error('Error fetching orders:', error)
            const errorMessage = error.response?.data?.message || 'Failed to fetch orders'
            toast.error(errorMessage)

            if (error.response?.status === 401) {
                // Token expired or invalid
                localStorage.removeItem('userToken')
                window.location.href = '/login'
            }
        } finally {
            setLoading(false)
        }
    }

    const createOrder = async (orderData) => {
        setLoading(true)
        try {
            if (!userData?.token) {
                throw new Error('Authentication required')
            }

            // Create FormData object
            const formData = new FormData()

            // Append all order data
            formData.append('cartId', orderData.cartId)
            formData.append('name', orderData.name)
            formData.append('phone', orderData.phone)
            formData.append('address', orderData.address)
            formData.append('paymentType', orderData.paymentType)

            // Always append payment image if it exists
            if (orderData.paymentImage) {
                formData.append('paymentImage', orderData.paymentImage)
            } else if (orderData.paymentType === 'instapay') {
                throw new Error('Payment image is required for online payment')
            }

            const config = {
                headers: {
                    'token': userData?.token,
                    'Content-Type': 'multipart/form-data'
                }
            }

            const response = await axios.post(
                'https://tala-store.vercel.app/order',
                formData,
                config
            )

            if (response.data.success) {
                toast.success('Order created successfully')
                const createdOrder = response.data.order || response.data.results
                // Add the new order to the orders list
                setOrders(prev => [createdOrder, ...prev])
                return createdOrder
            } else {
                throw new Error(response.data.message || 'Failed to create order')
            }
        } catch (error) {
            console.error('Error creating order:', error)
            if (error.message === 'Authentication required') {
                // Save current path for redirect after login
                localStorage.setItem('redirectAfterLogin', '/checkout')
                window.location.href = '/login'
                return null
            }

            const errorMessage = error.response?.data?.message || error.message || 'Failed to create order'
            toast.error(errorMessage)

            if (error.response?.status === 401) {
                // Token expired or invalid
                localStorage.removeItem('userToken')
                localStorage.setItem('redirectAfterLogin', '/checkout')
                window.location.href = '/login'
                return null
            }
            throw error
        } finally {
            setLoading(false)
        }
    }

    const getOneOrder = async (orderId) => {
        try {
            setLoading(true);
            const response = await axios.get(`https://tala-store.vercel.app/order/${orderId}`, {
                headers: {
                    token: userData?.token
                }
            });

            if (response.data.success) {
                setCurrentOrder(response.data.results);
                return response.data.results;
            } else {
                throw new Error(response.data.message || 'Failed to fetch order details');
            }
        } catch (error) {
            console.error('Error fetching order details:', error);
            toast.error(error.response?.data?.message || 'Failed to fetch order details');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            setLoading(true);
            const response = await axios.patch(
                `https://tala-store.vercel.app/order/${orderId}/status`,
                { status: newStatus },
                {
                    headers: {
                        token: userData?.token
                    }
                }
            );

            if (response.data.success) {
                // Update the order in the orders list
                setOrders(prevOrders =>
                    prevOrders.map(order =>
                        order._id === orderId
                            ? { ...order, status: newStatus }
                            : order
                    )
                );

                // Update currentOrder if it's the one being modified
                if (currentOrder?._id === orderId) {
                    setCurrentOrder(response.data.results);
                }

                toast.success(response.data.message || 'Order status updated successfully');
                return response.data.results;
            } else {
                throw new Error(response.data.message || 'Failed to update order status');
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            toast.error(error.response?.data?.message || 'Failed to update order status');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Helper function to check if status update is allowed
    const canUpdateStatus = (currentStatus) => {
        return currentStatus !== 'confirmed' && currentStatus !== 'cancelled';
    };

    // Helper function to format order status
    const getOrderStatus = (status) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return { text: 'Pending', color: 'bg-yellow-100 text-yellow-800' };
            case 'processing':
                return { text: 'Processing', color: 'bg-blue-100 text-blue-800' };
            case 'confirmed':
                return { text: 'confirmed', color: 'bg-green-100 text-green-800' };
            case 'cancelled':
                return { text: 'Cancelled', color: 'bg-red-100 text-red-800' };
            default:
                return { text: status, color: 'bg-gray-100 text-gray-800' };
        }
    };

    // Helper function to format date
    const formatOrderDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Helper function to calculate total price for an order
    const calculateOrderTotal = (products) => {
        return products.reduce((total, item) => {
            const price = item.product?.price || 0;
            const quantity = item.quantity || 0;
            return total + (price * quantity);
        }, 0);
    };

    // Helper function to get payment image URL
    const getPaymentImageUrl = (order) => {
        return order?.paymentImage?.url || '';
    };

    // Value object to be provided to consumers
    const value = {
        orders,
        currentOrder,
        loading,
        createOrder,
        getAllOrders,
        getOneOrder,
        updateOrderStatus,
        getOrderStatus,
        formatOrderDate,
        calculateOrderTotal,
        getPaymentImageUrl,
        canUpdateStatus
    };

    return (
        <OrderContext.Provider value={value}>
            {children}
        </OrderContext.Provider>
    );
}

// Custom hook for using the OrderContext
export const useOrders = () => {
    const context = useContext(OrderContext);
    if (!context) {
        throw new Error('useOrders must be used within an OrderProvider');
    }
    return context;
}; 