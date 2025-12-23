'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/types';

const categoryLabels: Record<string, string> = {
  'production': 'Production Process',
  'behind-scenes': 'Behind the Scenes',
  'care-tips': 'Care & Tips'
};

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/blog')
      .then(r => r.json())
      .then(data => {
        setPosts(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    await fetch(`/api/blog/${slug}`, { method: 'DELETE' });
    setPosts(posts.filter(p => p.slug !== slug));
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
          Blog Posts
        </h1>
        <Link
          href="/admin/blog/new"
          className="px-6 py-2 bg-amber-600 text-white font-inter rounded hover:bg-amber-700 transition-colors"
        >
          + New Post
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-stone-50 border-b border-stone-100">
            <tr>
              <th className="px-6 py-4 text-left font-inter text-sm font-semibold text-stone-600">
                Post
              </th>
              <th className="px-6 py-4 text-left font-inter text-sm font-semibold text-stone-600">
                Category
              </th>
              <th className="px-6 py-4 text-left font-inter text-sm font-semibold text-stone-600">
                Status
              </th>
              <th className="px-6 py-4 text-left font-inter text-sm font-semibold text-stone-600">
                Date
              </th>
              <th className="px-6 py-4 text-right font-inter text-sm font-semibold text-stone-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {posts.map(post => (
              <tr key={post.id} className="hover:bg-stone-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-12 rounded overflow-hidden bg-stone-100">
                      {post.cover_image ? (
                        <Image
                          src={post.cover_image}
                          alt={post.title_en}
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
                        {post.title_en}
                      </p>
                      <p className="font-inter text-xs text-stone-500 line-clamp-1">
                        {post.excerpt_en || 'No excerpt'}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex px-2 py-1 rounded text-xs font-inter bg-violet-100 text-violet-700">
                    {categoryLabels[post.category] || post.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 rounded text-xs font-inter ${
                    post.published
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-6 py-4 font-inter text-sm text-stone-600">
                  {formatDate(post.created_at)}
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/admin/blog/${post.slug}`}
                    className="text-amber-600 hover:text-amber-700 font-inter text-sm mr-4"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(post.slug)}
                    className="text-red-600 hover:text-red-700 font-inter text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-stone-500 font-inter">No blog posts yet.</p>
            <Link
              href="/admin/blog/new"
              className="inline-block mt-4 text-amber-600 hover:text-amber-700 font-inter"
            >
              Create your first blog post
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
