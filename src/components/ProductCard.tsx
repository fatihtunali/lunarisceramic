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
    <div className="group bg-white rounded-2xl shadow-pastel overflow-hidden hover:shadow-pastel-lg transition-all duration-300 border border-rose-100/50">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-rose-50 to-violet-50">
          <Image
            src={imageUrl}
            alt={product.name_en}
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-500"
          />
          {!product.in_stock && (
            <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center">
              <span className="text-white font-inter font-semibold px-4 py-2 bg-rose-500/80 rounded-full">
                Out of Stock
              </span>
            </div>
          )}
          {Boolean(product.featured) && (
            <div className="absolute top-3 left-3">
              <span className="px-3 py-1 bg-gradient-to-r from-rose-500 to-violet-500 text-white text-xs font-inter font-semibold rounded-full">
                Featured
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-5">
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
    </div>
  );
}
