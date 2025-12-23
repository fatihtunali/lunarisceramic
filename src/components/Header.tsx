'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';

export default function Header() {
  const { totalItems } = useCart();
  const { currency, setCurrency } = useCurrency();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-pastel sticky top-0 z-50 border-b border-rose-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/logo/logo.png"
              alt="Lunaris Ceramic"
              width={48}
              height={48}
              className="rounded-full ring-2 ring-rose-100 group-hover:ring-rose-300 transition-all"
            />
            <span className="font-playfair text-xl font-bold bg-gradient-to-r from-rose-500 via-violet-500 to-teal-500 bg-clip-text text-transparent hidden sm:block">
              Lunaris Ceramic
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/products" className="text-stone-600 hover:text-rose-500 font-inter transition-colors">
              Products
            </Link>
            <Link href="/about" className="text-stone-600 hover:text-violet-500 font-inter transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-stone-600 hover:text-teal-500 font-inter transition-colors">
              Contact
            </Link>
          </div>

          {/* Currency & Cart */}
          <div className="flex items-center space-x-4">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as 'TRY' | 'EUR' | 'USD')}
              className="text-sm border border-rose-200 rounded-lg px-3 py-1.5 bg-white/80 font-inter focus:ring-2 focus:ring-rose-300 focus:border-rose-300 outline-none transition-all"
            >
              <option value="TRY">TRY</option>
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
            </select>

            <Link
              href="/cart"
              className="relative p-2 text-stone-600 hover:text-rose-500 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-rose-500 to-violet-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-stone-600 hover:text-rose-500 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-rose-100">
            <Link href="/products" className="block py-2 text-stone-600 hover:text-rose-500 font-inter transition-colors" onClick={() => setMenuOpen(false)}>
              Products
            </Link>
            <Link href="/about" className="block py-2 text-stone-600 hover:text-violet-500 font-inter transition-colors" onClick={() => setMenuOpen(false)}>
              About
            </Link>
            <Link href="/contact" className="block py-2 text-stone-600 hover:text-teal-500 font-inter transition-colors" onClick={() => setMenuOpen(false)}>
              Contact
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
