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
      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="font-inter text-rose-500 uppercase tracking-widest text-sm mb-2">Your Selection</p>
            <h1 className="font-playfair text-3xl md:text-4xl font-bold text-stone-800">
              Shopping Cart
            </h1>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-white/80 rounded-3xl shadow-pastel p-12 max-w-md mx-auto">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-rose-100 to-violet-100 flex items-center justify-center">
                  <svg className="w-10 h-10 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <p className="text-stone-500 font-inter mb-6">Your cart is empty</p>
                <Link
                  href="/products"
                  className="inline-block px-8 py-3 bg-gradient-to-r from-rose-500 to-rose-400 text-white font-inter font-semibold rounded-full hover:from-rose-600 hover:to-rose-500 transition-all shadow-md"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-white/80 rounded-2xl shadow-pastel divide-y divide-rose-100 overflow-hidden">
                {items.map(item => {
                  const primaryImage = item.product.images?.find(img => img.is_primary) || item.product.images?.[0];
                  return (
                    <div key={item.product.id} className="p-6 flex gap-6">
                      <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gradient-to-br from-rose-50 to-violet-50 flex-shrink-0">
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
                          <h3 className="font-playfair text-lg font-semibold text-stone-800 hover:text-rose-500 transition-colors">
                            {item.product.name_en}
                          </h3>
                        </Link>
                        <p className="font-inter text-rose-500 font-semibold mt-1">
                          {format(convert(item.product.price_try))}
                        </p>
                        <div className="flex items-center gap-4 mt-3">
                          <div className="flex items-center border border-rose-200 rounded-full overflow-hidden">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="px-4 py-1.5 text-stone-600 hover:bg-rose-50 transition-colors"
                            >
                              -
                            </button>
                            <span className="px-3 py-1.5 font-inter font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="px-4 py-1.5 text-stone-600 hover:bg-rose-50 transition-colors"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-red-400 text-sm font-inter hover:text-red-500 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-inter font-bold text-transparent bg-gradient-to-r from-rose-500 to-violet-500 bg-clip-text text-lg">
                          {format(convert(item.product.price_try * item.quantity))}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 bg-white/80 rounded-2xl shadow-pastel p-6">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-inter text-lg text-stone-600">Total</span>
                  <span className="font-playfair text-2xl font-bold bg-gradient-to-r from-rose-500 to-violet-500 bg-clip-text text-transparent">
                    {format(convert(totalPriceTRY))}
                  </span>
                </div>
                <Link
                  href="/checkout"
                  className="block w-full text-center px-6 py-4 bg-gradient-to-r from-rose-500 to-rose-400 text-white font-inter font-semibold rounded-full hover:from-rose-600 hover:to-rose-500 transition-all shadow-md"
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
