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
        <main className="flex-1 py-12">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <div className="bg-white/80 rounded-3xl shadow-pastel p-12">
              <div className="w-20 h-20 bg-gradient-to-br from-teal-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="font-playfair text-3xl font-bold text-stone-800 mb-4">
                Order Confirmed!
              </h1>
              <p className="font-inter text-stone-600 mb-2">
                Thank you for your order. Your order number is:
              </p>
              <p className="font-inter text-2xl font-bold bg-gradient-to-r from-rose-500 to-violet-500 bg-clip-text text-transparent mb-8">
                {orderNumber}
              </p>

              <div className="bg-gradient-to-br from-rose-50 to-violet-50 rounded-2xl p-6 text-left mb-8 border border-rose-100">
                <h3 className="font-inter font-semibold text-stone-800 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-rose-400 rounded-full"></span>
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
                We have sent a confirmation email to <strong className="text-rose-500">{formData.email}</strong>
              </p>

              <button
                onClick={() => router.push('/products')}
                className="px-8 py-3 bg-gradient-to-r from-rose-500 to-rose-400 text-white font-inter font-semibold rounded-full hover:from-rose-600 hover:to-rose-500 transition-all shadow-md"
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
      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="font-inter text-rose-500 uppercase tracking-widest text-sm mb-2">Almost There</p>
            <h1 className="font-playfair text-3xl md:text-4xl font-bold text-stone-800">
              Checkout
            </h1>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Form */}
            <div className="md:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white/80 rounded-2xl shadow-pastel p-6">
                <h2 className="font-inter font-semibold text-stone-800 mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 bg-rose-400 rounded-full"></span>
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
                      className="w-full px-4 py-3 border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white/80 transition-all"
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
                        className="w-full px-4 py-3 border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white/80 transition-all"
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
                        className="w-full px-4 py-3 border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white/80 transition-all"
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
                      className="w-full px-4 py-3 border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white/80 transition-all"
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
                        className="w-full px-4 py-3 border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white/80 transition-all"
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
                        className="w-full px-4 py-3 border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white/80 transition-all"
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
                      className="w-full px-4 py-3 border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white/80 transition-all"
                    />
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-rose-100">
                  <h2 className="font-inter font-semibold text-stone-800 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-violet-400 rounded-full"></span>
                    Payment Method
                  </h2>
                  <div className="bg-gradient-to-br from-violet-50 to-rose-50 rounded-xl p-4 border border-violet-100">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-violet-500 flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-violet-500"></div>
                      </div>
                      <span className="font-inter text-stone-800 font-medium">Bank Transfer</span>
                    </div>
                    <p className="mt-2 text-sm text-stone-600 font-inter ml-8">
                      You will receive bank details after placing your order.
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-8 w-full px-6 py-4 bg-gradient-to-r from-rose-500 to-violet-500 text-white font-inter font-semibold rounded-full hover:from-rose-600 hover:to-violet-600 transition-all shadow-md disabled:from-stone-300 disabled:to-stone-300"
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-white/80 rounded-2xl shadow-pastel p-6 sticky top-24">
                <h2 className="font-inter font-semibold text-stone-800 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-teal-400 rounded-full"></span>
                  Order Summary
                </h2>
                <div className="space-y-3">
                  {items.map(item => (
                    <div key={item.product.id} className="flex justify-between text-sm font-inter">
                      <span className="text-stone-600">
                        {item.product.name_en} x {item.quantity}
                      </span>
                      <span className="text-stone-800 font-medium">
                        {format(convert(item.product.price_try * item.quantity))}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-rose-100 flex justify-between items-center">
                  <span className="font-inter font-semibold text-stone-800">Total</span>
                  <span className="font-playfair text-xl font-bold bg-gradient-to-r from-rose-500 to-violet-500 bg-clip-text text-transparent">
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
