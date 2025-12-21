import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-stone-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-playfair text-4xl font-bold text-stone-800 text-center mb-8">
            About Lunaris Ceramic
          </h1>

          <div className="prose prose-stone max-w-none">
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="font-playfair text-2xl font-bold text-stone-800 mb-4">
                Our Story
              </h2>
              <p className="font-inter text-stone-600 mb-4">
                Lunaris Ceramic was born from a deep passion for the art of pottery and a desire to bring
                unique, handcrafted pieces into people&apos;s homes. Each piece we create carries the warmth
                of human touch and the beauty of traditional craftsmanship.
              </p>
              <p className="font-inter text-stone-600">
                Our artisans combine time-honored techniques with contemporary designs to create ceramics
                that are both functional and artistic. From everyday cups to decorative masterpieces,
                every item is made with care and attention to detail.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="font-playfair text-2xl font-bold text-stone-800 mb-4">
                Our Craft
              </h2>
              <p className="font-inter text-stone-600 mb-4">
                We believe in the beauty of imperfection. Each piece is handmade, meaning no two items
                are exactly alike. This uniqueness is what makes our ceramics special - they carry
                character and soul that mass-produced items simply cannot replicate.
              </p>
              <p className="font-inter text-stone-600">
                From the initial shaping on the wheel to the final glaze firing, every step of our
                process is done with intention and care. We use high-quality materials and
                food-safe glazes to ensure our products are both beautiful and safe for everyday use.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="font-playfair text-2xl font-bold text-stone-800 mb-4">
                Worldwide Shipping
              </h2>
              <p className="font-inter text-stone-600">
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
