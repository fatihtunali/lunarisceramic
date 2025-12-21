import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { Category } from '@/types';

export async function GET() {
  try {
    const categories = await query<Category[]>(
      'SELECT * FROM categories ORDER BY sort_order ASC'
    );
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, name_en, name_tr, slug, image } = body;

    await query(
      'INSERT INTO categories (name, name_en, name_tr, slug, image) VALUES (?, ?, ?, ?, ?)',
      [name, name_en, name_tr, slug, image]
    );

    return NextResponse.json({ message: 'Category created' }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
