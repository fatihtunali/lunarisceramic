import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { BlogPost } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const published = searchParams.get('published');

    let sql = 'SELECT * FROM blog_posts WHERE 1=1';
    const params: unknown[] = [];

    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }

    if (published === 'true') {
      sql += ' AND published = 1';
    }

    sql += ' ORDER BY created_at DESC';

    const posts = await query<BlogPost[]>(sql, params);
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      slug,
      title_en,
      title_tr,
      excerpt_en = '',
      excerpt_tr = '',
      content_en,
      content_tr,
      cover_image = '',
      category = 'production',
      published = false
    } = body;

    // Generate slug from title if not provided
    const finalSlug = slug || title_en.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const result = await query<{ insertId: number }>(
      `INSERT INTO blog_posts
       (slug, title_en, title_tr, excerpt_en, excerpt_tr, content_en, content_tr, cover_image, category, published)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [finalSlug, title_en, title_tr, excerpt_en, excerpt_tr, content_en, content_tr, cover_image, category, published]
    );

    const postId = (result as unknown as { insertId: number }).insertId;

    return NextResponse.json({ id: postId, slug: finalSlug, message: 'Blog post created' }, { status: 201 });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
  }
}
