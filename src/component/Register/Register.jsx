
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
  // eslint-disable-next-line no-unused-vars
  const [registrationSuccess, setRegistrationSuccess] = useState(false)
  const navigate = useNavigate()

  // For debugging navigation issues




  async function handleRegister(values) {
    try {
      setLoading(true);
      setApiError("");

      const { data } = await axios.post(`https://tala-store.vercel.app/auth/signup`, values);
      console.log("test", data);
      navigate("/"); console.log("navigate")

      localStorage.setItem("userToken", data.results.token);
      setUserData(data.results.token);
      setRegistrationSuccess(true);
      setTimeout(() => {
      }, 100);
      
    } catch (err) {
      setApiError(err.response?.data?.message);
      setRegistrationSuccess(false);
      console.log(err)
    } finally {
      setLoading(false);
    }
  }



  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, "Minimum length is 3 characters")
      .max(15, "Maximum length is 15 characters")
      .required("Name is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string()
      .matches(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,11}$/, "Password must contain at least one uppercase letter and one digit, and be 6-11 characters long")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords do not match")
      .required("Confirming password is required"),
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
    <div className="pt-8 w-full px-4 mt-20">

      <form onSubmit={formik.handleSubmit} className="bg-white shadow-xl rounded-2xl max-w-xl mx-auto p-8 space-y-6 ">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-10">Register Now</h2>
        <p className="text-center">Sign up to your Tala Brand account to access your profile and orders</p>
        {apiError && (
          <div
            className="p-3 text-sm text-center text-red-800 bg-red-100 border border-red-300 rounded-lg"
            role="alert"
          >
            {apiError}
          </div>
        )}

        {/* Name */}
        <div>
          <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">
            User Name
          </label>
          <input
            type="text"
            id="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
          {formik.errors.name && formik.touched.name && (
            <div className="mt-2 text-sm text-red-600">{formik.errors.name}</div>
          )}
        </div>

        {/* Email */}
        <div className="">
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
            Your Email
          </label>
          <input
            type="email"
            id="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
          {formik.errors.email && formik.touched.email && (
            <div className="mt-2 text-sm text-red-600">{formik.errors.email}</div>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
            Your Password
          </label>
          <input
            type="password"
            id="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
          {formik.errors.password && formik.touched.password && (
            <div className="mt-2 text-sm text-red-600">{formik.errors.password}</div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-700">
            Repeat Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
          {formik.errors.confirmPassword && formik.touched.confirmPassword && (
            <div className="mt-2 text-sm text-red-600">{formik.errors.confirmPassword}</div>
          )}
        </div>

        {/* Submit Button */}
        <div className="text-center">
          {loading ? (
            <button
              type="button"
              className="inline-flex items-center justify-center px-6 py-2.5 text-white bg-pink-500 rounded-lg text-sm font-medium hover:bg-pink-600 focus:ring-4 focus:ring-pink-300"
            >
              <i className="fas fa-spinner fa-spin-pulse mr-2"></i> Loading...
            </button>
          ) : (
            <button
              type="submit"
              className="inline-block w-full px-6 py-2.5 text-white bg-pink-500 rounded-lg text-sm font-medium hover:bg-pink-600 focus:ring-4 focus:ring-pink-300"
            >
              Submit
            </button>
          )}
        </div>
      </form>
    </div>
  );

}