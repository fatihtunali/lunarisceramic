'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Order } from '@/types';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/orders')
      .then(r => r.json())
      .then(data => {
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat(currency === 'TRY' ? 'tr-TR' : 'en-US', {
      style: 'currency',
      currency: currency
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'confirmed': return 'bg-blue-100 text-blue-700';
      case 'shipped': return 'bg-purple-100 text-purple-700';
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-stone-100 text-stone-700';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    return status === 'paid'
      ? 'bg-green-100 text-green-700'
      : 'bg-yellow-100 text-yellow-700';
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-playfair text-3xl font-bold text-stone-800 mb-8">
        Orders
      </h1>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-stone-50 border-b border-stone-100">
            <tr>
              <th className="px-6 py-4 text-left font-inter text-sm font-semibold text-stone-600">
                Order
              </th>
              <th className="px-6 py-4 text-left font-inter text-sm font-semibold text-stone-600">
                Customer
              </th>
              <th className="px-6 py-4 text-left font-inter text-sm font-semibold text-stone-600">
                Total
              </th>
              <th className="px-6 py-4 text-left font-inter text-sm font-semibold text-stone-600">
                Status
              </th>
              <th className="px-6 py-4 text-left font-inter text-sm font-semibold text-stone-600">
                Payment
              </th>
              <th className="px-6 py-4 text-left font-inter text-sm font-semibold text-stone-600">
                Date
              </th>
              <th className="px-6 py-4 text-right font-inter text-sm font-semibold text-stone-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-stone-50">
                <td className="px-6 py-4">
                  <p className="font-inter font-medium text-stone-800">
                    {order.order_number}
                  </p>
                  <p className="font-inter text-xs text-stone-500">
                    {order.items?.length || 0} items
                  </p>
                </td>
                <td className="px-6 py-4">
                  <p className="font-inter text-sm text-stone-800">
                    {order.customer_name}
                  </p>
                  <p className="font-inter text-xs text-stone-500">
                    {order.customer_email}
                  </p>
                </td>
                <td className="px-6 py-4 font-inter text-sm text-stone-800">
                  {formatPrice(order.display_total || order.total_try, order.currency || 'TRY')}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 rounded text-xs font-inter capitalize ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 rounded text-xs font-inter capitalize ${getPaymentStatusColor(order.payment_status)}`}>
                    {order.payment_status}
                  </span>
                </td>
                <td className="px-6 py-4 font-inter text-sm text-stone-600">
                  {formatDate(order.created_at)}
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-amber-600 hover:text-amber-700 font-inter text-sm"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-stone-500 font-inter">No orders yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
