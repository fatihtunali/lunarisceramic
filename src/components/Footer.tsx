import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-stone-800 text-stone-300">
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
                className="rounded-full"
              />
              <h3 className="font-playfair text-2xl font-bold text-white">Lunaris Ceramic</h3>
            </div>
            <p className="font-inter text-sm mb-4">
              Handcrafted ceramic art pieces made with love and tradition. Each piece tells a unique story.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-inter font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 font-inter text-sm">
              <li><Link href="/products" className="hover:text-white">Products</Link></li>
              <li><Link href="/about" className="hover:text-white">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-inter font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-2 font-inter text-sm">
              <li>info@lunarisceramic.com</li>
              <li>Turkey</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-700 mt-8 pt-8 text-center font-inter text-sm">
          <p>&copy; {new Date().getFullYear()} Lunaris Ceramic. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
