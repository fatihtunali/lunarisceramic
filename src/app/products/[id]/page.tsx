'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { convert, format } = useCurrency();

  useEffect(() => {
    fetch(`/api/products/${params.id}`)
      .then(r => r.json())
      .then(data => {
        setProduct(data);
        if (data.images?.length > 0) {
          const primary = data.images.find((img: { is_primary: boolean }) => img.is_primary) || data.images[0];
          setSelectedImage(primary.image_url);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-stone-500 font-inter">Product not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Images */}
            <div>
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-white/80 mb-4 shadow-pastel">
                {selectedImage ? (
                  <Image
                    src={selectedImage}
                    alt={product.name_en}
                    fill
                    className="object-contain"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-stone-400">
                    No image
                  </div>
                )}
              </div>
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img.image_url)}
                      className={`relative aspect-square rounded-xl overflow-hidden transition-all ${
                        selectedImage === img.image_url ? 'ring-2 ring-rose-400 shadow-md' : 'hover:ring-2 hover:ring-rose-200'
                      }`}
                    >
                      <Image
                        src={img.image_url}
                        alt={`${product.name_en} ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <h1 className="font-playfair text-3xl md:text-4xl font-bold text-stone-800 mb-4">
                {product.name_en}
              </h1>
              <p className="font-inter text-2xl font-bold bg-gradient-to-r from-rose-500 to-violet-500 bg-clip-text text-transparent mb-6">
                {format(convert(product.price_try))}
              </p>
              <div className="prose prose-stone mb-8">
                <p className="font-inter text-stone-600">
                  {product.description_en || 'A beautiful handcrafted ceramic piece.'}
                </p>
              </div>

              <div className="mb-6">
                <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-inter font-medium ${
                  product.in_stock
                    ? 'bg-teal-100 text-teal-700'
                    : 'bg-rose-100 text-rose-700'
                }`}>
                  {product.in_stock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              <button
                onClick={() => addToCart(product)}
                disabled={!product.in_stock}
                className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-rose-500 to-rose-400 text-white font-inter font-semibold rounded-full hover:from-rose-600 hover:to-rose-500 transition-all shadow-lg disabled:from-stone-300 disabled:to-stone-300 disabled:cursor-not-allowed"
              >
                Add to Cart
              </button>

              <div className="mt-8 pt-8 border-t border-rose-100">
                <h3 className="font-inter font-semibold text-stone-800 mb-2">
                  Shipping Information
                </h3>
                <p className="font-inter text-sm text-stone-600">
                  Worldwide shipping available. Carefully packaged to ensure safe delivery.
                </p>
              </div>
            </div>
          </div>

          {/* Product Story Section */}
          {product.story_en && (
            <div className="mt-16 max-w-3xl mx-auto">
              <div className="bg-gradient-to-br from-rose-50 via-violet-50 to-teal-50 rounded-2xl p-8 md:p-12">
                <div className="text-center mb-6">
                  <span className="inline-block px-4 py-1 bg-white/60 rounded-full text-sm font-inter text-rose-600 mb-4">
                    The Story Behind
                  </span>
                  <h2 className="font-playfair text-2xl md:text-3xl font-bold text-stone-800">
                    Crafted with Intention
                  </h2>
                </div>
                <div className="prose prose-stone max-w-none">
                  <p className="font-inter text-stone-600 leading-relaxed text-center md:text-lg">
                    {product.story_en}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
