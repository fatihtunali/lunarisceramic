'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPriceTRY, clearCart } = useCart();
  const { currency, convert, format } = useCurrency();
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    notes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          customer_address: formData.address,
          customer_city: formData.city,
          customer_country: formData.country,
          items: items.map(item => ({
            product_id: item.product.id,
            product_name: item.product.name_en,
            quantity: item.quantity,
            price_try: item.product.price_try
          })),
          total_try: totalPriceTRY,
          currency: currency,
          display_total: convert(totalPriceTRY),
          notes: formData.notes
        })
      });

      const data = await response.json();

      if (response.ok) {
        setOrderNumber(data.order_number);
        setOrderComplete(true);
        clearCart();
      } else {
        alert('Failed to place order. Please try again.');
      }
    } catch (error) {
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && !orderComplete) {
    router.push('/cart');
    return null;
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-stone-50 py-12">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <div className="bg-white rounded-lg shadow-sm p-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="font-playfair text-3xl font-bold text-stone-800 mb-4">
                Order Confirmed!
              </h1>
              <p className="font-inter text-stone-600 mb-2">
                Thank you for your order. Your order number is:
              </p>
              <p className="font-inter text-2xl font-bold text-amber-600 mb-8">
                {orderNumber}
              </p>

              <div className="bg-amber-50 rounded-lg p-6 text-left mb-8">
                <h3 className="font-inter font-semibold text-stone-800 mb-4">
                  Bank Transfer Details
                </h3>
                <div className="space-y-2 font-inter text-sm text-stone-600">
                  <p><strong>Bank:</strong> [Bank Name]</p>
                  <p><strong>Account Name:</strong> Lunaris Ceramic</p>
                  <p><strong>IBAN:</strong> [IBAN Number]</p>
                  <p><strong>Reference:</strong> {orderNumber}</p>
                </div>
                <p className="mt-4 text-sm text-stone-500">
                  Please include your order number as the payment reference.
                </p>
              </div>

              <p className="font-inter text-stone-600 mb-6">
                We have sent a confirmation email to <strong>{formData.email}</strong>
              </p>

              <button
                onClick={() => router.push('/products')}
                className="px-6 py-3 bg-amber-600 text-white font-inter rounded hover:bg-amber-700 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-stone-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-playfair text-3xl font-bold text-stone-800 mb-8">
            Checkout
          </h1>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Form */}
            <div className="md:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="font-inter font-semibold text-stone-800 mb-6">
                  Shipping Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block font-inter text-sm text-stone-600 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-stone-200 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-inter text-sm text-stone-600 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-stone-200 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block font-inter text-sm text-stone-600 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-stone-200 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-inter text-sm text-stone-600 mb-1">
                      Address *
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      rows={3}
                      className="w-full px-4 py-2 border border-stone-200 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-inter text-sm text-stone-600 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-stone-200 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block font-inter text-sm text-stone-600 mb-1">
                        Country *
                      </label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-stone-200 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="">Select country</option>
                        <option value="Turkey">Turkey</option>
                        <option value="Germany">Germany</option>
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="France">France</option>
                        <option value="Netherlands">Netherlands</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-inter text-sm text-stone-600 mb-1">
                      Order Notes
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={2}
                      placeholder="Any special instructions..."
                      className="w-full px-4 py-2 border border-stone-200 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-stone-100">
                  <h2 className="font-inter font-semibold text-stone-800 mb-4">
                    Payment Method
                  </h2>
                  <div className="bg-amber-50 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <input type="radio" checked readOnly className="text-amber-600" />
                      <span className="font-inter text-stone-800">Bank Transfer</span>
                    </div>
                    <p className="mt-2 text-sm text-stone-600 font-inter">
                      You will receive bank details after placing your order.
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-8 w-full px-6 py-4 bg-amber-600 text-white font-inter font-semibold rounded hover:bg-amber-700 transition-colors disabled:bg-stone-300"
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="font-inter font-semibold text-stone-800 mb-4">
                  Order Summary
                </h2>
                <div className="space-y-3">
                  {items.map(item => (
                    <div key={item.product.id} className="flex justify-between text-sm font-inter">
                      <span className="text-stone-600">
                        {item.product.name_en} x {item.quantity}
                      </span>
                      <span className="text-stone-800">
                        {format(convert(item.product.price_try * item.quantity))}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-stone-100 flex justify-between">
                  <span className="font-inter font-semibold text-stone-800">Total</span>
                  <span className="font-playfair text-xl font-bold text-amber-600">
                    {format(convert(totalPriceTRY))}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
