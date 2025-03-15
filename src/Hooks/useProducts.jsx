import { useQuery } from "@tanstack/react-query"
import axios from "axios"

export default function useProducts() {

    const getProducts = () => {
        return axios.get(`https://ecommerce.routemisr.com/api/v1/products`)

    }

    let response = useQuery({
        queryKey: ['recentProduct'],
        queryFn: getProducts,
        select: (data) => data?.data.data,
    })
    return response


}
