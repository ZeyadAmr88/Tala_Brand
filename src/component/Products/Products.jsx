import { Fragment } from "react";
import Loader from "../Loader/Loader";
import RecentProducts from "../RecentProducts/RecentProducts";

import useProducts from "../../Hooks/useProducts";



export default function Products() {
  let { data, isLoading } = useProducts()
  return (
    <>
      {!isLoading ?

        <Fragment className="px-15">


          <div className="flex flex-wrap justify-center py-16 mx-20">
            {data?.map((products, index) => < RecentProducts products={products} key={index} />)}
          </div>
        </Fragment> : <div className="flex justify-center text-center">
          <Loader /></div>}</>
  )
}
