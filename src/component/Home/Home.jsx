import { Fragment, } from "react"
import RecentProducts from "../RecentProducts/RecentProducts"
import Loader from "../Loader/Loader"
import CategoriesSlider from "../Sliders/CategoriesSlider"
import MainSlider from "../Sliders/MainSlider"
import useProducts from "../../Hooks/useProducts"


export default function Home() {
  // const [products, setProducts] = useState([])

  // async function getRecentProducts() {
  //   try {
  //     let { data } = await axios.get(`https://ecommerce.routemisr.com/api/v1/products`)

  //     setProducts(data.data)

  //   } catch (error) {
  //     console.log(error)

  //   }

  // }
  // useEffect(() => {
  //   getRecentProducts()
  // }, [])


  let { data, isLoading } = useProducts()


  return (
    <>


      {!isLoading ?

        <Fragment className="px-15">
          <MainSlider />
          <CategoriesSlider />

          <div className="flex flex-wrap justify-center py-16 mx-20">
            {data?.map((products, index) => < RecentProducts products={products} key={index} />)}
          </div>
        </Fragment> : <div className="flex justify-center text-center">
          <Loader /></div>}


    </>

  )
}
