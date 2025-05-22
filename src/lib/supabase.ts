
import { createClient } from '@supabase/supabase-js';

// Get environment variables or use placeholders for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Create a warning instead of throwing an error
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('⚠️ Supabase environment variables are missing. The application will run in development mode with limited functionality. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Типы данных для таблиц
export type ProductType = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  created_at?: string;
}

export type CartItemType = {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'completed' | 'cancelled';

export type OrderType = {
  id: number;
  user_id: string;
  items: CartItemType[];
  total: number;
  status: OrderStatus;
  address: string;
  created_at: string;
  customerName?: string;
  customerEmail?: string;
}
