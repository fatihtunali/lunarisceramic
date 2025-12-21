import { query } from './db';
import { ExchangeRate } from '@/types';

export async function getExchangeRates(): Promise<{ EUR: number; USD: number }> {
  const rates = await query<ExchangeRate[]>('SELECT currency, rate FROM exchange_rates');

  const rateMap: { EUR: number; USD: number } = { EUR: 0.028, USD: 0.030 };

  for (const rate of rates) {
    if (rate.currency === 'EUR') rateMap.EUR = Number(rate.rate);
    if (rate.currency === 'USD') rateMap.USD = Number(rate.rate);
  }

  return rateMap;
}

export function convertCurrency(amountTRY: number, currency: 'TRY' | 'EUR' | 'USD', rates: { EUR: number; USD: number }): number {
  if (currency === 'TRY') return amountTRY;
  if (currency === 'EUR') return Math.round(amountTRY * rates.EUR * 100) / 100;
  if (currency === 'USD') return Math.round(amountTRY * rates.USD * 100) / 100;
  return amountTRY;
}

export function formatCurrency(amount: number, currency: 'TRY' | 'EUR' | 'USD'): string {
  const formatter = new Intl.NumberFormat(currency === 'TRY' ? 'tr-TR' : 'en-US', {
    style: 'currency',
    currency: currency,
  });
  return formatter.format(amount);
}

export async function updateExchangeRates(eurRate: number, usdRate: number): Promise<void> {
  await query('UPDATE exchange_rates SET rate = ? WHERE currency = ?', [eurRate, 'EUR']);
  await query('UPDATE exchange_rates SET rate = ? WHERE currency = ?', [usdRate, 'USD']);
}
