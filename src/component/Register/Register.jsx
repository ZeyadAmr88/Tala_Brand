"use client"

import axios from "axios"
import { useFormik } from "formik"
import { useContext, useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import * as Yup from "yup"
import "@fortawesome/fontawesome-free/css/all.min.css"
import { UserContext } from "../Context/UserContext"

export default function Register() {
  const { setUserData } = useContext(UserContext)
  const [apiError, setApiError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const navigate = useNavigate()

  async function handleRegister(values) {
    try {
      setLoading(true)
      setApiError("")

      const { data } = await axios.post(`https://tala-store.vercel.app/auth/signup`, values)
      localStorage.setItem("userToken", data.results.token)
      setUserData(data.results.token)

      navigate("/")
    } catch (err) {
      setApiError(err.response?.data?.message)
    } finally {
      setLoading(false)
    }
  }

  // Password strength checker
  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    setPasswordStrength(strength);
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, "Name must be at least 3 characters")
      .max(20, "Name must be less than 20 characters")
      .required("Full name is required"),
    email: Yup.string()
      .email("Please enter a valid email address")
      .required("Email address is required"),
    password: Yup.string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W]{8,}$/,
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number"
      )
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords do not match")
      .required("Please confirm your password"),
  })

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: handleRegister,
  })
  
  // Update password strength when password changes - moved after formik initialization
  useEffect(() => {
    if (formik.values.password) {
      checkPasswordStrength(formik.values.password);
    } else {
      setPasswordStrength(0);
    }
  }, [formik.values.password]);

  // Password strength indicator component
  const PasswordStrengthIndicator = ({ strength }) => {
    const getColor = (level) => {
      if (strength >= level) {
        switch (strength) {
          case 1: return 'bg-red-500';
          case 2: return 'bg-orange-500';
          case 3: return 'bg-yellow-500';
          case 4: return 'bg-blue-500';
          case 5: return 'bg-green-500';
          default: return 'bg-gray-200';
        }
      }
      return 'bg-gray-200';
    };

    const getStrengthText = () => {
      switch (strength) {
        case 0: return '';
        case 1: return 'Very Weak';
        case 2: return 'Weak';
        case 3: return 'Medium';
        case 4: return 'Strong';
        case 5: return 'Very Strong';
        default: return '';
      }
    };

    const getStrengthTextColor = () => {
      switch (strength) {
        case 1: return 'text-red-500';
        case 2: return 'text-orange-500';
        case 3: return 'text-yellow-600';
        case 4: return 'text-blue-500';
        case 5: return 'text-green-500';
        default: return 'text-gray-500';
      }
    };

    return (
      <div className="mt-2">
        <div className="flex space-x-1 mb-1">
          {[1, 2, 3, 4, 5].map((level) => (
            <div 
              key={level}
              className={`h-1.5 w-1/5 rounded-full ${getColor(level)}`}
            ></div>
          ))}
        </div>
        <p className={`text-xs ${getStrengthTextColor()}`}>{getStrengthText()}</p>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-xl rounded-xl border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
          <p className="text-gray-600 mb-6">Join Tala Brand's community today and enjoy exclusive offers</p>
        </div>

        {apiError && (
          <div className="p-3 text-sm text-red-800 bg-red-50 text-center rounded-lg border-l-4 border-red-500 animate-pulse">
            <i className="fas fa-exclamation-circle mr-2"></i>
            {apiError}
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              <i className="fas fa-user mr-2 text-pink-500"></i>Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                id="name"
                placeholder="Your Name"
                {...formik.getFieldProps("name")}
                className={`w-full p-3 pl-4 border ${formik.touched.name && formik.errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition-all duration-200 bg-gray-50`}
              />
              {formik.touched.name && !formik.errors.name && (
                <span className="absolute right-3 top-3 text-green-500">
                  <i className="fas fa-check-circle"></i>
                </span>
              )}
            </div>
            {formik.errors.name && formik.touched.name && (
              <p className="mt-1 text-sm text-red-600">
                <i className="fas fa-exclamation-circle mr-1"></i>
                {formik.errors.name}
              </p>
            )}
          </div>

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
              {formik.values.password && !formik.errors.password && (
                <span className="absolute right-10 top-3 text-green-500">
                  <i className="fas fa-check-circle"></i>
                </span>
              )}
            </div>
            {formik.errors.password && formik.touched.password && (
              <p className="mt-1 text-sm text-red-600">
                <i className="fas fa-exclamation-circle mr-1"></i>
                {formik.errors.password}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Example: At least 6 characters, including one uppercase letter.
            </p>
            <PasswordStrengthIndicator strength={passwordStrength} />
            {formik.values.password && !formik.errors.password && (
              <div className="mt-2 text-xs text-gray-600">
                <p className="flex items-center">
                  <i className={`fas fa-check mr-1 ${/[A-Z]/.test(formik.values.password) ? 'text-green-500' : 'text-gray-400'}`}></i>
                  <span>One uppercase letter</span>
                </p>
                <p className="flex items-center">
                  <i className={`fas fa-check mr-1 ${/[a-z]/.test(formik.values.password) ? 'text-green-500' : 'text-gray-400'}`}></i>
                  <span>One lowercase letter</span>
                </p>
                <p className="flex items-center">
                  <i className={`fas fa-check mr-1 ${/\d/.test(formik.values.password) ? 'text-green-500' : 'text-gray-400'}`}></i>
                  <span>One number</span>
                </p>
                <p className="flex items-center">
                  <i className={`fas fa-check mr-1 ${formik.values.password.length >= 8 ? 'text-green-500' : 'text-gray-400'}`}></i>
                  <span>At least 8 characters</span>
                </p>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              <i className="fas fa-shield-alt mr-2 text-pink-500"></i>Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                placeholder="••••••••"
                {...formik.getFieldProps("confirmPassword")}
                className={`w-full p-3 pl-4 border ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition-all duration-200 bg-gray-50 pr-10`}
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
              {formik.values.confirmPassword && formik.values.password === formik.values.confirmPassword && !formik.errors.confirmPassword && (
                <span className="absolute right-10 top-3 text-green-500">
                  <i className="fas fa-check-circle"></i>
                </span>
              )}
            </div>
            {formik.errors.confirmPassword && formik.touched.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                <i className="fas fa-exclamation-circle mr-1"></i>
                {formik.errors.confirmPassword}
              </p>
            )}
          </div>

          <div className="flex items-center mt-2">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              className="h-4 w-4 text-pink-500 border-gray-300 rounded focus:ring-pink-500"
              required
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
              I agree to the <a href="#" className="text-pink-600 hover:text-pink-500">Terms of Service</a> and <a href="#" className="text-pink-600 hover:text-pink-500">Privacy Policy</a>
            </label>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 mt-4">
            <h3 className="text-blue-800 font-medium text-sm mb-1">Why create an account?</h3>
            <ul className="text-xs text-blue-700 list-disc pl-4 space-y-1">
              <li>Access exclusive Tala Brand products and collections</li>
              <li>Save your favorite items for later</li>
              <li>Track your orders and delivery status</li>
              <li>Receive personalized recommendations based on your preferences</li>
              <li>Get early access to sales and special promotions</li>
            </ul>
          </div>

          <button
            type="submit"
            className={`w-full px-5 py-3 text-white bg-pink-500 rounded-lg font-medium text-base shadow-md transition-all duration-200 ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-pink-600 hover:shadow-lg transform hover:-translate-y-0.5"}`}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <i className="fas fa-spinner fa-spin mr-2"></i> Creating account...
              </span>
            ) : (
              "Create Account"
            )}
          </button>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-pink-600 hover:text-pink-500">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
