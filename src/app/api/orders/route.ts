import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { Order, OrderItem } from '@/types';

function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `LC${year}${month}${random}`;
}

export async function GET() {
  try {
    const orders = await query<Order[]>(
      'SELECT * FROM orders ORDER BY created_at DESC'
    );

    for (const order of orders) {
      const items = await query<OrderItem[]>(
        'SELECT * FROM order_items WHERE order_id = ?',
        [order.id]
      );
      order.items = items;
    }

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customer_name,
      customer_email,
      customer_phone,
      customer_address,
      customer_city,
      customer_country,
      items,
      total_try,
      currency,
      display_total,
      notes
    } = body;

    const orderNumber = generateOrderNumber();

    const result = await query<{ insertId: number }>(
      `INSERT INTO orders
       (order_number, customer_name, customer_email, customer_phone, customer_address,
        customer_city, customer_country, total_try, currency, display_total, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [orderNumber, customer_name, customer_email, customer_phone, customer_address,
       customer_city, customer_country, total_try, currency, display_total, notes]
    );

    const orderId = (result as unknown as { insertId: number }).insertId;

    // Insert order items
    for (const item of items) {
      await query(
        'INSERT INTO order_items (order_id, product_id, product_name, quantity, price_try) VALUES (?, ?, ?, ?, ?)',
        [orderId, item.product_id, item.product_name, item.quantity, item.price_try]
      );
    }

    return NextResponse.json({
      id: orderId,
      order_number: orderNumber,
      message: 'Order created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
