'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

const WHATSAPP_NUMBER = '905366063251';

export default function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0];
  const imageUrl = primaryImage?.image_url || '/images/placeholder.jpg';

  const getWhatsAppUrl = () => {
    const productUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/products/${product.id}`
      : '';
    const message = `Hi, I'm interested in "${product.name_en}". ${productUrl}`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="group bg-white md:rounded-2xl md:shadow-pastel overflow-hidden md:hover:shadow-pastel-lg transition-all duration-300 md:border md:border-rose-100/50">
      <Link href={`/products/${product.id}`}>
        {/* Mobile: Square Instagram-style | Desktop: 3/4 aspect ratio */}
        <div className="relative aspect-square md:aspect-[3/4] overflow-hidden bg-white">
          <Image
            src={imageUrl}
            alt={product.name_en}
            fill
            className="object-cover md:object-contain group-hover:scale-105 transition-transform duration-500"
          />
          {!product.in_stock && (
            <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center">
              <span className="text-white font-inter font-semibold px-3 py-1.5 md:px-4 md:py-2 bg-rose-500/80 rounded-full text-xs md:text-sm">
                Out of Stock
              </span>
            </div>
          )}
          {Boolean(product.featured) && (
            <div className="absolute top-2 left-2 md:top-3 md:left-3">
              <span className="px-2 py-0.5 md:px-3 md:py-1 bg-gradient-to-r from-rose-500 to-violet-500 text-white text-[10px] md:text-xs font-inter font-semibold rounded-full">
                Featured
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Desktop only: Full card details */}
      <div className="hidden md:block p-5">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-playfair text-lg font-semibold text-stone-800 hover:text-rose-500 transition-colors">
            {product.name_en}
          </h3>
        </Link>
        <p className="font-inter text-stone-500 text-sm mt-2 line-clamp-2">
          {product.description_en}
        </p>
        <div className="mt-4">
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-[#25D366] text-white text-sm font-inter font-semibold rounded-full hover:bg-[#20bd5a] transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Ask for Price
          </a>
        </div>
      </div>

      {/* Mobile only: Compact info below image */}
      <div className="md:hidden p-2">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-playfair text-sm font-semibold text-stone-800 truncate">
            {product.name_en}
          </h3>
        </Link>
      </div>
    </div>
  );
}
