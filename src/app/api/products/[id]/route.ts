import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { Product, ProductImage } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const products = await query<Product[]>(
      `SELECT p.*, c.name as category_name, c.slug as category_slug
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = ?`,
      [id]
    );

    if (products.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const product = products[0];
    const images = await query<ProductImage[]>(
      'SELECT * FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, sort_order ASC',
      [id]
    );
    product.images = images;

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      category_id,
      name,
      name_en,
      name_tr,
      description,
      description_en,
      description_tr,
      price_try,
      in_stock,
      featured,
      images
    } = body;

    await query(
      `UPDATE products SET
       category_id = ?, name = ?, name_en = ?, name_tr = ?,
       description = ?, description_en = ?, description_tr = ?,
       price_try = ?, in_stock = ?, featured = ?
       WHERE id = ?`,
      [category_id, name, name_en, name_tr, description, description_en, description_tr, price_try, in_stock, featured, id]
    );

    // Update images if provided
    if (images && Array.isArray(images)) {
      await query('DELETE FROM product_images WHERE product_id = ?', [id]);
      for (let i = 0; i < images.length; i++) {
        await query(
          'INSERT INTO product_images (product_id, image_url, is_primary, sort_order) VALUES (?, ?, ?, ?)',
          [id, images[i], i === 0, i]
        );
      }
    }

    return NextResponse.json({ message: 'Product updated' });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await query('DELETE FROM products WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
