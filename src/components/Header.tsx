'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-pastel sticky top-0 z-50 border-b border-rose-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/logo/logo.png"
              alt="Lunaris Ceramic"
              width={40}
              height={40}
              className="rounded-full ring-2 ring-rose-100 group-hover:ring-rose-300 transition-all"
            />
            <span className="font-playfair text-lg font-bold bg-gradient-to-r from-rose-500 via-violet-500 to-teal-500 bg-clip-text text-transparent hidden sm:block">
              Lunaris Ceramic
            </span>
          </Link>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex items-center justify-center flex-1 space-x-10">
            <Link href="/products" className="text-stone-600 hover:text-rose-500 font-inter font-medium transition-colors">
              Products
            </Link>
            <Link href="/blog" className="text-stone-600 hover:text-violet-500 font-inter font-medium transition-colors">
              Blog
            </Link>
            <Link href="/about" className="text-stone-600 hover:text-teal-500 font-inter font-medium transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-stone-600 hover:text-rose-500 font-inter font-medium transition-colors">
              Contact
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center">
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
            <Link href="/blog" className="block py-2 text-stone-600 hover:text-violet-500 font-inter transition-colors" onClick={() => setMenuOpen(false)}>
              Blog
            </Link>
            <Link href="/about" className="block py-2 text-stone-600 hover:text-teal-500 font-inter transition-colors" onClick={() => setMenuOpen(false)}>
              About
            </Link>
            <Link href="/contact" className="block py-2 text-stone-600 hover:text-rose-500 font-inter transition-colors" onClick={() => setMenuOpen(false)}>
              Contact
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
