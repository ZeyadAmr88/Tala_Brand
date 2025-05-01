import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  AlertTriangle,
  Tag,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ManageCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isDeleting, setIsDeleting] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      params.append("page", currentPage.toString());

      const response = await axios.get(
        `https://tala-store.vercel.app/category?${params.toString()}`
      );

      if (response.data.success) {
        setCategories(response.data.categories || []);
        setTotalPages(
          response.data.totalPages ||
            Math.ceil(response.data.totalCount / 10) ||
            1
        );
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCategories();
  };

  const confirmDelete = (category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const cancelDelete = () => {
    setCategoryToDelete(null);
    setShowDeleteModal(false);
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;

    setShowDeleteModal(false);
    setIsDeleting(categoryToDelete.id);

    try {
      const response = await axios.delete(
        `https://tala-store.vercel.app/category/${categoryToDelete.id}`,
        {
          headers: {
            token: localStorage.getItem("userToken"),
          },
        }
      );
      if (response.data.success) {
        toast.success("Category deleted successfully");
        fetchCategories();
      } else {
        toast.error("Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Error deleting category");
    } finally {
      setIsDeleting(null);
      setCategoryToDelete(null);
    }
  };

  return (
    <div className="min-h-screen mt-24 px-4 md:px-9 space-y-8 py-14">
      <motion.div
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <Tag className="h-7 w-7 mr-3 text-pink-600" />
            Manage Categories
          </h1>
          <p className="text-gray-500 text-sm mt-1 ml-10">
            Create, update, or delete product categories
          </p>
        </div>
        <Link
          to="/manage_category/new"
          className="inline-flex items-center px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 shadow transition-all duration-200 hover:shadow-md"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Link>
      </motion.div>

      <motion.div
        className="bg-white shadow rounded-lg overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="p-4 border-b border-gray-200">
          <form onSubmit={handleSearch} className="w-full max-w-md mx-auto">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-hover:text-pink-500 transition-colors duration-200" />
              <input
                type="text"
                placeholder="Search categories by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 hover:border-pink-300"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setCurrentPage(1);
                    fetchCategories();
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </form>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-pink-500 border-solid"></div>
              <p className="mt-4 text-gray-500 text-sm">
                Loading categories...
              </p>
            </div>
          </div>
        ) : categories.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="h-40 bg-gray-100 relative overflow-hidden">
                  {category.image?.url ? (
                    <motion.img
                      src={category.image.url}
                      alt={category.name}
                      className="h-full w-full object-cover"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gray-50">
                      <Tag className="h-12 w-12 text-gray-300" />
                      <p className="text-gray-400 text-sm ml-2">No image</p>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Slug: {category.slug}
                  </p>
                  <div className="mt-4 flex justify-end gap-3">
                    <Link
                      to={`edit/${category.id}`}
                      className="p-2 rounded-full text-pink-600 hover:text-pink-800 hover:bg-pink-50 transition-colors"
                    >
                      <Edit className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => confirmDelete(category)}
                      className="p-2 rounded-full text-red-600 hover:text-red-800 hover:bg-red-50 transition-colors"
                      disabled={isDeleting === category.id}
                    >
                      {isDeleting === category.id ? (
                        <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col items-center justify-center p-8">
              <div className="bg-pink-50 p-4 rounded-full mb-4">
                <Tag className="h-12 w-12 text-pink-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No categories found
              </h3>
              <p className="text-gray-500 mb-6">
                Start by adding your first category
              </p>
              <Link
                to="/manage_category/new"
                className="inline-flex items-center px-5 py-2.5 rounded-md text-white bg-pink-600 hover:bg-pink-700 shadow-sm hover:shadow transition-all duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Link>
            </div>
          </motion.div>
        )}
      </motion.div>

      {totalPages > 1 && (
        <motion.div
          className="flex justify-center gap-2 mt-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-4 py-2 rounded-md border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            disabled={currentPage === 1}
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Prev
          </button>
          <div className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-md">
            Page {currentPage} of {totalPages}
          </div>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            className="px-4 py-2 rounded-md border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            disabled={currentPage === totalPages}
          >
            Next
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={cancelDelete}
          >
            <motion.div
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-red-50">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
                Delete Category
              </h3>
              <p className="text-center text-gray-600 mb-6">
                Are you sure you want to delete &quot;{categoryToDelete?.name}
                &quot;? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageCategory;
