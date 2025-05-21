
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Отсутствуют переменные окружения SUPABASE. Проверьте наличие VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY');
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

export type OrderType = {
  id: number;
  user_id: string;
  items: CartItemType[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'completed' | 'cancelled';
  address: string;
  created_at: string;
  customerName?: string;
  customerEmail?: string;
}

export type OrderStatus = OrderType['status'];

