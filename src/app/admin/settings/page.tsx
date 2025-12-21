'use client';

import { useEffect, useState } from 'react';

export default function AdminSettingsPage() {
  const [rates, setRates] = useState({ EUR: 0.028, USD: 0.030 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/exchange-rates')
      .then(r => r.json())
      .then(data => {
        setRates(data);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/exchange-rates', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rates)
      });

      if (response.ok) {
        alert('Exchange rates updated successfully');
      } else {
        alert('Failed to update rates');
      }
    } catch {
      alert('Failed to update rates');
    } finally {
      setSaving(false);
    }
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
        Settings
      </h1>

      <div className="max-w-xl">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="font-inter font-semibold text-stone-800 mb-6">
            Exchange Rates
          </h2>
          <p className="font-inter text-sm text-stone-500 mb-6">
            Set the conversion rates from TRY to other currencies. These rates will be used to display prices in EUR and USD.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block font-inter text-sm text-stone-600 mb-1">
                1 TRY = ? EUR
              </label>
              <input
                type="number"
                value={rates.EUR}
                onChange={(e) => setRates({ ...rates, EUR: parseFloat(e.target.value) })}
                step="0.0001"
                min="0"
                className="w-full px-4 py-2 border border-stone-200 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <p className="mt-1 font-inter text-xs text-stone-400">
                Example: 1000 TRY = {(1000 * rates.EUR).toFixed(2)} EUR
              </p>
            </div>

            <div>
              <label className="block font-inter text-sm text-stone-600 mb-1">
                1 TRY = ? USD
              </label>
              <input
                type="number"
                value={rates.USD}
                onChange={(e) => setRates({ ...rates, USD: parseFloat(e.target.value) })}
                step="0.0001"
                min="0"
                className="w-full px-4 py-2 border border-stone-200 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <p className="mt-1 font-inter text-xs text-stone-400">
                Example: 1000 TRY = {(1000 * rates.USD).toFixed(2)} USD
              </p>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="mt-6 px-6 py-3 bg-amber-600 text-white font-inter rounded hover:bg-amber-700 transition-colors disabled:bg-stone-300"
          >
            {saving ? 'Saving...' : 'Save Rates'}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <h2 className="font-inter font-semibold text-stone-800 mb-4">
            Bank Details
          </h2>
          <p className="font-inter text-sm text-stone-500 mb-4">
            Update the bank details shown to customers after checkout. (Edit in checkout/page.tsx)
          </p>
          <div className="bg-stone-50 rounded p-4 font-inter text-sm text-stone-600">
            <p><strong>Bank:</strong> [Bank Name]</p>
            <p><strong>Account Name:</strong> Lunaris Ceramic</p>
            <p><strong>IBAN:</strong> [IBAN Number]</p>
          </div>
        </div>
      </div>
    </div>
  );
}
