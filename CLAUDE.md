# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture

This is a Next.js 16 e-commerce application for Lunaris Ceramic, a handmade ceramic art shop. It uses the App Router with React 19.

### Tech Stack
- **Framework**: Next.js 16 with App Router
- **Database**: MySQL (via mysql2/promise connection pool)
- **Styling**: Tailwind CSS 4
- **Auth**: JWT tokens stored in HTTP-only cookies (bcryptjs for password hashing)

### Directory Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes (REST endpoints)
│   │   ├── products/      # Product CRUD
│   │   ├── orders/        # Order management
│   │   ├── categories/    # Category listing
│   │   ├── auth/          # Login/logout/session
│   │   ├── upload/        # Image uploads
│   │   └── exchange-rates/ # Currency conversion rates
│   ├── admin/             # Protected admin panel
│   └── (public pages)     # products, cart, checkout, about, contact
├── components/            # Shared React components (Header, Footer, ProductCard)
├── context/               # React Context providers
│   ├── CartContext.tsx    # Shopping cart state (localStorage-persisted)
│   └── CurrencyContext.tsx # Currency selection (TRY/EUR/USD)
├── lib/                   # Utilities
│   ├── db.ts             # MySQL connection pool and query helper
│   ├── auth.ts           # JWT/session management
│   └── currency.ts       # Currency formatting
└── types/                 # TypeScript interfaces (Product, Order, Category, etc.)
```

### Key Patterns

- **API Routes**: All at `/api/*`, use the `query()` helper from `@/lib/db` for database access
- **Admin Auth**: Protected via client-side check in `admin/layout.tsx` that calls `/api/auth/me`
- **Prices**: Stored in TRY (Turkish Lira) in database, converted client-side via CurrencyContext
- **Multilingual**: Products have `name_en`/`name_tr` and `description_en`/`description_tr` fields
- **Path Alias**: `@/*` maps to `./src/*`

### Database Tables

Core tables: `products`, `product_images`, `categories`, `orders`, `order_items`, `admin_users`, `exchange_rates`

### Environment Variables

Copy `.env.example` to `.env.local`:
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT` - MySQL connection
- `JWT_SECRET` - For signing auth tokens
- `NEXT_PUBLIC_SITE_URL` - Public site URL
