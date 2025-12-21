'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Category, Product } from '@/types';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name_en: '',
    name_tr: '',
    description_en: '',
    description_tr: '',
    category_id: '',
    price_try: '',
    in_stock: true,
    featured: false,
    images: [] as string[]
  });

  useEffect(() => {
    Promise.all([
      fetch(`/api/products/${params.id}`).then(r => r.json()),
      fetch('/api/categories').then(r => r.json())
    ]).then(([product, cats]) => {
      setCategories(Array.isArray(cats) ? cats : []);
      setFormData({
        name_en: product.name_en || '',
        name_tr: product.name_tr || '',
        description_en: product.description_en || '',
        description_tr: product.description_tr || '',
        category_id: product.category_id?.toString() || '',
        price_try: product.price_try?.toString() || '',
        in_stock: product.in_stock ?? true,
        featured: product.featured ?? false,
        images: product.images?.map((img: { image_url: string }) => img.image_url) || []
      });
      setLoading(false);
    });
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageAdd = () => {
    const url = prompt('Enter image URL');
    if (url) {
      setFormData({ ...formData, images: [...formData.images, url] });
    }
  };

  const handleImageRemove = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/products/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name_en,
          name_en: formData.name_en,
          name_tr: formData.name_tr,
          description: formData.description_en,
          description_en: formData.description_en,
          description_tr: formData.description_tr,
          category_id: parseInt(formData.category_id),
          price_try: parseFloat(formData.price_try),
          in_stock: formData.in_stock,
          featured: formData.featured,
          images: formData.images
        })
      });

      if (response.ok) {
        router.push('/admin/products');
      } else {
        alert('Failed to update product');
      }
    } catch {
      alert('Failed to update product');
    } finally {
      setSaving(false);
    }
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
      <h1 className="font-playfair text-3xl font-bold text-stone-800 mb-8">
        Edit Product
      </h1>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-inter text-sm text-stone-600 mb-1">
                Name (English) *
              </label>
              <input
                type="text"
                name="name_en"
                value={formData.name_en}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-stone-200 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block font-inter text-sm text-stone-600 mb-1">
                Name (Turkish)
              </label>
              <input
                type="text"
                name="name_tr"
                value={formData.name_tr}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-stone-200 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-inter text-sm text-stone-600 mb-1">
              Description (English)
            </label>
            <textarea
              name="description_en"
              value={formData.description_en}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-stone-200 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block font-inter text-sm text-stone-600 mb-1">
              Description (Turkish)
            </label>
            <textarea
              name="description_tr"
              value={formData.description_tr}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-stone-200 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-inter text-sm text-stone-600 mb-1">
                Category *
              </label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-stone-200 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name_en}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-inter text-sm text-stone-600 mb-1">
                Price (TRY) *
              </label>
              <input
                type="number"
                name="price_try"
                value={formData.price_try}
                onChange={handleChange}
                required
                step="0.01"
                min="0"
                className="w-full px-4 py-2 border border-stone-200 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="in_stock"
                checked={formData.in_stock}
                onChange={handleChange}
                className="w-4 h-4 text-amber-600 rounded"
              />
              <span className="font-inter text-sm text-stone-700">In Stock</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-4 h-4 text-amber-600 rounded"
              />
              <span className="font-inter text-sm text-stone-700">Featured Product</span>
            </label>
          </div>

          <div>
            <label className="block font-inter text-sm text-stone-600 mb-2">
              Images
            </label>
            <div className="space-y-2">
              {formData.images.map((url, index) => (
                <div key={index} className="flex items-center gap-2 bg-stone-50 px-3 py-2 rounded">
                  <span className="flex-1 font-inter text-sm text-stone-600 truncate">
                    {url}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleImageRemove(index)}
                    className="text-red-500 hover:text-red-600 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleImageAdd}
              className="mt-2 px-4 py-2 border border-stone-200 rounded text-stone-600 hover:bg-stone-50 font-inter text-sm"
            >
              + Add Image URL
            </button>
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-amber-600 text-white font-inter rounded hover:bg-amber-700 transition-colors disabled:bg-stone-300"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-stone-200 text-stone-600 font-inter rounded hover:bg-stone-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
