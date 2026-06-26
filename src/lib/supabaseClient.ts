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

// Dummy storage to prevent localStorage errors on the server in Next.js
const dummyStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {}
};

export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      storage: typeof window !== 'undefined' ? window.localStorage : dummyStorage,
      persistSession: true,
    }
  }
);

export const getExpiryDate = (expiry: string) => {
  const now = Date.now();
  switch (expiry) {
    case '1h': return new Date(now + 1 * 60 * 60 * 1000).toISOString();
    case '2h': return new Date(now + 2 * 60 * 60 * 1000).toISOString();
    case '7h': return new Date(now + 7 * 60 * 60 * 1000).toISOString();
    case '1d': return new Date(now + 24 * 60 * 60 * 1000).toISOString();
    case '7d': return new Date(now + 7 * 24 * 60 * 60 * 1000).toISOString();
    default: return new Date(now + 24 * 60 * 60 * 1000).toISOString(); // fallback to 1d
  }
};

// Helper function to generate a random 4-character code
export const generateCode = async (resourceType: 'text' | 'file', resourceId: string, expiry: string) => {
  // Generate expiry date
  const expiryDate = getExpiryDate(expiry);

  // Generate a random code (4 digits)
  const characters = '0123456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  // Save the code to the database
  const { error } = await supabase
    .from('codes')
    .insert([{
      code,
      resource_type: resourceType,
      resource_id: resourceId,
      expiry: expiryDate
    }]);
    
  if (error) {
    console.error("Error saving code:", error);
    return null;
  }
  
  return code;
};
