import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { Product, ProductImage } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category');
    const featured = searchParams.get('featured');

    let sql = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    const params: unknown[] = [];

    if (categoryId) {
      sql += ' AND p.category_id = ?';
      params.push(categoryId);
    }

    if (featured === 'true') {
      sql += ' AND p.featured = 1';
    }

    sql += ' ORDER BY p.sort_order ASC, p.created_at DESC';

    const products = await query<Product[]>(sql, params);

    // Get images for each product
    for (const product of products) {
      const images = await query<ProductImage[]>(
        'SELECT * FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, sort_order ASC',
        [product.id]
      );
      product.images = images;
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      category_id,
      name,
      name_en,
      name_tr,
      description,
      description_en,
      description_tr,
      story_en = '',
      story_tr = '',
      price_try,
      in_stock = true,
      featured = false,
      images = []
    } = body;

    const result = await query<{ insertId: number }>(
      `INSERT INTO products
       (category_id, name, name_en, name_tr, description, description_en, description_tr, story_en, story_tr, price_try, in_stock, featured)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [category_id, name, name_en, name_tr, description, description_en, description_tr, story_en, story_tr, price_try, in_stock, featured]
    );

    const productId = (result as unknown as { insertId: number }).insertId;

    // Insert images
    for (let i = 0; i < images.length; i++) {
      await query(
        'INSERT INTO product_images (product_id, image_url, is_primary, sort_order) VALUES (?, ?, ?, ?)',
        [productId, images[i], i === 0, i]
      );
    }

    return NextResponse.json({ id: productId, message: 'Product created' }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
