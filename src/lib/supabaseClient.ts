import { createClient } from '@supabase/supabase-js';

// Only initialize Supabase on the client side to avoid server-side rendering issues
let supabase: ReturnType<typeof createClient>;

if (typeof window !== 'undefined') {
  // We're on the client side
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase credentials. Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are defined.');
  }
  
  supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
} else {
  // Handle server-side - create a dummy object for SSR
  // This will be replaced with the real Supabase client on the client side
  supabase = {} as ReturnType<typeof createClient>;
}

export { supabase };
