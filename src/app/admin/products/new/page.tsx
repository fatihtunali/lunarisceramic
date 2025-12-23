'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Category } from '@/types';

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    name_en: '',
    name_tr: '',
    description: '',
    description_en: '',
    description_tr: '',
    story_en: '',
    story_tr: '',
    category_id: '',
    price_try: '',
    in_stock: true,
    featured: false,
    images: [] as string[]
  });

  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(cats => setCategories(Array.isArray(cats) ? cats : []));
  }, []);

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
    const url = prompt('Enter image URL (e.g., /images/cups/c1.webp)');
    if (url) {
      setFormData({ ...formData, images: [...formData.images, url] });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload
      });

      if (response.ok) {
        const { url } = await response.json();
        setFormData({ ...formData, images: [...formData.images, url] });
      } else {
        const error = await response.json();
        alert(error.error || 'Upload failed');
      }
    } catch {
      alert('Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
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
    setLoading(true);

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          name: formData.name_en,
          description: formData.description_en,
          story_en: formData.story_en,
          story_tr: formData.story_tr,
          category_id: parseInt(formData.category_id),
          price_try: parseFloat(formData.price_try)
        })
      });

      if (response.ok) {
        router.push('/admin/products');
      } else {
        alert('Failed to create product');
      }
    } catch {
      alert('Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="font-playfair text-3xl font-bold text-stone-800 mb-8">
        Add New Product
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
                className="w-full px-4 py-2 border border-stone-200 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900"
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
                className="w-full px-4 py-2 border border-stone-200 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900"
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
              className="w-full px-4 py-2 border border-stone-200 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900"
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
              className="w-full px-4 py-2 border border-stone-200 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900"
            />
          </div>

          <div className="border-t border-stone-200 pt-6">
            <h3 className="font-playfair text-lg font-semibold text-stone-800 mb-4">
              Product Story
            </h3>
            <p className="font-inter text-sm text-stone-500 mb-4">
              Share the inspiration, craftsmanship, or meaning behind this piece. This helps customers connect with your work.
            </p>
            <div>
              <label className="block font-inter text-sm text-stone-600 mb-1">
                Story (English)
              </label>
              <textarea
                name="story_en"
                value={formData.story_en}
                onChange={handleChange}
                rows={4}
                placeholder="Tell the story behind this piece..."
                className="w-full px-4 py-2 border border-stone-200 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900"
              />
            </div>
            <div className="mt-4">
              <label className="block font-inter text-sm text-stone-600 mb-1">
                Story (Turkish)
              </label>
              <textarea
                name="story_tr"
                value={formData.story_tr}
                onChange={handleChange}
                rows={4}
                placeholder="Bu parcanin arkasindaki hikayeyi anlatin..."
                className="w-full px-4 py-2 border border-stone-200 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900"
              />
            </div>
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
                className="w-full px-4 py-2 border border-stone-200 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900"
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
                className="w-full px-4 py-2 border border-stone-200 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900"
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
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={handleImageAdd}
                className="px-4 py-2 border border-stone-200 rounded text-stone-600 hover:bg-stone-50 font-inter text-sm"
              >
                + Add Image URL
              </button>
              <label className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 font-inter text-sm cursor-pointer">
                {uploading ? 'Uploading...' : 'Upload from Computer'}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-amber-600 text-white font-inter rounded hover:bg-amber-700 transition-colors disabled:bg-stone-300"
          >
            {loading ? 'Creating...' : 'Create Product'}
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
