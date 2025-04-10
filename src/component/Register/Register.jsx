
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
    <div className="pt-8 w-auto">
      <h2 className="text-3xl font-semibold text-center py-4 mt-20">Register Now...</h2>

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
          <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
            User Name
          </label>
          <input
            type="text"
            id="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 mb-4"
          />
          {formik.errors.name && formik.touched.name && (
            <div className="p-2 mb-4 text-sm text-red-800 rounded-lg bg-red-50">{formik.errors.name}</div>
          )}
        </div>

        <div className="mb-5">
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
            Your Email
          </label>
          <input
            type="email"
            id="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          />
          {formik.errors.email && formik.touched.email && (
            <div className="p-2 mb-4 text-sm text-red-800 rounded-lg bg-red-50">{formik.errors.email}</div>
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
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          />
          {formik.errors.password && formik.touched.password && (
            <div className="p-2 mb-4 text-sm text-red-800 rounded-lg bg-red-50">{formik.errors.password}</div>
          )}
        </div>

        <div className="mb-5">
          <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
            Repeat Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          />
          {formik.errors.confirmPassword && formik.touched.confirmPassword && (
            <div className="p-2 mb-4 text-sm text-red-800 rounded-lg bg-red-50">{formik.errors.confirmPassword}</div>
          )}
        </div>

        {loading ? (
          <button
            type="button"
            className="text-white bg-[#ff42a0] hover:bg-pink-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            <i className="fas fa-spinner fa-spin-pulse"></i>
          </button>
        ) : (
          <button
            type="submit"
            className="text-white bg-[#ff42a0] hover:bg-pink-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Submit
          </button>
        )}
      </form>
    </div>
  )
}