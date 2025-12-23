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
  'cups': '/images/cups/CAT.webp',
  'wine-glasses': '/images/wine-glass/w1.webp',
  'wine-servers': '/images/wine-server/11.webp',
  'decorative': '/images/Gramophone/Gramophone.webp'
};

// Category gradient colors
const categoryGradients: { [key: string]: string } = {
  'cups': 'from-rose-500/80 to-rose-600/80',
  'wine-glasses': 'from-violet-500/80 to-violet-600/80',
  'wine-servers': 'from-teal-500/80 to-teal-600/80',
  'decorative': 'from-amber-500/80 to-amber-600/80'
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

      {/* Hero Section - Pastel Gradient */}
      <section className="relative min-h-[85vh] bg-gradient-to-br from-rose-100 via-violet-100 to-teal-100 overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-rose-300/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-violet-300/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-teal-200/20 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full relative z-10">
          <div className="grid md:grid-cols-2 gap-8 items-center min-h-[85vh] py-12">
            {/* Left Side - Text */}
            <div className="order-2 md:order-1">
              <p className="font-inter text-rose-500 uppercase tracking-widest text-sm mb-4 flex items-center gap-2">
                <span className="w-8 h-0.5 bg-rose-400"></span>
                Handmade with Love
              </p>
              <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-stone-800 mb-6 leading-tight">
                Artisan Ceramic
                <span className="block bg-gradient-to-r from-rose-500 via-violet-500 to-teal-500 bg-clip-text text-transparent">
                  Collections
                </span>
              </h1>
              <p className="font-inter text-lg text-stone-600 mb-8 max-w-lg">
                Discover unique handcrafted ceramic pieces that blend traditional Turkish artistry with contemporary elegance. Each creation tells its own story.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/products"
                  className="inline-block px-8 py-4 bg-gradient-to-r from-rose-500 to-rose-400 text-white font-inter font-semibold rounded-full hover:from-rose-600 hover:to-rose-500 transition-all shadow-lg hover:shadow-rose-500/25 btn-glow"
                >
                  Explore Collection
                </Link>
                <Link
                  href="/about"
                  className="inline-block px-8 py-4 border-2 border-violet-300 text-violet-600 font-inter font-semibold rounded-full hover:bg-violet-50 transition-all"
                >
                  Our Story
                </Link>
              </div>
            </div>
            {/* Right Side - Hero Product Image */}
            <div className="order-1 md:order-2 relative">
              <div className="relative aspect-[3/4] max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-200/50 via-violet-200/50 to-teal-200/50 rounded-3xl transform rotate-3" />
                <div className="absolute inset-0 bg-white/40 backdrop-blur-sm rounded-3xl shadow-pastel-lg" />
                <Image
                  src="/images/wine-server/11.webp"
                  alt="Ceramic Wine Server - Handcrafted Art"
                  fill
                  className="object-contain drop-shadow-2xl p-8"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="font-inter text-rose-500 uppercase tracking-widest text-sm mb-2 flex items-center justify-center gap-2">
              <span className="w-8 h-0.5 bg-rose-300"></span>
              Browse By
              <span className="w-8 h-0.5 bg-rose-300"></span>
            </p>
            <h2 className="font-playfair text-4xl font-bold text-stone-800">
              Our Collections
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="group relative aspect-[3/4] rounded-3xl overflow-hidden bg-gradient-to-br from-rose-50 to-violet-50 hover:shadow-pastel-lg transition-all duration-500 border border-rose-100"
              >
                {categoryImages[category.slug] && (
                  <Image
                    src={categoryImages[category.slug]}
                    alt={category.name_en}
                    fill
                    className="object-contain p-4 group-hover:scale-110 transition-transform duration-700"
                  />
                )}
                <div className={`absolute inset-0 bg-gradient-to-t ${categoryGradients[category.slug] || 'from-rose-500/80 to-rose-600/80'} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-stone-900/60 to-transparent group-hover:from-transparent">
                  <h3 className="font-playfair text-xl font-semibold text-white mb-1">
                    {category.name_en}
                  </h3>
                  <p className="font-inter text-sm text-white/80 group-hover:text-white transition-colors flex items-center gap-2">
                    View Collection
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gradient-to-br from-violet-50/50 via-white to-rose-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="font-inter text-violet-500 uppercase tracking-widest text-sm mb-2">Curated Selection</p>
            <h2 className="font-playfair text-4xl font-bold text-stone-800">
              Featured Pieces
            </h2>
          </div>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto"></div>
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
              className="inline-block px-8 py-4 border-2 border-rose-400 text-rose-500 font-inter font-semibold rounded-full hover:bg-rose-500 hover:text-white transition-all duration-300"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-20 bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="font-inter text-teal-500 uppercase tracking-widest text-sm mb-2 flex items-center gap-2">
                <span className="w-8 h-0.5 bg-teal-400"></span>
                About Us
              </p>
              <h2 className="font-playfair text-4xl font-bold text-stone-800 mb-6">
                Crafted with Passion
              </h2>
              <p className="font-inter text-stone-600 mb-4 text-lg">
                At Lunaris Ceramic, we believe in the beauty of handmade artistry. Each piece is crafted with care,
                blending traditional techniques with contemporary design.
              </p>
              <p className="font-inter text-stone-600 mb-8 text-lg">
                Our ceramics are more than objects - they are stories waiting to become part of your home.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-teal-600 font-inter font-semibold hover:text-teal-700 group"
              >
                Learn More About Us
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-200/30 via-violet-200/30 to-rose-200/30 rounded-3xl transform -rotate-3" />
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-teal-50 to-violet-50 shadow-pastel-lg border border-teal-100">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-teal-400 to-violet-400 flex items-center justify-center">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <p className="text-stone-500 font-inter">Artisan at work</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter / CTA Section */}
      <section className="py-20 bg-gradient-to-r from-rose-500 via-violet-500 to-teal-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-white mb-4">
            Start Your Collection Today
          </h2>
          <p className="font-inter text-white/90 mb-8 text-lg">
            Each piece is unique, handcrafted with love and tradition.
          </p>
          <Link
            href="/products"
            className="inline-block px-10 py-4 bg-white text-rose-500 font-inter font-semibold rounded-full hover:bg-rose-50 transition-all shadow-lg"
          >
            Shop Now
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
