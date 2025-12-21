'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Product, Category } from '@/types';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/products?featured=true').then(r => r.json()),
      fetch('/api/categories').then(r => r.json())
    ]).then(([products, cats]) => {
      setFeaturedProducts(Array.isArray(products) ? products.slice(0, 4) : []);
      setCategories(Array.isArray(cats) ? cats : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[70vh] bg-stone-800">
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900/80 to-stone-900/40" />
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-playfair text-4xl md:text-6xl font-bold text-white mb-4">
              Handcrafted Ceramic Art
            </h1>
            <p className="font-inter text-lg md:text-xl text-stone-200 mb-8 max-w-xl">
              Discover unique pieces made with love and tradition. Each creation tells its own story.
            </p>
            <Link
              href="/products"
              className="inline-block px-8 py-4 bg-amber-600 text-white font-inter font-semibold rounded hover:bg-amber-700 transition-colors"
            >
              Explore Collection
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-playfair text-3xl font-bold text-stone-800 text-center mb-12">
            Our Collections
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map(category => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="group relative aspect-square rounded-lg overflow-hidden bg-stone-200 hover:shadow-lg transition-shadow"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-playfair text-xl font-semibold text-white">
                    {category.name_en}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-playfair text-3xl font-bold text-stone-800 text-center mb-12">
            Featured Pieces
          </h2>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-center text-stone-500 font-inter">
              Check back soon for featured products!
            </p>
          )}
          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-block px-8 py-3 border-2 border-amber-600 text-amber-600 font-inter font-semibold rounded hover:bg-amber-600 hover:text-white transition-colors"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-playfair text-3xl font-bold text-stone-800 mb-6">
                Crafted with Passion
              </h2>
              <p className="font-inter text-stone-600 mb-4">
                At Lunaris Ceramic, we believe in the beauty of handmade artistry. Each piece is crafted with care,
                blending traditional techniques with contemporary design.
              </p>
              <p className="font-inter text-stone-600 mb-6">
                Our ceramics are more than objects - they are stories waiting to become part of your home.
              </p>
              <Link
                href="/about"
                className="inline-block text-amber-600 font-inter font-semibold hover:text-amber-700"
              >
                Learn More About Us →
              </Link>
            </div>
            <div className="relative aspect-square rounded-lg overflow-hidden bg-stone-200">
              <div className="absolute inset-0 flex items-center justify-center text-stone-400 font-inter">
                Artisan at work
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
