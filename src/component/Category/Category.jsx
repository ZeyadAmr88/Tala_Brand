"use client";

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import NoProductsFound from '../common/NoProductsFound';

export default function Category() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchProductsByCategory = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`https://tala-store.vercel.app/category/${slug}/products`);

        if (data.success) {
          setProducts(data.products || []);
          setCategory(data.category || null);
        } else {
          console.error("Failed to fetch products:", data.message);
        }
      } catch (error) {
        console.error("Error fetching products by category:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsByCategory();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center mt-24">
        <p className="text-xl">Loading products...</p>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen mt-24 container mx-auto px-4 text-center h-screen" >
        <h1 className="text-2xl font-bold">Category not found</h1>
        <p className="mt-4">The category you’re looking for doesn’t exist or has been removed.</p>
        <Link to="/" className="mt-6 inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-24 container mx-auto px-4">
      <div className="py-8 text-center">
        <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">Browse our collection of products in the {category.name} category</p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-8 sm:py-12 px-4">
          <NoProductsFound 
            message={`No products are currently available in the ${category.name} category.`}
            highlightedText={category.name}
            primaryButtonText="Browse Other Categories"
            primaryButtonLink="/categories"
            secondaryButtonText="Return to Home"
            secondaryButtonLink="/"
            iconType="category"
            accentColor="pink"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          {products.map((product) => (
            <Link to={`/product/${product.slug}`} key={product.id} className="group">
              <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                <img src={product.image?.url || "/placeholder.svg"} alt={product.name} className="object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="p-4">
                  <h3 className="font-medium text-lg truncate">{product.name}</h3>
                  <p className="font-bold mt-2">${product.price.toFixed(2)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
