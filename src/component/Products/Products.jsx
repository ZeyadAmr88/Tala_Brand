import Loader from "../Loader/Loader";
import RecentProducts from "../RecentProducts/RecentProducts";
import useProducts from "../../Hooks/useProducts";

export default function Products() {
  let { data, isLoading } = useProducts();

  return (
    <>
      {!isLoading ? (
        <div className="px-4 sm:px-8 md:px-12">
          <h1 className="text-2xl font-bold text-center my-6 text-main">All Products</h1>

          {/* Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-10">
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
