'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BlogPost } from '@/types';

const categoryLabels: Record<string, string> = {
  'production': 'Production Process',
  'behind-scenes': 'Behind the Scenes',
  'care-tips': 'Care & Tips'
};

const categoryColors: Record<string, string> = {
  'production': 'bg-rose-100 text-rose-700',
  'behind-scenes': 'bg-violet-100 text-violet-700',
  'care-tips': 'bg-teal-100 text-teal-700'
};

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/blog/${slug}`)
      .then(r => {
        if (!r.ok) throw new Error('Not found');
        return r.json();
      })
      .then(data => {
        if (!data.published) {
          router.push('/blog');
          return;
        }
        setPost(data);
        setLoading(false);
      })
      .catch(() => {
        router.push('/blog');
      });
  }, [slug, router]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-rose-100 via-violet-100 to-teal-100 py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center text-rose-500 font-inter text-sm mb-6 hover:text-rose-600 transition-colors"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Blog
            </Link>
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-inter font-medium ${categoryColors[post.category]}`}>
                {categoryLabels[post.category]}
              </span>
              <span className="text-stone-500 text-sm font-inter">
                {formatDate(post.created_at)}
              </span>
            </div>
            <h1 className="font-playfair text-3xl md:text-5xl font-bold text-stone-800 mb-6">
              {post.title_en}
            </h1>
            {post.excerpt_en && (
              <p className="font-inter text-lg text-stone-600 max-w-2xl mx-auto">
                {post.excerpt_en}
              </p>
            )}
          </div>
        </div>

        {/* Cover Image */}
        {post.cover_image && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-pastel-lg">
              <Image
                src={post.cover_image}
                alt={post.title_en}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        )}

        {/* Content */}
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div
            className="prose prose-lg prose-stone max-w-none
              prose-headings:font-playfair prose-headings:text-stone-800
              prose-p:font-inter prose-p:text-stone-600 prose-p:leading-relaxed
              prose-a:text-rose-500 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-stone-800
              prose-ul:font-inter prose-ol:font-inter
              prose-li:text-stone-600
              prose-img:rounded-xl prose-img:shadow-pastel"
            dangerouslySetInnerHTML={{ __html: post.content_en }}
          />
        </article>

        {/* Back to Blog */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="border-t border-rose-100 pt-8">
            <Link
              href="/blog"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-rose-500 to-violet-500 text-white font-inter font-medium rounded-full hover:from-rose-600 hover:to-violet-600 transition-all shadow-md"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              More Articles
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
