import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="font-inter text-rose-500 uppercase tracking-widest text-sm mb-2">Our Story</p>
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-stone-800">
              About Lunaris Ceramic
            </h1>
          </div>

          <div className="space-y-8">
            <div className="bg-white/80 rounded-3xl shadow-pastel p-8 md:p-10 border border-rose-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-rose-500 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h2 className="font-playfair text-2xl font-bold text-stone-800">
                  Our Story
                </h2>
              </div>
              <p className="font-inter text-stone-600 mb-4 leading-relaxed">
                Lunaris Ceramic was born from a deep passion for the art of pottery and a desire to bring
                unique, handcrafted pieces into people&apos;s homes. Each piece we create carries the warmth
                of human touch and the beauty of traditional craftsmanship.
              </p>
              <p className="font-inter text-stone-600 leading-relaxed">
                Our artisans combine time-honored techniques with contemporary designs to create ceramics
                that are both functional and artistic. From everyday cups to decorative masterpieces,
                every item is made with care and attention to detail.
              </p>
            </div>

            <div className="bg-white/80 rounded-3xl shadow-pastel p-8 md:p-10 border border-violet-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-violet-500 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <h2 className="font-playfair text-2xl font-bold text-stone-800">
                  Our Craft
                </h2>
              </div>
              <p className="font-inter text-stone-600 mb-4 leading-relaxed">
                We believe in the beauty of imperfection. Each piece is handmade, meaning no two items
                are exactly alike. This uniqueness is what makes our ceramics special - they carry
                character and soul that mass-produced items simply cannot replicate.
              </p>
              <p className="font-inter text-stone-600 leading-relaxed">
                From the initial shaping on the wheel to the final glaze firing, every step of our
                process is done with intention and care. We use high-quality materials and
                food-safe glazes to ensure our products are both beautiful and safe for everyday use.
              </p>
            </div>

            <div className="bg-white/80 rounded-3xl shadow-pastel p-8 md:p-10 border border-teal-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-500 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="font-playfair text-2xl font-bold text-stone-800">
                  Worldwide Shipping
                </h2>
              </div>
              <p className="font-inter text-stone-600 leading-relaxed">
                We ship our ceramics worldwide with careful packaging to ensure your pieces arrive
                safely. Each item is wrapped with care and protection, because we know how special
                these handcrafted pieces are to you.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
