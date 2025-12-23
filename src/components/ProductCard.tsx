'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { convert, format } = useCurrency();

  const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0];
  const imageUrl = primaryImage?.image_url || '/images/placeholder.jpg';

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
          {/* Price overlay on mobile */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 md:hidden">
            <span className="font-inter font-bold text-white text-sm">
              {format(convert(product.price_try))}
            </span>
          </div>
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
        <div className="mt-4 flex items-center justify-between">
          <span className="font-inter font-bold text-transparent bg-gradient-to-r from-rose-500 to-violet-500 bg-clip-text text-lg">
            {format(convert(product.price_try))}
          </span>
          <button
            onClick={() => addToCart(product)}
            disabled={!product.in_stock}
            className="px-4 py-2 bg-gradient-to-r from-rose-500 to-rose-400 text-white text-sm font-inter font-semibold rounded-full hover:from-rose-600 hover:to-rose-500 transition-all duration-300 disabled:from-stone-300 disabled:to-stone-300 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          >
            Add to Cart
          </button>
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
