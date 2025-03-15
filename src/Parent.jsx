import axios from "axios";
import { useEffect, useState } from "react";

const Parent = () => {
    const [products, setProducts] = useState();

    async function getproducts() {

        let { data } = await axios.get('https://fakestoreapi.com/products')
        setProducts(data)
        console.log(data)
    }
    useEffect(() => {
        getproducts();
    }, [])
    return (
        <>
            <div className="container mx-auto py-8">
                <div className="flex flex-wrap ">
                    {products.map((product) => <div key = {product.id}className="w-1/4">
                        <div>
                            <img src={product.image} alt="" className="w-full p-8" />
                            <h3>{product.title}</h3>
                            <h4>{product.price}</h4>
                        </div>
                    </div>)}

                </div>
            </div>
        </>
    )
}
export default Parent;