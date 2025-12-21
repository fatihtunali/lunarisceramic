import { NextRequest, NextResponse } from 'next/server';
import { getExchangeRates, updateExchangeRates } from '@/lib/currency';

export async function GET() {
  try {
    const rates = await getExchangeRates();
    return NextResponse.json(rates);
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    return NextResponse.json({ error: 'Failed to fetch rates' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { EUR, USD } = await request.json();
    await updateExchangeRates(EUR, USD);
    return NextResponse.json({ message: 'Rates updated' });
  } catch (error) {
    console.error('Error updating exchange rates:', error);
    return NextResponse.json({ error: 'Failed to update rates' }, { status: 500 });
  }
}
