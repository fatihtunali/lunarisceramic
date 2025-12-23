import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { BlogPost } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const posts = await query<BlogPost[]>(
      'SELECT * FROM blog_posts WHERE slug = ?',
      [slug]
    );

    if (posts.length === 0) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    return NextResponse.json(posts[0]);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const {
      title_en,
      title_tr,
      excerpt_en,
      excerpt_tr,
      content_en,
      content_tr,
      cover_image,
      category,
      published,
      new_slug
    } = body;

    await query(
      `UPDATE blog_posts SET
       title_en = ?, title_tr = ?,
       excerpt_en = ?, excerpt_tr = ?,
       content_en = ?, content_tr = ?,
       cover_image = ?, category = ?, published = ?
       ${new_slug ? ', slug = ?' : ''}
       WHERE slug = ?`,
      new_slug
        ? [title_en, title_tr, excerpt_en, excerpt_tr, content_en, content_tr, cover_image, category, published, new_slug, slug]
        : [title_en, title_tr, excerpt_en, excerpt_tr, content_en, content_tr, cover_image, category, published, slug]
    );

    return NextResponse.json({ message: 'Blog post updated', slug: new_slug || slug });
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await query('DELETE FROM blog_posts WHERE slug = ?', [slug]);
    return NextResponse.json({ message: 'Blog post deleted' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
}
