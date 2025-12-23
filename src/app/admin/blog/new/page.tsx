'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewBlogPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title_en: '',
    title_tr: '',
    excerpt_en: '',
    excerpt_tr: '',
    content_en: '',
    content_tr: '',
    cover_image: '',
    category: 'production',
    published: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
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
        setFormData({ ...formData, cover_image: url });
      } else {
        alert('Upload failed');
      }
    } catch {
      alert('Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        router.push('/admin/blog');
      } else {
        alert('Failed to create blog post');
      }
    } catch {
      alert('Failed to create blog post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="font-playfair text-3xl font-bold text-stone-800 mb-8">
        Create New Blog Post
      </h1>

      <form onSubmit={handleSubmit} className="max-w-3xl">
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          {/* Titles */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-inter text-sm text-stone-600 mb-1">
                Title (English) *
              </label>
              <input
                type="text"
                name="title_en"
                value={formData.title_en}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-stone-200 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900"
              />
            </div>
            <div>
              <label className="block font-inter text-sm text-stone-600 mb-1">
                Title (Turkish)
              </label>
              <input
                type="text"
                name="title_tr"
                value={formData.title_tr}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-stone-200 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900"
              />
            </div>
          </div>

          {/* Category & Cover Image */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-inter text-sm text-stone-600 mb-1">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-stone-200 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900"
              >
                <option value="production">Production Process</option>
                <option value="behind-scenes">Behind the Scenes</option>
                <option value="care-tips">Care & Tips</option>
              </select>
            </div>
            <div>
              <label className="block font-inter text-sm text-stone-600 mb-1">
                Cover Image
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="cover_image"
                  value={formData.cover_image}
                  onChange={handleChange}
                  placeholder="/images/blog/..."
                  className="flex-1 px-4 py-2 border border-stone-200 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900"
                />
                <label className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 font-inter text-sm cursor-pointer whitespace-nowrap">
                  {uploading ? '...' : 'Upload'}
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

          {/* Excerpts */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-inter text-sm text-stone-600 mb-1">
                Excerpt (English)
              </label>
              <textarea
                name="excerpt_en"
                value={formData.excerpt_en}
                onChange={handleChange}
                rows={2}
                placeholder="Brief summary for listing pages..."
                className="w-full px-4 py-2 border border-stone-200 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900"
              />
            </div>
            <div>
              <label className="block font-inter text-sm text-stone-600 mb-1">
                Excerpt (Turkish)
              </label>
              <textarea
                name="excerpt_tr"
                value={formData.excerpt_tr}
                onChange={handleChange}
                rows={2}
                placeholder="Liste sayfaları için kısa özet..."
                className="w-full px-4 py-2 border border-stone-200 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900"
              />
            </div>
          </div>

          {/* Content English */}
          <div>
            <label className="block font-inter text-sm text-stone-600 mb-1">
              Content (English) *
            </label>
            <textarea
              name="content_en"
              value={formData.content_en}
              onChange={handleChange}
              required
              rows={12}
              placeholder="Write your blog post content here. You can use basic HTML tags like <p>, <h2>, <ul>, <li>, <strong>, <em> for formatting."
              className="w-full px-4 py-2 border border-stone-200 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 font-mono text-sm"
            />
          </div>

          {/* Content Turkish */}
          <div>
            <label className="block font-inter text-sm text-stone-600 mb-1">
              Content (Turkish)
            </label>
            <textarea
              name="content_tr"
              value={formData.content_tr}
              onChange={handleChange}
              rows={12}
              placeholder="Türkçe içeriği buraya yazın..."
              className="w-full px-4 py-2 border border-stone-200 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 font-mono text-sm"
            />
          </div>

          {/* Published */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="published"
                checked={formData.published}
                onChange={handleChange}
                className="w-4 h-4 text-amber-600 rounded"
              />
              <span className="font-inter text-sm text-stone-700">Publish immediately</span>
            </label>
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-amber-600 text-white font-inter rounded hover:bg-amber-700 transition-colors disabled:bg-stone-300"
          >
            {loading ? 'Creating...' : 'Create Post'}
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
