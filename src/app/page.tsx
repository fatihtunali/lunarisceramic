'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Product, Category } from '@/types';

// Category images mapping
const categoryImages: { [key: string]: string } = {
  'cups': '/images/cups/C1 (1).webp',
  'wine-glass': '/images/wine glass/w1.webp',
  'wine-server': '/images/wine server/11.webp',
  'gramophone': '/images/Gramophone/Gramophone.webp'
};

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

      {/* Hero Section - Modern Split Layout */}
      <section className="relative min-h-[80vh] bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="grid md:grid-cols-2 gap-8 items-center min-h-[80vh] py-12">
            {/* Left Side - Text */}
            <div className="order-2 md:order-1">
              <p className="font-inter text-amber-500 uppercase tracking-widest text-sm mb-4">
                Handmade with Love
              </p>
              <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Artisan Ceramic
                <span className="block text-amber-500">Collections</span>
              </h1>
              <p className="font-inter text-lg text-stone-300 mb-8 max-w-lg">
                Discover unique handcrafted ceramic pieces that blend traditional Turkish artistry with contemporary elegance. Each creation tells its own story.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/products"
                  className="inline-block px-8 py-4 bg-amber-600 text-white font-inter font-semibold rounded-lg hover:bg-amber-500 transition-all shadow-lg hover:shadow-amber-500/25"
                >
                  Explore Collection
                </Link>
                <Link
                  href="/about"
                  className="inline-block px-8 py-4 border-2 border-white/30 text-white font-inter font-semibold rounded-lg hover:bg-white/10 transition-all"
                >
                  Our Story
                </Link>
              </div>
            </div>
            {/* Right Side - Hero Product Image */}
            <div className="order-1 md:order-2 relative">
              <div className="relative aspect-[3/4] max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-transparent rounded-2xl" />
                <Image
                  src="/images/wine server/11.webp"
                  alt="Ceramic Wine Server - Handcrafted Art"
                  fill
                  className="object-contain drop-shadow-2xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="font-inter text-amber-600 uppercase tracking-widest text-sm mb-2">Browse By</p>
            <h2 className="font-playfair text-4xl font-bold text-stone-800">
              Our Collections
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map(category => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-stone-100 hover:shadow-xl transition-all duration-300"
              >
                {categoryImages[category.slug] && (
                  <Image
                    src={categoryImages[category.slug]}
                    alt={category.name_en}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-playfair text-xl font-semibold text-white mb-1">
                    {category.name_en}
                  </h3>
                  <p className="font-inter text-sm text-stone-300 group-hover:text-amber-400 transition-colors">
                    View Collection →
                  </p>
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
