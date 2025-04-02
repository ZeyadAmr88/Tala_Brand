
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import toast from "react-hot-toast"
import { ArrowLeft, Upload, X } from "lucide-react"

const ProductForm = () => {


    const { id } = useParams()
    const navigate = useNavigate()
    const isEditMode = !!id

    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState([])

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        avaliableItems: "",
        soldItems: "0",
        category: "",
    })

    const [defaultImage, setDefaultImage] = useState(null)
    const [defaultImagePreview, setDefaultImagePreview] = useState("")

    const [subImages, setSubImages] = useState([])
    const [subImagesPreview, setSubImagesPreview] = useState([])

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`https://tala-store.vercel.app/category`)
                if (response.data.success) {
                    setCategories(response.data.categories || [])
                }
            } catch (error) {
                console.error("Error fetching categories:", error)
                toast.error("Failed to load categories")
            }
        }

        fetchCategories()
    }, [])

    useEffect(() => {
        if (isEditMode) {
            const fetchProduct = async () => {
                try {
                    setLoading(true)
                    const response = await axios.get(`https://tala-store.vercel.app/product/${id}`)

                    if (response.data.success) {
                        const product = response.data.product

                        setFormData({
                            name: product.name || "",
                            description: product.description || "",
                            price: product.price?.toString() || "",
                            avaliableItems: product.avaliableItems?.toString() || "",
                            category: product.category?.id || "",
                        })

                        if (product.defaultImage?.url) {
                            setDefaultImagePreview(product.defaultImage.url)
                        }

                        if (product.subImages && product.subImages.length > 0) {
                            setSubImagesPreview(product.subImages.map((img) => img.url))
                        }
                    } else {
                        toast.error("Failed to load product")
                        navigate("/products")
                    }
                } catch (error) {
                    console.error("Error fetching product:", error)
                    toast.error("Failed to load product")
                    navigate("/products")
                } finally {
                    setLoading(false)
                }
            }

            fetchProduct()
        }
    }, [id, isEditMode, navigate])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleDefaultImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setDefaultImage(file)
            setDefaultImagePreview(URL.createObjectURL(file))
        }
    }

    const handleSubImagesChange = (e) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files)
            setSubImages((prev) => [...prev, ...filesArray])

            const newPreviews = filesArray.map((file) => URL.createObjectURL(file))
            setSubImagesPreview((prev) => [...prev, ...newPreviews])
        }
    }

    const removeSubImage = (index) => {
        setSubImages((prev) => prev.filter((_, i) => i !== index))
        setSubImagesPreview((prev) => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.name || !formData.price || !formData.avaliableItems || !formData.category) {
            toast.error("Please fill all required fields")
            return
        }

        if (!isEditMode && !defaultImage) {
            toast.error("Please upload a default image")
            return
        }

        setLoading(true)

        try {
            const productFormData = new FormData()
            productFormData.append("name", formData.name)
            productFormData.append("description", formData.description)
            productFormData.append("price", formData.price)
            productFormData.append("avaliableItems", formData.avaliableItems)
            productFormData.append("category", formData.category)

            if (defaultImage) {
                productFormData.append("defaultImage", defaultImage)
            }

            subImages.forEach((image) => {
                productFormData.append("subImages", image)
            })



            let response
            if (isEditMode) {
                response = await axios.patch(`https://tala-store.vercel.app/product/${id}`, productFormData,{
                    headers: {
                        token: localStorage.getItem('userToken')
                    },
                })
            } else {
                response = await axios.post(`https://tala-store.vercel.app/product`, productFormData, {
                    headers: {
                        token: localStorage.getItem('userToken')
                    },
                })


            }

            if (response.data.success) {
                toast.success(isEditMode ? "Product updated successfully" : "Product created successfully")
                navigate("/products")
            } else {
                toast.error(response.data.message || "Operation failed")
            }
        } catch (error) {
            console.error("Error saving product:", error)
            toast.error("Failed to save product")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6 mt-24">
            <div className="flex items-center">
                <button
                    onClick={() => navigate("/products")}
                    className="mr-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-pink-700 bg-pink-100 hover:bg-pink-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Products
                </button>
                <h1 className="text-2xl font-semibold text-gray-900">{isEditMode ? "Edit Product" : "Add New Product"}</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg">
                <div className="p-6 border-b border-gray-200">
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        {/* Product Name */}
                        <div className="sm:col-span-4">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Product Name *
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    required
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="shadow-sm focus:ring-pink-500 focus:border-pink-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>
                        </div>

                        {/* Price */}
                        <div className="sm:col-span-2">
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                                Price *
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">EGP</span>
                                </div>
                                <input
                                    type="number"
                                    name="price"
                                    id="price"
                                    required
                                    min="0"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    className="focus:ring-pink-500 focus:border-pink-500 block w-full pl-7 sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="sm:col-span-6">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <div className="mt-1">
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={3}
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="shadow-sm focus:ring-pink-500 focus:border-pink-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>
                        </div>

                        {/* Category */}
                        <div className="sm:col-span-3">
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                                Category *
                            </label>
                            <div className="mt-1">
                                <select
                                    id="category"
                                    name="category"
                                    required
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="shadow-sm focus:ring-pink-500 focus:border-pink-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Inventory */}
                        <div className="sm:col-span-3">
                            <label htmlFor="avaliableItems" className="block text-sm font-medium text-gray-700">
                                Available Items *
                            </label>
                            <div className="mt-1">
                                <input
                                    type="number"
                                    name="avaliableItems"
                                    id="avaliableItems"
                                    required
                                    min="0"
                                    value={formData.avaliableItems}
                                    onChange={handleInputChange}
                                    className="shadow-sm focus:ring-pink-500 focus:border-pink-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>
                        </div>

                        

                        {/* Default Image */}
                        <div className="sm:col-span-6">
                            <label className="block text-sm font-medium text-gray-700">Default Image {!isEditMode && "*"}</label>
                            <div className="mt-1 flex items-center">
                                {defaultImagePreview ? (
                                    <div className="relative">
                                        <img
                                            src={defaultImagePreview || "/placeholder.svg"}
                                            alt="Default product"
                                            className="h-32 w-32 object-cover rounded-md"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setDefaultImage(null)
                                                setDefaultImagePreview("")
                                            }}
                                            className="absolute -top-2 -right-2 bg-red-100 rounded-full p-1 text-red-600 hover:bg-red-200"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex justify-center items-center h-32 w-32 border-2 border-gray-300 border-dashed rounded-md">
                                        <label htmlFor="default-image-upload" className="cursor-pointer">
                                            <div className="space-y-1 text-center">
                                                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                                                <div className="text-sm text-gray-600">
                                                    <span className="text-pink-600 hover:text-pink-500">Upload</span>
                                                </div>
                                            </div>
                                            <input
                                                id="default-image-upload"
                                                name="default-image-upload"
                                                type="file"
                                                accept="image/*"
                                                className="sr-only"
                                                onChange={handleDefaultImageChange}
                                            />
                                        </label>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sub Images */}
                        <div className="sm:col-span-6">
                            <label className="block text-sm font-medium text-gray-700">Additional Images</label>
                            <div className="mt-1">
                                <div className="flex flex-wrap gap-4">
                                    {subImagesPreview.map((preview, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={preview || "/placeholder.svg"}
                                                alt={`Product ${index + 1}`}
                                                className="h-24 w-24 object-cover rounded-md"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeSubImage(index)}
                                                className="absolute -top-2 -right-2 bg-red-100 rounded-full p-1 text-red-600 hover:bg-red-200"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}

                                    <div className="flex justify-center items-center h-24 w-24 border-2 border-gray-300 border-dashed rounded-md">
                                        <label htmlFor="sub-images-upload" className="cursor-pointer">
                                            <div className="space-y-1 text-center">
                                                <Upload className="mx-auto h-6 w-6 text-gray-400" />
                                                <div className="text-xs text-gray-600">
                                                    <span className="text-pink-600 hover:text-pink-500">Add</span>
                                                </div>
                                            </div>
                                            <input
                                                id="sub-images-upload"
                                                name="sub-images-upload"
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                className="sr-only"
                                                onChange={handleSubImagesChange}
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                    <button
                        type="button"
                        onClick={() => navigate("/products")}
                        className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 mr-3"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Saving..." : isEditMode ? "Update Product" : "Create Product"}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ProductForm

