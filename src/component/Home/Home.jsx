"use client";
import RecentProducts from "../RecentProducts/RecentProducts";
import Loader from "../Loader/Loader";
import useProducts from "../../Hooks/useProducts";
import Welcome from "./Welcome";
import CategorySlideshow from "../Category/category-slideshow";

export default function Home() {
  let { data, isLoading } = useProducts();
  const products = Array.isArray(data) ? data : [];

  return (
    <main className="min-h-screen">
      <Welcome />

      <section className="pt-[100vh] px-4 sm:px-8 md:px-12 ">
        {/* <div className="text-center text-3xl  ">
          Discover our exclusive collection of fashion accessories and <span className="text-red-400 font-bold font-serif">clothing</span>

        </div> */}
        <CategorySlideshow />
        {!isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-16">
            {products.map((product) => (
              <RecentProducts product={product} key={product._id} />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-screen">
            <Loader />
          </div>
        )}
      </section>
    </main>
  );
}
