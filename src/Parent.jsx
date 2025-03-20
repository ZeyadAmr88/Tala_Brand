import axios from "axios";
import { useEffect, useState } from "react";

const Parent = () => {
    const [products, setProducts] = useState([]);

    async function getProducts() {
        try {
            const response = await axios.get('https://tala-store.vercel.app/product');
            console.log("API Response:", response.data); // تأكد من أن البيانات صحيحة
            setProducts(response.data.products || []); // ✅ تجنب الأخطاء عند عدم وجود بيانات
            console.log(response)
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }

    useEffect(() => {
        getProducts();
    }, []);

    return (
        <div className="container mx-auto py-8">
            <div className="flex flex-wrap -mx-4"> {/* ✅ تحسين التباعد بين العناصر */}
                {products.length > 0 ? (
                    products.map((product) => (
                        <div key={product.id || product._id} className="md:w-1/4 sm:w-1/2 w-full px-4 mb-6">
                            <div className="border rounded-lg shadow-md p-4 hover:shadow-lg transition-all">
                                <img
                                    src={product.defaultImage?.url || product.images?.[0]?.url || "https://via.placeholder.com/150"}
                                    alt={product.name || "Unnamed Product"}
                                    className="w-full h-48 object-cover rounded-lg"
                                />
                                <h3 className="mt-2 font-semibold text-lg">{product.name || "No Name"}</h3>
                                <h4 className="text-gray-600">{product.finalPrice ? `${product.finalPrice} EGP` : "Price not available"}</h4>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="w-full text-center text-gray-500">⏳ Loading products...</div>
                )}
            </div>
        </div>
    );
}

export default Parent;
