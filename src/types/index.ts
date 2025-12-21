export interface Product {
  id: number;
  category_id: number;
  name: string;
  name_en: string;
  name_tr: string;
  description: string;
  description_en: string;
  description_tr: string;
  price_try: number;
  in_stock: boolean;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  images?: ProductImage[];
  category?: Category;
}

export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  is_primary: boolean;
  sort_order: number;
}

export interface Category {
  id: number;
  name: string;
  name_en: string;
  name_tr: string;
  slug: string;
  image: string | null;
  sort_order: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  customer_city: string;
  customer_country: string;
  total_try: number;
  currency: 'TRY' | 'EUR' | 'USD';
  display_total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  payment_method: 'bank_transfer';
  payment_status: 'pending' | 'paid';
  notes: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price_try: number;
}

export interface ExchangeRate {
  id: number;
  currency: string;
  rate: number;
  updated_at: string;
}

export interface AdminUser {
  id: number;
  username: string;
  name: string;
  role: 'admin' | 'editor';
  last_login: string | null;
}
