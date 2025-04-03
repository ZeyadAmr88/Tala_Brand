
import  { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Plus, Search, Edit, Trash2 } from "lucide-react";

const ManageCategory = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    // eslint-disable-next-line no-unused-vars
    const [totalPages, setTotalPages] = useState(1);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchTerm) params.append("search", searchTerm);
            params.append("page", currentPage.toString());

            const response = await axios.get(`https://tala-store.vercel.app/category?${params.toString()}`);

            if (response.data.success) {
                setCategories(response.data.categories || []);
                setTotalPages(response.data.totalPages || Math.ceil(response.data.totalCount / 10) || 1);
            } else {
                toast.error("Failed to fetch categories");
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
            toast.error("Error fetching categories");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [currentPage]);

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchCategories();
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category?")) {
            return;
        }

        try {
            const response = await axios.delete(`https://tala-store.vercel.app/category/${id}`,{
                headers: {
                    token: localStorage.getItem('userToken')
                },
            });
            if (response.data.success) {
                toast.success("Category deleted successfully");
                fetchCategories();
            } else {
                toast.error("Failed to delete category");
            }
        } catch (error) {
            console.error("Error deleting category:", error);
            toast.error("Error deleting category");
        }
    };

    return (
        <div className="space-y-6 h-screen mt-24 mx-9">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Categories</h1>
                    <p className="mt-1 text-sm text-gray-500">Manage your product categories</p>
                </div>
                <Link to="/manage_category/new" className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                </Link>
            </div>

            <div className="bg-white shadow rounded-lg">
                <div className="p-4 border-b border-gray-200">
                    <form onSubmit={handleSearch} className="max-w-md">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                                placeholder="Search categories"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </form>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
                    </div>
                ) : categories.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                        {categories.map((category) => (
                            <div key={category.id} className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md">
                                <div className="h-40 bg-gray-200 relative">
                                    {category.image?.url ? (
                                        <img src={category.image.url} alt={category.name} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center bg-gray-100">
                                            <span className="text-sm text-gray-500">No image</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
                                    <p className="text-sm text-gray-500 mt-1">Slug: {category.slug}</p>
                                    <div className="mt-4 flex justify-end space-x-2">
                                        <Link to={`edit/${category.id}`} className="text-pink-600 hover:text-pink-900">
                                            <Edit className="h-5 w-5" />
                                        </Link>
                                        <button onClick={() => handleDelete(category.id)} className="text-red-600 hover:text-red-900">
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-gray-500">No categories found</div>
                        <Link to="/categories/new" className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Category
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageCategory;
