import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useCart } from '../../component/Context/CartContext'
import { useOrders } from '../Context/OrderContext'
import { UserContext } from '../Context/UserContext'
import { useContext } from 'react'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const CheckOut = () => {
  const navigate = useNavigate()
  const { cartItems, clearCart, getCartItems, } = useCart()
  const { createOrder } = useOrders()
  const { userData, loading: userLoading } = useContext(UserContext)
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [paymentProof, setPaymentProof] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cartProducts, setCartProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCity, setSelectedCity] = useState('')

  // Add validation state
  const [validationErrors, setValidationErrors] = useState({})

  // Validation patterns
  const validationPatterns = {
    name: /^[a-zA-Z\s]{3,50}$/, // Only letters and spaces, 3-50 characters
    phone: /^(\+2)?01[0125][0-9]{8}$/, // Egyptian phone number format
    street: /^[a-zA-Z0-9\s\-.,]{5,100}$/, // Alphanumeric with some special chars
    building: /^[0-9]{1,5}$/, // 1-5 digits
    floor: /^[0-9]{1,3}$/, // 1-3 digits
    apartment: /^[0-9]{1,4}$/, // 1-4 digits
    landmark: /^[a-zA-Z0-9\s\-.,]{0,100}$/, // Optional, alphanumeric with some special chars
    area: /^[a-zA-Z\s]{3,50}$/, // Only letters and spaces, 3-50 characters
    city: /^(Cairo|Giza)$/ // Only Cairo or Giza
  }

  // Error messages
  const errorMessages = {
    name: 'Name should contain only letters and spaces (3-50 characters)',
    phone: 'Please enter a valid Egyptian phone number',
    street: 'Street name should be 5-100 characters long',
    building: 'Building number should be 1-5 digits',
    floor: 'Floor number should be 1-3 digits',
    apartment: 'Apartment number should be 1-4 digits',
    landmark: 'Landmark should be less than 100 characters',
    area: 'Area should contain only letters and spaces (3-50 characters)',
    city: 'Please select a valid city (Cairo or Giza)'
  }

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    street: '',
    building: '',
    floor: '',
    apartment: '',
    landmark: '',
    area: '',
    city: ''
  })

  // Check authentication only after loading is complete
  useEffect(() => {
    if (!userLoading && !userData?.token) {
      // Save current path for redirect after login
      localStorage.setItem('redirectAfterLogin', window.location.pathname);
      toast.error('Please login to continue checkout')
      navigate('/login')
    }
  }, [userData, userLoading, navigate])

  useEffect(() => {
    const loadCart = async () => {
      try {
        // Don't try to load cart if user isn't logged in
        if (!userData?.token) return;

        setIsLoading(true)
        console.log('Loading cart data...')
        
        // Check if we have cart items in the context
        if (cartItems?.products) {
          console.log('Using cart items from context:', cartItems.products)
          const mappedProducts = cartItems.products.map(item => ({
            _id: item.productId._id,
            name: item.productId.name,
            price: item.productId.price,
            quantity: item.quantity,
            mainImage: item.productId.defaultImage
          }))
          setCartProducts(mappedProducts)
          setIsLoading(false)
          return
        }

        // If not in context, try to fetch from API
        const cartData = await getCartItems()
        if (cartData?.products) {
          const mappedProducts = cartData.products.map(item => ({
            _id: item.productId._id,
            name: item.productId.name,
            price: item.productId.price,
            quantity: item.quantity,
            mainImage: item.productId.defaultImage
          }))
          setCartProducts(mappedProducts)
        }
      } catch (err) {
        console.error('Error loading cart:', err)
        setError('Failed to load cart items')
        toast.error('Failed to load cart items')
      } finally {
        setIsLoading(false)
      }
    }

    loadCart()
  }, [cartItems, getCartItems, userData])

  // Add a debug effect to monitor cart data
  useEffect(() => {
    console.log('Cart Items:', cartItems)
    console.log('Cart Products:', cartProducts)
  }, [cartItems, cartProducts])

  const validateField = (name, value) => {
    if (!validationPatterns[name].test(value)) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: errorMessages[name]
      }))
      return false
    }
    setValidationErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[name]
      return newErrors
    })
    return true
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    validateField(name, value)
  }

  const validateForm = () => {
    let isValid = true
    const newErrors = {}

    Object.keys(formData).forEach(key => {
      if (!validateField(key, formData[key])) {
        isValid = false
      }
    })

    return isValid
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('File size should be less than 5MB')
        e.target.value = null
        return
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file')
        e.target.value = null
        return
      }
      setPaymentProof(file)
    }
  }

  const calculateSubtotal = () => {
    if (!cartProducts || !Array.isArray(cartProducts)) return 0
    return cartProducts.reduce((total, item) => {
      if (!item?.price || !item?.quantity) return total
      return total + (Number(item.price) * item.quantity)
    }, 0)
  }

  const calculateShippingFee = () => {
    switch (selectedCity) {
      case 'Cairo':
        return 80
      case 'Giza':
        return 50
      default:
        return 0
    }
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShippingFee()
  }

  const handleCityChange = (e) => {
    const city = e.target.value
    setSelectedCity(city)
    setFormData(prev => ({
      ...prev,
      city: city
    }))
    validateField('city', city)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please correct the form errors')
      return
    }

    if (!cartItems?._id) {
      toast.error('No cart found. Please add items to your cart first.')
      return
    }

    // Check if payment proof is required and provided
    if (paymentMethod === 'online' && !paymentProof) {
      toast.error('Please upload payment proof for online payment')
      return
    }

    setIsSubmitting(true)

    try {
      // Create order data object
      const orderData = {
        cartId: cartItems._id,
        name: formData.name,
        phone: formData.phone,
        address: `${formData.building} ${formData.street}, ${formData.area}, ${formData.city}`,
        paymentType: paymentMethod === 'online' ? 'instapay' : 'cash',
        paymentImage: paymentProof
      }

      console.log('Submitting order with data:', orderData)

      // Create the order using OrderContext
      const result = await createOrder(orderData)

      if (result && result._id) {
        toast.success('Order placed successfully!')
        
        try {
          // Clear the cart first
          await clearCart()
          // Reset local cart products state
          setCartProducts([])
          // Navigate to orders page after successful cart clear
          navigate('/allorders')
        } catch (clearError) {
          console.error('Error clearing cart:', clearError)
          // Even if cart clearing fails, still navigate to orders
          navigate('/allorders')
        }
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error)
      const errorMessage = error.response?.data?.message || 'Something went wrong while placing your order'
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderOrderSummary = () => (
    <div className="border-t border-gray-200 pt-6">
      <h3 className="text-lg font-medium text-gray-900">Order Summary</h3>
      <div className="mt-4 space-y-4">
        {Array.isArray(cartProducts) && cartProducts.map((item, index) => (
          <div key={item?._id || `cart-item-${index}`} className="flex justify-between">
            <div className="flex items-center">
              {item?.mainImage?.url && (
                <img
                  src={item.mainImage.url}
                  alt={item?.name || 'Product image'}
                  className="h-16 w-16 rounded object-cover"
                />
              )}
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">{item?.name || 'Unnamed Product'}</p>
                <p className="text-sm text-gray-500">Qty: {item?.quantity || 0}</p>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-900">
              {((Number(item?.price) || 0) * (item?.quantity || 0)).toFixed(2)}{" "}EGP
            </p>
          </div>
        ))}
        <div className="border-t border-gray-200 pt-4 space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <p>Subtotal</p>
            <p>{calculateSubtotal().toFixed(2)}{" "}EGP</p>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <p>Shipping ({selectedCity || 'Select city'})</p>
            <p>{calculateShippingFee().toFixed(2)}{" "}EGP</p>
          </div>
          <div className="flex justify-between text-base font-medium text-gray-900">
            <p>Total</p>
            <p>{calculateTotal().toFixed(2)}{" "}EGP</p>
          </div>
        </div>
      </div>
    </div>
  )

  // Show loading state while checking authentication or loading cart
  if (userLoading || isLoading) {
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden p-8 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  // If cart is empty or not an array, show empty state
  if (!cartProducts || !Array.isArray(cartProducts) || cartProducts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden p-8 text-center"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
            <Link
              to="/products"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            >
              Continue Shopping
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shipping Information Form */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 ${
                        validationErrors.name ? 'border-red-500' : ''
                      }`}
                    />
                    {validationErrors.name && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 ${
                        validationErrors.phone ? 'border-red-500' : ''
                      }`}
                    />
                    {validationErrors.phone && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.phone}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Shipping Information</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                      Street Name
                    </label>
                    <input
                      type="text"
                      id="street"
                      name="street"
                      value={formData.street}
                      onChange={handleInputChange}
                      required
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 ${
                        validationErrors.street ? 'border-red-500' : ''
                      }`}
                    />
                    {validationErrors.street && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.street}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="building" className="block text-sm font-medium text-gray-700">
                      Building Number
                    </label>
                    <input
                      type="text"
                      id="building"
                      name="building"
                      value={formData.building}
                      onChange={handleInputChange}
                      required
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 ${
                        validationErrors.building ? 'border-red-500' : ''
                      }`}
                    />
                    {validationErrors.building && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.building}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="floor" className="block text-sm font-medium text-gray-700">
                      Floor
                    </label>
                    <input
                      type="text"
                      id="floor"
                      name="floor"
                      value={formData.floor}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 ${
                        validationErrors.floor ? 'border-red-500' : ''
                      }`}
                    />
                    {validationErrors.floor && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.floor}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="apartment" className="block text-sm font-medium text-gray-700">
                      Apartment Number
                    </label>
                    <input
                      type="text"
                      id="apartment"
                      name="apartment"
                      value={formData.apartment}
                      onChange={handleInputChange}
                      required
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 ${
                        validationErrors.apartment ? 'border-red-500' : ''
                      }`}
                    />
                    {validationErrors.apartment && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.apartment}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="landmark" className="block text-sm font-medium text-gray-700">
                      Landmark
                    </label>
                    <input
                      type="text"
                      id="landmark"
                      name="landmark"
                      value={formData.landmark}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 ${
                        validationErrors.landmark ? 'border-red-500' : ''
                      }`}
                    />
                    {validationErrors.landmark && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.landmark}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="area" className="block text-sm font-medium text-gray-700">
                      Area
                    </label>
                    <input
                      type="text"
                      id="area"
                      name="area"
                      value={formData.area}
                      onChange={handleInputChange}
                      required
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 ${
                        validationErrors.area ? 'border-red-500' : ''
                      }`}
                    />
                    {validationErrors.area && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.area}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* City Selection */}
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <select
                  id="city"
                  name="city"
                  value={selectedCity}
                  onChange={handleCityChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select a city</option>
                  <option value="Cairo">Cairo</option>
                  <option value="Giza">Giza</option>
                </select>
                {validationErrors.city && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.city}</p>
                )}
              </div>

              {/* Payment Method */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Payment Method</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="cash"
                      name="paymentMethod"
                      value="cash"
                      checked={paymentMethod === 'cash'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"
                    />
                    <label htmlFor="cash" className="ml-3 block text-sm font-medium text-gray-700">
                      Cash on Delivery
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="online"
                      name="paymentMethod"
                      value="online"
                      checked={paymentMethod === 'online'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"
                    />
                    <label htmlFor="online" className="ml-3 block text-sm font-medium text-gray-700">
                      Online Payment
                    </label>
                  </div>
                </div>

                {/* Payment Instructions */}
                <div className="bg-pink-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">
                    Please send the {paymentMethod === 'cash' ? 'shipping fee' : 'total amount'} to Instapay number: <span className="font-semibold">01020516108</span>
                  </p>
                </div>

                {/* Payment Proof Upload */}
                <div>
                  <label htmlFor="paymentProof" className="block text-sm font-medium text-gray-700">
                    Payment Proof
                  </label>
                  <input
                    type="file"
                    id="paymentProof"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                    className="mt-1 block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-pink-50 file:text-pink-700
                      hover:file:bg-pink-100"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
            {renderOrderSummary()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckOut

