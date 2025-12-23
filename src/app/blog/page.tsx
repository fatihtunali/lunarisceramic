'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BlogPost } from '@/types';

const categoryLabels: Record<string, string> = {
  'production': 'Production Process',
  'behind-scenes': 'Behind the Scenes',
  'care-tips': 'Care & Tips'
};

const categoryColors: Record<string, string> = {
  'production': 'bg-rose-100 text-rose-700',
  'behind-scenes': 'bg-violet-100 text-violet-700',
  'care-tips': 'bg-teal-100 text-teal-700'
};

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/blog?published=true')
      .then(r => r.json())
      .then(data => {
        setPosts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredPosts = selectedCategory
    ? posts.filter(p => p.category === selectedCategory)
    : posts;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <p className="font-inter text-rose-500 uppercase tracking-widest text-sm mb-2">
              Our Story
            </p>
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-stone-800 mb-4">
              The Ceramic Journey
            </h1>
            <p className="font-inter text-stone-600 max-w-2xl mx-auto">
              Discover the art of handmade ceramics - from clay preparation to the final glaze.
              Learn about our process, studio life, and how to care for your pieces.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-6 py-2.5 rounded-full font-inter text-sm font-medium transition-all duration-300 ${
                selectedCategory === null
                  ? 'bg-gradient-to-r from-rose-500 to-violet-500 text-white shadow-md'
                  : 'bg-white text-stone-600 hover:bg-rose-50 border border-rose-200'
              }`}
            >
              All Posts
            </button>
            {Object.entries(categoryLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-6 py-2.5 rounded-full font-inter text-sm font-medium transition-all duration-300 ${
                  selectedCategory === key
                    ? 'bg-gradient-to-r from-rose-500 to-violet-500 text-white shadow-md'
                    : 'bg-white text-stone-600 hover:bg-rose-50 border border-rose-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Blog Posts Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto"></div>
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map(post => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group bg-white rounded-2xl shadow-pastel overflow-hidden hover:shadow-pastel-lg transition-all duration-300 border border-rose-100/50"
                >
                  {/* Cover Image */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-rose-100 to-violet-100">
                    {post.cover_image ? (
                      <Image
                        src={post.cover_image}
                        alt={post.title_en}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-white/50 flex items-center justify-center">
                          <svg className="w-8 h-8 text-rose-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-inter font-medium ${categoryColors[post.category]}`}>
                        {categoryLabels[post.category]}
                      </span>
                      <span className="text-stone-400 text-sm font-inter">
                        {formatDate(post.created_at)}
                      </span>
                    </div>
                    <h2 className="font-playfair text-xl font-semibold text-stone-800 mb-2 group-hover:text-rose-500 transition-colors">
                      {post.title_en}
                    </h2>
                    <p className="font-inter text-stone-500 text-sm line-clamp-2">
                      {post.excerpt_en || 'Read more about our ceramic journey...'}
                    </p>
                    <div className="mt-4 flex items-center text-rose-500 font-inter text-sm font-medium">
                      Read More
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-white/80 rounded-2xl p-12 shadow-pastel max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-rose-100 to-violet-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <p className="text-stone-500 font-inter">No blog posts yet. Check back soon!</p>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
