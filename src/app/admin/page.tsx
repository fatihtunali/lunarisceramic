'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    pendingOrders: 0
  });

  useEffect(() => {
    Promise.all([
      fetch('/api/products').then(r => r.json()),
      fetch('/api/orders').then(r => r.json())
    ]).then(([products, orders]) => {
      setStats({
        products: Array.isArray(products) ? products.length : 0,
        orders: Array.isArray(orders) ? orders.length : 0,
        pendingOrders: Array.isArray(orders) ? orders.filter((o: { status: string }) => o.status === 'pending').length : 0
      });
    });
  }, []);

  return (
    <div>
      <h1 className="font-playfair text-3xl font-bold text-stone-800 mb-8">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="font-inter text-sm text-stone-500 uppercase tracking-wide">
            Total Products
          </h3>
          <p className="font-playfair text-4xl font-bold text-stone-800 mt-2">
            {stats.products}
          </p>
          <Link href="/admin/products" className="font-inter text-sm text-amber-600 hover:text-amber-700 mt-4 inline-block">
            Manage Products →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="font-inter text-sm text-stone-500 uppercase tracking-wide">
            Total Orders
          </h3>
          <p className="font-playfair text-4xl font-bold text-stone-800 mt-2">
            {stats.orders}
          </p>
          <Link href="/admin/orders" className="font-inter text-sm text-amber-600 hover:text-amber-700 mt-4 inline-block">
            View Orders →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="font-inter text-sm text-stone-500 uppercase tracking-wide">
            Pending Orders
          </h3>
          <p className="font-playfair text-4xl font-bold text-amber-600 mt-2">
            {stats.pendingOrders}
          </p>
          <Link href="/admin/orders?status=pending" className="font-inter text-sm text-amber-600 hover:text-amber-700 mt-4 inline-block">
            Process Orders →
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="font-inter font-semibold text-stone-800 mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <Link
              href="/admin/products/new"
              className="block px-4 py-3 bg-amber-50 text-amber-700 rounded hover:bg-amber-100 font-inter text-sm"
            >
              + Add New Product
            </Link>
            <Link
              href="/admin/settings"
              className="block px-4 py-3 bg-stone-50 text-stone-700 rounded hover:bg-stone-100 font-inter text-sm"
            >
              Update Exchange Rates
            </Link>
            <Link
              href="/"
              target="_blank"
              className="block px-4 py-3 bg-stone-50 text-stone-700 rounded hover:bg-stone-100 font-inter text-sm"
            >
              View Store →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="font-inter font-semibold text-stone-800 mb-4">
            Store Information
          </h2>
          <div className="space-y-2 font-inter text-sm">
            <div className="flex justify-between">
              <span className="text-stone-500">Store Name</span>
              <span className="text-stone-800">Lunaris Ceramic</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Currency</span>
              <span className="text-stone-800">TRY (with EUR/USD display)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Payment Method</span>
              <span className="text-stone-800">Bank Transfer</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
