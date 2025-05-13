import { createClient } from '@supabase/supabase-js';

// Add error handling and fallback values for environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Enforce environment variables to be defined
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env.local file.');
  
  if (typeof window !== 'undefined') {
    // Browser-side error handling
    document.addEventListener('DOMContentLoaded', () => {
      document.body.innerHTML = `
        <div style="text-align: center; padding: 2rem; font-family: system-ui, sans-serif;">
          <h1>Configuration Error</h1>
          <p>Missing required environment variables for Supabase.</p>
          <p>Please check server logs and configuration.</p>
        </div>
      `;
    });
  }
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);
