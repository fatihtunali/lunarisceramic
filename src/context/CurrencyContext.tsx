'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Currency = 'TRY' | 'EUR' | 'USD';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  rates: { EUR: number; USD: number };
  convert: (amountTRY: number) => number;
  format: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('TRY');
  const [rates, setRates] = useState({ EUR: 0.028, USD: 0.030 });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Load saved currency preference
      const saved = localStorage.getItem('lunaris-currency') as Currency;
      if (saved && ['TRY', 'EUR', 'USD'].includes(saved)) {
        setCurrency(saved);
      }

      // Fetch exchange rates
      fetch('/api/exchange-rates')
        .then(res => res.json())
        .then(data => setRates(data))
        .catch(console.error);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lunaris-currency', currency);
    }
  }, [currency]);

  const convert = (amountTRY: number): number => {
    if (currency === 'TRY') return amountTRY;
    if (currency === 'EUR') return Math.round(amountTRY * rates.EUR * 100) / 100;
    if (currency === 'USD') return Math.round(amountTRY * rates.USD * 100) / 100;
    return amountTRY;
  };

  const format = (amount: number): string => {
    return new Intl.NumberFormat(currency === 'TRY' ? 'tr-TR' : 'en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, rates, convert, format }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
