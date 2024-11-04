

import axios from "axios"
import { useFormik } from "formik"
import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import * as Yup from "yup"
import '@fortawesome/fontawesome-free/css/all.min.css';
import { UserContext } from "../Context/UserContext"



export default function Login() {

  let { setUserData } = useContext(UserContext)

  const [apiError, setApiError] = useState("")
  const [loading, setLoading] = useState(false)
  let Navigate = useNavigate()
  async function handleRegister(values) {
    try {
      setLoading(true)
      let { data } = await axios.post(`https://ecommerce.routemisr.com/api/v1/auth/signin`, values)
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
    email: Yup.string().email("Email is invalid").required(" Email required"),
    password: Yup.string().matches(/^[A-Z]\w{5,10}$/, 'password is invalid').required('Password is required'),
  })
  let formik = useFormik({
    initialValues: {

      email: "",
      password: "",

    },
    validationSchema: validationSchema
    , onSubmit: handleRegister
  })
  return (


    <div className="pt-8 w-auto ">
      <h2 className="text-3xl font-semibold text-center py-4 mt-5">Login Now...</h2>

      <form onSubmit={formik.handleSubmit} className="max-w-xl mx-auto">
        {apiError && <div className="p-2 mb-4 mx-auto text-sm text-center w-fit   text-red-800 rounded-lg bg-red-50 dark:text-red-400" role="alert">
          {apiError}
        </div>}
        <div className="mb-5">

          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Your Email</label>
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



        {loading ? <button type="button" className="text-white bg-emerald-500 hover:bg-emerald-800   font-medium rounded-lg text-sm px-5 py-2.5 text-center">
          <i className="fas fa-spinner fa-spin-pulse"></i>
        </button> : <button type="submit" className="text-white bg-emerald-500 hover:bg-emerald-800   font-medium rounded-lg text-sm px-5 py-2.5 text-center">Submit</button>
        }


      </form>
    </div>


  )
}
