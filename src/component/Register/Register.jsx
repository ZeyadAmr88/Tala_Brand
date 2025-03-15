import axios from "axios"
import { useFormik } from "formik"
import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import * as Yup from "yup"
import '@fortawesome/fontawesome-free/css/all.min.css';
import { UserContext } from "../Context/UserContext"


export default function Register() {
  let { setUserData } = useContext(UserContext)
  const [apiError, setApiError] = useState("")
  const [loading, setLoading] = useState(false)
  let Navigate = useNavigate()
  async function handleRegister(values) {
    try {
      setLoading(true)
      let { data } = await axios.post(`https://ecommerce.routemisr.com/api/v1/auth/signup`, values)
      console.log(data);
      localStorage.setItem('userToken', data.token)
      Navigate('/')
      setUserData(data.token)
      setLoading(false)
    } catch (err) {
      console.log(err.response.data.message)
      setApiError(err.response.data.message)
      setLoading(false)
    };

  }


  let validationSchema = Yup.object().shape({
    name: Yup.string().min(3, 'min length is 3').max(15).required("Name is required"),
    email: Yup.string().email("email is invalid").required(" Email required"),
    password: Yup.string().matches(/^[A-Z]\w{5,10}$/, 'password is invalid').required('Password is required'),
    rePassword: Yup.string().oneOf([Yup.ref('password')], "password don't match").required("Password is required"),
    phone: Yup.string().matches(/^01[0-2,5]{1}[0-9]{8}$/, 'invalid phone').required('phone is required ')
  })
  let formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      phone: ""
    },
    validationSchema: validationSchema
    , onSubmit: handleRegister
  })
  return (


    <div className="pt-8 w-auto">
      <h2 className="text-3xl font-semibold text-center py-4">Register Now...</h2>

      <form onSubmit={formik.handleSubmit} className="max-w-xl mx-auto">
        {apiError && <div className="p-2 mb-4 mx-auto text-sm text-center w-fit   text-red-800 rounded-lg bg-red-50 dark:text-red-400" role="alert">
          {apiError}
        </div>}
        <div className="mb-5">
          <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">User Name</label>
          <input type="text" id="name" value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 dark:border-gray-600  dark:text-black dark:shadow-sm-light mb-4" />

          {formik.errors.name && formik.touched.name && <div className="p-2 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:text-red-400" role="alert">
            {formik.errors.name}
          </div>}
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Your email</label>
          <input type="email" id="email" onChange={formik.handleChange} value={formik.values.email} onBlur={formik.handleBlur} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 dark:border-gray-600  dark:text-black0 dark:shadow-sm-light" />
          {formik.errors.email && formik.touched.email && <div className="p-2 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:text-red-400" role="alert">
            {formik.errors.email}
          </div>}
        </div>

        <div className="mb-5">
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Your password</label>
          <input type="password" id="password" value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" />
          {formik.errors.password && formik.touched.password && <div className="p-2 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:text-red-400" role="alert">
            {formik.errors.password}
          </div>}
        </div>
        <div className="mb-5">
          <label htmlFor="rePassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"> Repeat password</label>
          <input type="password" id="rePassword" value={formik.values.rePassword} onChange={formik.handleChange} onBlur={formik.handleBlur} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" />
          {formik.errors.rePassword && formik.touched.rePassword && <div className="p-2 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:text-red-400" role="alert">
            {formik.errors.rePassword}
          </div>}
        </div>

        <div className="mb-5">
          <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Phone</label>
          <input type="tel" id="phone" value={formik.values.phone} onChange={formik.handleChange} onBlur={formik.handleBlur} className="shadow-sm bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" />
          {formik.errors.phone && formik.touched.phone && <div className="p-2 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:text-red-400" role="alert">
            {formik.errors.phone}
          </div>}
        </div>
        {loading ? <button type="button" className="text-white bg-emerald-500 hover:bg-emerald-800   font-medium rounded-lg text-sm px-5 py-2.5 text-center">
          <i className="fas fa-spinner fa-spin-pulse"></i>
        </button> : <button type="submit" className="text-white bg-emerald-500 hover:bg-emerald-800   font-medium rounded-lg text-sm px-5 py-2.5 text-center">Submit</button>
        }


      </form>
    </div>


  )
}
