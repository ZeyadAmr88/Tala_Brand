import RecentProducts from "../RecentProducts/RecentProducts";
import Loader from "../Loader/Loader";
import useProducts from "../../Hooks/useProducts";


export default function Home() {
  let { data, isLoading } = useProducts();

  return (
    <>
      {!isLoading ? (
        <div className="px-4 sm:px-8 md:px-12">
          {/* <MainSlider />
          <CategoriesSlider /> */}

          {/* Responsive Grid for Products */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-16">
            {data?.map((product, index) => (
              <RecentProducts products={product} key={index} />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <Loader />
        </div>
      )}
    </>
  );
}
