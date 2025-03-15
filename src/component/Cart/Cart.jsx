import { useContext, useEffect, useState } from "react"
import { CartContext } from "../Context/CartContext"
import Loader from "../Loader/Loader"
import { Link } from "react-router-dom"



export default function Cart() {
  let { getCartItems, updateProductCount, deleteProduct } = useContext(CartContext)
  const [cart, setCart] = useState(null)

  async function getCart() {
    let { data } = await getCartItems()
    setCart(data)

  }
  async function updateCart(productId, count) {
    if (count > 1) {

      let { data } = await updateProductCount(productId, count)
      setCart(data)

    } else {
      deleteCartProduct(productId)
    }

  }
  async function deleteCartProduct(productId) {
    let { data } = await deleteProduct(productId)
    setCart(data)

  }
  useEffect(() => {
    getCart()
  }, [])

  return (

    <>
      {cart ? <div className="relative overflow-x-auto  w-3/4 mx-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400" >
          <thead className="text-xs text-gray-700 uppercase bg-gray-50  dark:text-gray-900    ">
            <tr>
              <th scope="col" className="px-16 py-3">
                <span className="sr-only">Image</span>
              </th>
              <th scope="col" className="px-6 py-3">
                Product
              </th>
              <th scope="col" className="px-6 py-3">
                Qty
              </th>
              <th scope="col" className="px-6 py-3">
                Price
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {cart?.products.map((products) => {
              return (
                <tr key={products.product.id} className="bg-white border-b  hover:bg-gray-100 text-black">
                  <td className="p-4">
                    <img src={products.product.imageCover} className="w-16 md:w-32 max-w-full max-h-full" alt="Apple Watch" />
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900 ">
                    {products.product.title}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <button onClick={() => updateCart(products.product.id, products.count - 1)} className="inline-flex items-center justify-center p-1 me-3 text-sm font-medium h-6 w-6 text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100   dark:text-gray-400 dark:border-gray-200 dark:hover:bg-gray-100 dark:hover:border-gray-600 " type="button">
                        <span className="sr-only">Quantity button</span>
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1 1h16" />
                        </svg>
                      </button>
                      <div>
                        <span>{products.count}</span>
                      </div>
                      <button onClick={() => updateCart(products.product.id, products.count + 1)} className="inline-flex items-center justify-center h-6 w-6 p-1 ms-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100  dark:text-gray-400 dark:border-gray-200 dark:hover:bg-gray-100 dark:hover:border-gray-600 " type="button">
                        <span className="sr-only">Quantity button</span>
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 1v16M1 9h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900 ">
                    {products.price} EGP
                  </td>
                  <td className="">
                    <button onClick={() => deleteCartProduct(products.product.id)} className="text-red-600 hover:text-red-900 ">Remove</button>
                  </td>
                </tr>
              )

            })}

          </tbody>
        </table >
        <div className="flex justify-between px-8 py-2 my-5">
          <span>
            Total Cart Price
          </span>
          <span >
            {cart.totalCartPrice} EGP
          </span>
        </div>
        <button className="btn w-fit bg-main flex mx-auto text-center p-2 text-white rounded-md py-1 "><Link to={'/checkout'}>Check Out</Link> </button>
      </div> : <div className="flex justify-center text-center mt-7">
        <Loader /></div>}
    </>





  )
}

