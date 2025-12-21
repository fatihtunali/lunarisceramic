'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product, Category } from '@/types';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/products').then(r => r.json()),
      fetch('/api/categories').then(r => r.json())
    ]).then(([prods, cats]) => {
      setProducts(Array.isArray(prods) ? prods : []);
      setCategories(Array.isArray(cats) ? cats : []);
      setLoading(false);
    });
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    setProducts(products.filter(p => p.id !== id));
  };

  const getCategoryName = (categoryId: number) => {
    const cat = categories.find(c => c.id === categoryId);
    return cat?.name_en || 'Unknown';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-playfair text-3xl font-bold text-stone-800">
          Products
        </h1>
        <Link
          href="/admin/products/new"
          className="px-6 py-2 bg-amber-600 text-white font-inter rounded hover:bg-amber-700 transition-colors"
        >
          + Add Product
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-stone-50 border-b border-stone-100">
            <tr>
              <th className="px-6 py-4 text-left font-inter text-sm font-semibold text-stone-600">
                Product
              </th>
              <th className="px-6 py-4 text-left font-inter text-sm font-semibold text-stone-600">
                Category
              </th>
              <th className="px-6 py-4 text-left font-inter text-sm font-semibold text-stone-600">
                Price
              </th>
              <th className="px-6 py-4 text-left font-inter text-sm font-semibold text-stone-600">
                Status
              </th>
              <th className="px-6 py-4 text-right font-inter text-sm font-semibold text-stone-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {products.map(product => {
              const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0];
              return (
                <tr key={product.id} className="hover:bg-stone-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded overflow-hidden bg-stone-100">
                        {primaryImage ? (
                          <Image
                            src={primaryImage.image_url}
                            alt={product.name_en}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-stone-400 text-xs">
                            No img
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-inter font-medium text-stone-800">
                          {product.name_en}
                        </p>
                        <p className="font-inter text-xs text-stone-500">
                          ID: {product.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-inter text-sm text-stone-600">
                    {getCategoryName(product.category_id)}
                  </td>
                  <td className="px-6 py-4 font-inter text-sm text-stone-800">
                    {formatPrice(product.price_try)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 rounded text-xs font-inter ${
                      product.in_stock
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {product.in_stock ? 'In Stock' : 'Out of Stock'}
                    </span>
                    {product.featured && (
                      <span className="ml-2 inline-flex px-2 py-1 rounded text-xs font-inter bg-amber-100 text-amber-700">
                        Featured
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="text-amber-600 hover:text-amber-700 font-inter text-sm mr-4"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-700 font-inter text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-stone-500 font-inter">No products yet.</p>
            <Link
              href="/admin/products/new"
              className="inline-block mt-4 text-amber-600 hover:text-amber-700 font-inter"
            >
              Add your first product
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
