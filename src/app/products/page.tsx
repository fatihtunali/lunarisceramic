'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Product, Category } from '@/types';

function ProductsContent() {
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get('category');

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categorySlug);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(setCategories)
      .catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    const category = categories.find(c => c.slug === selectedCategory);
    const url = category ? `/api/products?category=${category.id}` : '/api/products';

    fetch(url)
      .then(r => r.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedCategory, categories]);

  return (
    <div className="max-w-7xl mx-auto px-0 md:px-6 lg:px-8 py-6 md:py-12">
      <div className="text-center mb-6 md:mb-12 px-4">
        <p className="font-inter text-rose-500 uppercase tracking-widest text-xs md:text-sm mb-2">Discover</p>
        <h1 className="font-playfair text-3xl md:text-5xl font-bold text-stone-800">
          Our Products
        </h1>
      </div>

      {/* Category Filter - Scrollable on mobile */}
      <div className="flex md:flex-wrap md:justify-center gap-2 md:gap-3 mb-4 md:mb-12 overflow-x-auto pb-2 px-4 scrollbar-hide">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 md:px-6 py-2 md:py-2.5 rounded-full font-inter text-xs md:text-sm font-medium transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
            selectedCategory === null
              ? 'bg-gradient-to-r from-rose-500 to-violet-500 text-white shadow-md'
              : 'bg-white text-stone-600 hover:bg-rose-50 border border-rose-200'
          }`}
        >
          All
        </button>
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.slug)}
            className={`px-4 md:px-6 py-2 md:py-2.5 rounded-full font-inter text-xs md:text-sm font-medium transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
              selectedCategory === category.slug
                ? 'bg-gradient-to-r from-rose-500 to-violet-500 text-white shadow-md'
                : 'bg-white text-stone-600 hover:bg-rose-50 border border-rose-200'
            }`}
          >
            {category.name_en}
          </button>
        ))}
      </div>

      {/* Products Grid - Instagram style 2-col on mobile */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto"></div>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-0.5 md:gap-6 lg:gap-8">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="bg-white/80 rounded-2xl p-12 shadow-pastel max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-rose-100 to-violet-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 12H4" />
              </svg>
            </div>
            <p className="text-stone-500 font-inter">No products found in this category.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Suspense fallback={
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto"></div>
          </div>
        }>
          <ProductsContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
