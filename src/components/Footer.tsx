import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-stone-800 via-stone-900 to-stone-800 text-stone-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/logo/logo.png"
                alt="Lunaris Ceramic"
                width={56}
                height={56}
                className="rounded-full ring-2 ring-rose-400/30"
              />
              <h3 className="font-playfair text-2xl font-bold bg-gradient-to-r from-rose-300 via-violet-300 to-teal-300 bg-clip-text text-transparent">
                Lunaris Ceramic
              </h3>
            </div>
            <p className="font-inter text-sm mb-4 text-stone-400">
              Handcrafted ceramic art pieces made with love and tradition. Each piece tells a unique story.
            </p>
            <div className="flex gap-3">
              <span className="inline-block w-8 h-1 rounded-full bg-rose-400/50"></span>
              <span className="inline-block w-8 h-1 rounded-full bg-violet-400/50"></span>
              <span className="inline-block w-8 h-1 rounded-full bg-teal-400/50"></span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-inter font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 font-inter text-sm">
              <li>
                <Link href="/products" className="hover:text-rose-300 transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-violet-300 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-teal-300 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-inter font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-2 font-inter text-sm text-stone-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                info@lunarisceramic.com
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
                Turkey
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-700/50 mt-8 pt-8 text-center font-inter text-sm text-stone-500">
          <p>&copy; {new Date().getFullYear()} Lunaris Ceramic. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
