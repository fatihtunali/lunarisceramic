'use client';

import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPriceTRY } = useCart();
  const { convert, format } = useCurrency();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-stone-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-playfair text-3xl font-bold text-stone-800 mb-8">
            Shopping Cart
          </h1>

          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-stone-500 font-inter mb-4">Your cart is empty</p>
              <Link
                href="/products"
                className="inline-block px-6 py-3 bg-amber-600 text-white font-inter rounded hover:bg-amber-700 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-lg shadow-sm divide-y divide-stone-100">
                {items.map(item => {
                  const primaryImage = item.product.images?.find(img => img.is_primary) || item.product.images?.[0];
                  return (
                    <div key={item.product.id} className="p-6 flex gap-6">
                      <div className="relative w-24 h-24 rounded overflow-hidden bg-stone-100 flex-shrink-0">
                        {primaryImage ? (
                          <Image
                            src={primaryImage.image_url}
                            alt={item.product.name_en}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-stone-400 text-xs">
                            No image
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <Link href={`/products/${item.product.id}`}>
                          <h3 className="font-playfair text-lg font-semibold text-stone-800 hover:text-amber-600">
                            {item.product.name_en}
                          </h3>
                        </Link>
                        <p className="font-inter text-amber-600 font-semibold mt-1">
                          {format(convert(item.product.price_try))}
                        </p>
                        <div className="flex items-center gap-4 mt-3">
                          <div className="flex items-center border border-stone-200 rounded">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="px-3 py-1 text-stone-600 hover:bg-stone-50"
                            >
                              -
                            </button>
                            <span className="px-3 py-1 font-inter">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="px-3 py-1 text-stone-600 hover:bg-stone-50"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-red-500 text-sm font-inter hover:text-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-inter font-semibold text-stone-800">
                          {format(convert(item.product.price_try * item.quantity))}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-inter text-lg text-stone-600">Total</span>
                  <span className="font-playfair text-2xl font-bold text-stone-800">
                    {format(convert(totalPriceTRY))}
                  </span>
                </div>
                <Link
                  href="/checkout"
                  className="block w-full text-center px-6 py-4 bg-amber-600 text-white font-inter font-semibold rounded hover:bg-amber-700 transition-colors"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
