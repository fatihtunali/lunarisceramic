'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    if (pathname === '/admin/login') {
      setLoading(false);
      return;
    }

    fetch('/api/auth/me')
      .then(r => {
        if (!r.ok) throw new Error('Not authenticated');
        return r.json();
      })
      .then(data => {
        setUser(data.user);
        setLoading(false);
      })
      .catch(() => {
        router.push('/admin/login');
      });
  }, [pathname, router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/admin" className="font-playfair text-xl font-bold text-stone-800">
                Lunaris Admin
              </Link>
              <div className="hidden md:flex items-center gap-6">
                <Link
                  href="/admin"
                  className={`font-inter text-sm ${pathname === '/admin' ? 'text-amber-600' : 'text-stone-600 hover:text-stone-800'}`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/products"
                  className={`font-inter text-sm ${pathname.startsWith('/admin/products') ? 'text-amber-600' : 'text-stone-600 hover:text-stone-800'}`}
                >
                  Products
                </Link>
                <Link
                  href="/admin/orders"
                  className={`font-inter text-sm ${pathname.startsWith('/admin/orders') ? 'text-amber-600' : 'text-stone-600 hover:text-stone-800'}`}
                >
                  Orders
                </Link>
                <Link
                  href="/admin/blog"
                  className={`font-inter text-sm ${pathname.startsWith('/admin/blog') ? 'text-amber-600' : 'text-stone-600 hover:text-stone-800'}`}
                >
                  Blog
                </Link>
                <Link
                  href="/admin/settings"
                  className={`font-inter text-sm ${pathname === '/admin/settings' ? 'text-amber-600' : 'text-stone-600 hover:text-stone-800'}`}
                >
                  Settings
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-inter text-sm text-stone-600">
                {user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="font-inter text-sm text-red-600 hover:text-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
