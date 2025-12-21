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
    <div className="group bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
          <Image
            src={imageUrl}
            alt={product.name_en}
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-300"
          />
          {!product.in_stock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-inter font-semibold">Out of Stock</span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-playfair text-lg font-semibold text-stone-800 hover:text-amber-700 transition-colors">
            {product.name_en}
          </h3>
        </Link>
        <p className="font-inter text-stone-500 text-sm mt-1 line-clamp-2">
          {product.description_en}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="font-inter font-semibold text-stone-800">
            {format(convert(product.price_try))}
          </span>
          <button
            onClick={() => addToCart(product)}
            disabled={!product.in_stock}
            className="px-4 py-2 bg-amber-600 text-white text-sm font-inter rounded hover:bg-amber-700 transition-colors disabled:bg-stone-300 disabled:cursor-not-allowed"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
