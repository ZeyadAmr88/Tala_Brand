"use client"

import axios from "axios"
import { useFormik } from "formik"
import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import * as Yup from "yup"
import "@fortawesome/fontawesome-free/css/all.min.css"
import { UserContext } from "../Context/UserContext"
import { CartContext } from "../Context/CartContext"

export default function Login() {
  const { setUserData } = useContext(UserContext)
  const { getCartItems, createCart } = useContext(CartContext)

  const [apiError, setApiError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()


  async function handleLogin(values) {

    try {
      setLoading(true);
      const { data } = await axios.post(`https://tala-store.vercel.app/auth/signin`, values);

      if (data.results.token) {
        localStorage.setItem("userToken", data.results.token);
        setUserData(data.results.token);
        console.log("Token saved", data.results.token);

        try {
          console.log(data);
          // const cartResponse = await getCartItems();

          // If cart is empty or undefined, create a new cart

          if (data.results.token){

            await createCart(data.results.token);
          }
        }
        catch (cartError) {
          console.error("Error fetching or creating cart:", cartError);
        }

        setTimeout(() => {
          navigate("/");
        }, 100);
      } else {
        console.log("Token not saved");
        setApiError("Login successful but no token received");
      }
    } catch (err) {
      console.error("Login error:", err);
      setApiError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }



  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Email is invalid").required("Email required"),
    password: Yup.string()
      .matches(/^[A-Z]\w{5,10}$/, "Password is invalid")
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
    <div className="pt-8 w-auto mt-20 ">
      <h2 className="text-3xl font-semibold text-center py-4 mt-5">Login Now...</h2>

      <form onSubmit={formik.handleSubmit} className="max-w-xl mx-auto">
        {apiError && (
          <div
            className="p-2 mb-4 mx-auto text-sm text-center w-fit text-red-800 rounded-lg bg-red-50 dark:text-red-400"
            role="alert"
          >
            {apiError}
          </div>
        )}

        <div className="mb-5">
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
            Your Email
          </label>
          <input
            type="email"
            id="email"
            onChange={formik.handleChange}
            value={formik.values.email}
            onBlur={formik.handleBlur}
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:border-gray-600 dark:text-black"
          />
          {formik.errors.email && formik.touched.email && (
            <div className="p-2 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:text-red-400" role="alert">
              {formik.errors.email}
            </div>
          )}
        </div>

        <div className="mb-5">
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
            Your Password
          </label>
          <input
            type="password"
            id="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:border-gray-600 dark:text-black"
          />
          {formik.errors.password && formik.touched.password && (
            <div className="p-2 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:text-red-400" role="alert">
              {formik.errors.password}
            </div>
          )}
        </div>

        {loading ? (
          <button
            type="button"
            className="text-white bg-[#ff42a0] hover:bg-pink-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            <i className="fas fa-spinner fa-spin-pulse"></i>
          </button>
        ) : (
          <button
            type="submit"
            className="text-white bg-[#ff42a0] hover:bg-pink-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Submit
          </button>
        )}
      </form>
    </div>
  )
}

