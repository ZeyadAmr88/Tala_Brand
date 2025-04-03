
import  { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { ArrowLeft, Upload, X } from "lucide-react";

const CategoryForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");

    useEffect(() => {
        if (isEditMode) {
            const fetchCategory = async () => {
                try {
                    setLoading(true);
                    const response = await axios.get(`https://tala-store.vercel.app/category/${id}`);

                    if (response.data.success) {
                        const category = response.data.category;
                        setName(category.name || "");

                        if (category.image?.url) {
                            setImagePreview(category.image.url);
                        }
                    } else {
                        toast.error("Failed to load category");
                        navigate("/categories");
                    }
                } catch (error) {
                    console.error("Error fetching category:", error);
                    toast.error("Failed to load category");
                    navigate("/categories");
                } finally {
                    setLoading(false);
                }
            };
            fetchCategory();
        }
    }, [id, isEditMode, navigate]);

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name) {
            toast.error("Please enter a category name");
            return;
        }

        if (!isEditMode && !image) {
            toast.error("Please upload a category image");
            return;
        }

        setLoading(true);
        try {
            const categoryFormData = new FormData();
            categoryFormData.append("name", name);

            if (image) {
                categoryFormData.append("category", image);
            }

            let response;
            if (isEditMode) {
                response = await axios.patch(`https://tala-store.vercel.app/category/${id}`, categoryFormData, {
                    headers: {
                        
                            token: localStorage.getItem('userToken')
                        
                    },
                });
            } else {
                response = await axios.post(`https://tala-store.vercel.app/category`, categoryFormData, {
                    headers: {
                        token: localStorage.getItem('userToken')
                    },
                });
            }

            if (response.data.success) {
                toast.success(isEditMode ? "Category updated successfully" : "Category created successfully");
                navigate("/");
            } else {
                toast.error(response.data.message || "Operation failed");
            }
        } catch (error) {
            console.error("Error saving category:", error);
            toast.error("Failed to save category");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center">
                <button onClick={() => navigate("/categories")} className="mr-4 px-3 py-2 text-sm font-medium rounded-md text-pink-700 bg-pink-100 hover:bg-pink-200">
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back to Categories
                </button>
                <h1 className="text-2xl font-semibold">{isEditMode ? "Edit Category" : "Add New Category"}</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
                <label className="block text-sm font-medium">Category Name *</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="block w-full border rounded-md p-2 mt-1" />

                <label className="block text-sm font-medium mt-4">Category Image {!isEditMode && "*"}</label>
                <div className="mt-1">
                    {imagePreview ? (
                        <div className="relative">
                            <img src={imagePreview} alt="Category" className="h-32 w-32 object-cover rounded-md" />
                            <button onClick={() => { setImage(null); setImagePreview(""); }} className="absolute -top-2 -right-2 bg-red-100 rounded-full p-1 text-red-600">
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    ) : (
                        <label className="cursor-pointer border-2 border-dashed rounded-md p-4 block w-32 h-32 text-center">
                            <Upload className="mx-auto h-8 w-8 text-gray-400" />
                            <span className="text-sm text-gray-600">Upload</span>
                            <input type="file" accept="image/*" className="sr-only" onChange={handleImageChange} />
                        </label>
                    )}
                </div>

                <div className="mt-6 flex justify-end">
                    <button type="button" onClick={() => navigate("/categories")} className="py-2 px-4 border text-gray-700 bg-white hover:bg-gray-50 mr-3">Cancel</button>
                    <button type="submit" disabled={loading} className="py-2 px-4 text-white bg-pink-600 hover:bg-pink-700 disabled:opacity-50">
                        {loading ? "Saving..." : isEditMode ? "Update Category" : "Create Category"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CategoryForm;
