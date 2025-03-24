"use client"

import axios from "axios"
import { useFormik } from "formik"
import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import * as Yup from "yup"
import "@fortawesome/fontawesome-free/css/all.min.css"
import { UserContext } from "../Context/UserContext"

export default function Register() {
  const { setUserData } = useContext(UserContext)
  const [apiError, setApiError] = useState("")
  const [loading, setLoading] = useState(false)
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

  const validationSchema = Yup.object().shape({
    name: Yup.string().min(3, "Minimum length is 3 characters").max(15, "Maximum length is 15 characters").required("Name is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string().matches(/^[A-Z]\w{5,10}$/, "Password must start with an uppercase letter and be 6-11 characters long").required("Password is required"),
    confirmPassword: Yup.string().oneOf([Yup.ref("password")], "Passwords do not match").required("Confirming password is required"),
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg">
        <h2 className="text-3xl font-semibold text-center text-gray-900">Register Now</h2>

        {apiError && (
          <div className="p-2 text-sm text-red-800 bg-red-50 text-center rounded-lg">{apiError}</div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-900">
              User Name
            </label>
            <input
              type="text"
              id="name"
              {...formik.getFieldProps("name")}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-pink-200"
            />
            {formik.errors.name && formik.touched.name && (
              <p className="text-sm text-red-600">{formik.errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900">
              Your Email
            </label>
            <input
              type="email"
              id="email"
              {...formik.getFieldProps("email")}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-pink-200"
            />
            {formik.errors.email && formik.touched.email && (
              <p className="text-sm text-red-600">{formik.errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-900">
              Your Password
            </label>
            <input
              type="password"
              id="password"
              {...formik.getFieldProps("password")}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-pink-200"
            />
            {formik.errors.password && formik.touched.password && (
              <p className="text-sm text-red-600">{formik.errors.password}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900">
              Repeat Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              {...formik.getFieldProps("confirmPassword")}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-pink-200"
            />
            {formik.errors.confirmPassword && formik.touched.confirmPassword && (
              <p className="text-sm text-red-600">{formik.errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            className={`w-full px-5 py-2 text-white bg-pink-500 rounded-lg ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-pink-600"
              }`}
            disabled={loading}
          >
            {loading ? <i className="fas fa-spinner fa-spin"></i> : "Submit"}
          </button>
        </form>
      </div>
    </div>
  )
}
