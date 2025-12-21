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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
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
      <main className="flex-1 bg-stone-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Images */}
            <div>
              <div className="relative aspect-square rounded-lg overflow-hidden bg-white mb-4">
                {selectedImage ? (
                  <Image
                    src={selectedImage}
                    alt={product.name_en}
                    fill
                    className="object-cover"
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
                      className={`relative aspect-square rounded overflow-hidden ${
                        selectedImage === img.image_url ? 'ring-2 ring-amber-600' : ''
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
              <h1 className="font-playfair text-3xl font-bold text-stone-800 mb-4">
                {product.name_en}
              </h1>
              <p className="font-inter text-2xl font-semibold text-amber-600 mb-6">
                {format(convert(product.price_try))}
              </p>
              <div className="prose prose-stone mb-8">
                <p className="font-inter text-stone-600">
                  {product.description_en || 'A beautiful handcrafted ceramic piece.'}
                </p>
              </div>

              <div className="mb-6">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-inter ${
                  product.in_stock
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.in_stock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              <button
                onClick={() => addToCart(product)}
                disabled={!product.in_stock}
                className="w-full md:w-auto px-8 py-4 bg-amber-600 text-white font-inter font-semibold rounded hover:bg-amber-700 transition-colors disabled:bg-stone-300 disabled:cursor-not-allowed"
              >
                Add to Cart
              </button>

              <div className="mt-8 pt-8 border-t border-stone-200">
                <h3 className="font-inter font-semibold text-stone-800 mb-2">
                  Shipping Information
                </h3>
                <p className="font-inter text-sm text-stone-600">
                  Worldwide shipping available. Carefully packaged to ensure safe delivery.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
