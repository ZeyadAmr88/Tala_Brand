"use client"

import axios from "axios"
import { useFormik } from "formik"
import { useContext, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import * as Yup from "yup"
import "@fortawesome/fontawesome-free/css/all.min.css"
import { UserContext } from "../Context/UserContext"
import { CartContext } from "../Context/CartContext"

export default function Login() {
  const { setUserData } = useContext(UserContext)
  const { createCart } = useContext(CartContext)

  const [apiError, setApiError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  async function handleLogin(values) {
    try {
      setLoading(true);
      const { data } = await axios.post(`https://tala-store.vercel.app/auth/signin`, values);
      console.log("🟡 API Response:", data); // أطبع الـ response بالكامل
      console.log("🟢 data.results:", data.results);
      

      if (data.results.token) {
        localStorage.setItem("userToken", data.results.token);
        localStorage.setItem("userRole", data.role); // ✅ نحفظ الدور في localStorage

        setUserData({
          token: data.results.token,
          role: data.role, // ✅ نحدث الـ context بالدور كمان
        });

        try {
          await createCart(data.results.token);
        } catch (cartError) {
          console.error("Error fetching or creating cart:", cartError);
        }

        setTimeout(() => {
          navigate("/");
        }, 100);
      
      } else {
        setApiError("Login successful but no token received");
      }
    } catch (err) {
      setApiError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Please enter a valid email address")
      .required("Email address is required"),
    password: Yup.string()
      .required("Password is required"),
  })

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: handleLogin,
  })
 
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-xl rounded-xl border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600 mb-6">Sign in to your Tala Brand account to access your profile and orders</p>
        </div>

        {apiError && (
          <div className="p-3 text-sm text-red-800 bg-red-50 text-center rounded-lg border-l-4 border-red-500 animate-pulse">
            <i className="fas fa-exclamation-circle mr-2"></i>
            {apiError}
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              <i className="fas fa-envelope mr-2 text-pink-500"></i>Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                placeholder="your.email@example.com"
                {...formik.getFieldProps("email")}
                className={`w-full p-3 pl-4 border ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition-all duration-200 bg-gray-50`}
              />
              {formik.touched.email && !formik.errors.email && (
                <span className="absolute right-3 top-3 text-green-500">
                  <i className="fas fa-check-circle"></i>
                </span>
              )}
            </div>
            {formik.errors.email && formik.touched.email && (
              <p className="mt-1 text-sm text-red-600">
                <i className="fas fa-exclamation-circle mr-1"></i>
                {formik.errors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              <i className="fas fa-lock mr-2 text-pink-500"></i>Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="••••••••"
                {...formik.getFieldProps("password")}
                className={`w-full p-3 pl-4 border ${formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition-all duration-200 bg-gray-50 pr-10`}
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
            {formik.errors.password && formik.touched.password && (
              <p className="mt-1 text-sm text-red-600">
                <i className="fas fa-exclamation-circle mr-1"></i>
                {formik.errors.password}
              </p>
            )}
          </div>

          
          <button
            type="submit"
            className={`w-full px-5 py-3 text-white bg-pink-500 rounded-lg font-medium text-base shadow-md transition-all duration-200 ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-pink-600 hover:shadow-lg transform hover:-translate-y-0.5"}`}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <i className="fas fa-spinner fa-spin mr-2"></i> Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="font-medium text-pink-600 hover:text-pink-500">
                Sign up now
              </Link>
            </p>
          </div>
          
          <div className="bg-pink-50 p-4 rounded-lg border-l-4 border-pink-500 mt-4">
            <h3 className="text-pink-800 font-medium text-sm mb-1">Secure Login</h3>
            <p className="text-xs text-pink-700 mb-2">Your security is important to us. Please ensure:</p>
            <ul className="text-xs text-pink-700 list-disc pl-4 space-y-1">
              <li>You're on the official Tala Brand website</li>
              <li>Your password contains at least 8 characters with uppercase, lowercase, and numbers</li>
              <li>You don't share your login credentials with others</li>
              <li>You log out when using shared devices</li>
            </ul>
          </div>
          

        </form>
      </div>
    </div>
  )
}