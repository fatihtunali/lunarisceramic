import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { Order, OrderItem } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orders = await query<Order[]>(
      'SELECT * FROM orders WHERE id = ?',
      [id]
    );

    if (orders.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const order = orders[0];
    const items = await query<OrderItem[]>(
      'SELECT * FROM order_items WHERE order_id = ?',
      [id]
    );
    order.items = items;

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, payment_status, notes } = body;

    const updates: string[] = [];
    const values: unknown[] = [];

    if (status !== undefined) {
      updates.push('status = ?');
      values.push(status);
    }
    if (payment_status !== undefined) {
      updates.push('payment_status = ?');
      values.push(payment_status);
    }
    if (notes !== undefined) {
      updates.push('notes = ?');
      values.push(notes);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No updates provided' }, { status: 400 });
    }

    values.push(id);
    await query(
      `UPDATE orders SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    return NextResponse.json({ message: 'Order updated' });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
