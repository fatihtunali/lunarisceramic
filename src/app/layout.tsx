import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Lunaris Ceramic | Handmade Ceramic Art",
    template: "%s | Lunaris Ceramic"
  },
  description: "Discover unique handmade ceramic pieces - cups, wine glasses, decorative items. Each piece is artisan crafted with love in Turkey.",
  keywords: ["ceramic", "handmade", "pottery", "cups", "wine glasses", "Turkish ceramic", "artisan", "decorative"],
  authors: [{ name: "Lunaris Ceramic" }],
  creator: "Lunaris Ceramic",
  metadataBase: new URL("https://lunarisceramic.com"),
  icons: {
    icon: '/favicon.png',
    apple: '/logo/logo.png',
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://lunarisceramic.com",
    siteName: "Lunaris Ceramic",
    title: "Lunaris Ceramic | Handmade Ceramic Art",
    description: "Discover unique handmade ceramic pieces - cups, wine glasses, decorative items. Each piece is artisan crafted with love in Turkey.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Lunaris Ceramic - Handmade Ceramic Art",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lunaris Ceramic | Handmade Ceramic Art",
    description: "Discover unique handmade ceramic pieces - cups, wine glasses, decorative items. Artisan crafted in Turkey.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
