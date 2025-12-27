'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Product } from '@/types';

const WHATSAPP_NUMBER = '905366063251';

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const getWhatsAppUrl = () => {
    if (!product) return '#';
    const productUrl = typeof window !== 'undefined'
      ? window.location.href
      : '';
    const message = `Hi, I'm interested in "${product.name_en}". ${productUrl}`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  };

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

              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 w-full md:w-auto px-10 py-4 bg-[#25D366] text-white font-inter font-semibold rounded-full hover:bg-[#20bd5a] transition-all shadow-lg"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Contact for Price
              </a>

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
