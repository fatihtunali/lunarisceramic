'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Order } from '@/types';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/orders/${params.id}`)
      .then(r => r.json())
      .then(data => {
        setOrder(data);
        setLoading(false);
      });
  }, [params.id]);

  const handleStatusChange = async (field: string, value: string) => {
    setSaving(true);
    try {
      const response = await fetch(`/api/orders/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value })
      });

      if (response.ok && order) {
        setOrder({ ...order, [field]: value });
      }
    } catch (error) {
      alert('Failed to update order');
    } finally {
      setSaving(false);
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat(currency === 'TRY' ? 'tr-TR' : 'en-US', {
      style: 'currency',
      currency: currency
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-stone-500 font-inter">Order not found</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <button
            onClick={() => router.back()}
            className="text-stone-500 hover:text-stone-700 font-inter text-sm mb-2"
          >
            ← Back to Orders
          </button>
          <h1 className="font-playfair text-3xl font-bold text-stone-800">
            Order {order.order_number}
          </h1>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Order Details */}
        <div className="md:col-span-2 space-y-6">
          {/* Status */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="font-inter font-semibold text-stone-800 mb-4">
              Order Status
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-inter text-sm text-stone-600 mb-1">
                  Order Status
                </label>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange('status', e.target.value)}
                  disabled={saving}
                  className="w-full px-4 py-2 border border-stone-200 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block font-inter text-sm text-stone-600 mb-1">
                  Payment Status
                </label>
                <select
                  value={order.payment_status}
                  onChange={(e) => handleStatusChange('payment_status', e.target.value)}
                  disabled={saving}
                  className="w-full px-4 py-2 border border-stone-200 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="font-inter font-semibold text-stone-800 mb-4">
              Order Items
            </h2>
            <div className="space-y-3">
              {order.items?.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-3 border-b border-stone-100 last:border-0">
                  <div>
                    <p className="font-inter text-stone-800">{item.product_name}</p>
                    <p className="font-inter text-sm text-stone-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-inter font-semibold text-stone-800">
                    {formatPrice(item.price_try * item.quantity, 'TRY')}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-stone-200 flex justify-between">
              <span className="font-inter font-semibold text-stone-800">Total</span>
              <span className="font-playfair text-xl font-bold text-amber-600">
                {formatPrice(order.display_total || order.total_try, order.currency || 'TRY')}
              </span>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="font-inter font-semibold text-stone-800 mb-4">
                Order Notes
              </h2>
              <p className="font-inter text-stone-600">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Customer Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="font-inter font-semibold text-stone-800 mb-4">
              Customer Details
            </h2>
            <div className="space-y-3 font-inter text-sm">
              <div>
                <p className="text-stone-500">Name</p>
                <p className="text-stone-800">{order.customer_name}</p>
              </div>
              <div>
                <p className="text-stone-500">Email</p>
                <p className="text-stone-800">{order.customer_email}</p>
              </div>
              {order.customer_phone && (
                <div>
                  <p className="text-stone-500">Phone</p>
                  <p className="text-stone-800">{order.customer_phone}</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="font-inter font-semibold text-stone-800 mb-4">
              Shipping Address
            </h2>
            <div className="font-inter text-sm text-stone-600">
              <p>{order.customer_address}</p>
              <p>{order.customer_city}</p>
              <p>{order.customer_country}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="font-inter font-semibold text-stone-800 mb-4">
              Order Info
            </h2>
            <div className="space-y-2 font-inter text-sm">
              <div className="flex justify-between">
                <span className="text-stone-500">Created</span>
                <span className="text-stone-800">{formatDate(order.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Payment Method</span>
                <span className="text-stone-800">Bank Transfer</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Currency</span>
                <span className="text-stone-800">{order.currency}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
