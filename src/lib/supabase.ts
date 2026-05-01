import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Detect Stripe keys being used by mistake (very common error)
const isStripeKey = supabaseAnonKey.startsWith('sb_publishable_') || supabaseAnonKey.startsWith('pk_');
if (isStripeKey) {
  console.error('❌ CRITICAL ERROR: You are using a STRIPE key as your Supabase Anon Key. Please use the "anon public" key from your Supabase Dashboard.');
}

if (!supabaseUrl || !supabaseAnonKey || isStripeKey) {
  console.warn('⚠️ Supabase credentials invalid or missing. Application will run in a limited state.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  isStripeKey ? '' : (supabaseAnonKey || '')
);
