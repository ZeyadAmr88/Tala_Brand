
import { useFormik } from "formik"
import { useContext,  } from "react"

import '@fortawesome/fontawesome-free/css/all.min.css';
import { CartContext } from "../Context/CartContext"




export default function CheckOut() {

    let { checkOutSession } = useContext(CartContext)





    async function checkout(values) {
        let response = await checkOutSession(values)

        if (response.status=='success') {
            window.location.href = response.session.url
            
        }

    }




    let formik = useFormik({
        initialValues: {

            details: "",
            phone: "",
            city: ""

        },

        onSubmit: checkout
    })
    return (


        <div className="pt-8 w-auto">
            <h2 className="text-3xl font-semibold text-center py-4">CheckOut Now...</h2>

            <form onSubmit={formik.handleSubmit} className="max-w-xl mx-auto">

                <div className="mb-5 ">

                    <label htmlFor="details" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Your Details</label>
                    <input type="text" id="details" onChange={formik.handleChange} value={formik.values.details} onBlur={formik.handleBlur} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 dark:border-gray-600  dark:text-black0 dark:shadow-sm-light" />

                </div>

                <div className="mb-5">
                    <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Your Phone</label>
                    <input type="tel" id="phone" value={formik.values.phone} onChange={formik.handleChange} onBlur={formik.handleBlur} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" />

                </div>
                <div className="mb-5">
                    <label htmlFor="city" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Your City</label>
                    <input type="text" id="city" value={formik.values.city} onChange={formik.handleChange} onBlur={formik.handleBlur} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" />

                </div>



                <button type="submit" className="text-white bg-emerald-500 hover:bg-emerald-800   font-medium rounded-lg text-sm px-5 py-2.5 text-center">Submit</button>



            </form>
        </div>


    )
}

