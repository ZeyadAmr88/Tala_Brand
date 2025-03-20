import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function useProducts() {
    const getProducts = async () => {
        const response = await axios.get(`https://tala-store.vercel.app/product`);
        return response.data.products;  // ✅ استخراج قائمة المنتجات مباشرة
    };

    return useQuery({
        queryKey: ['recentProduct'],
        queryFn: getProducts,
    });
}
