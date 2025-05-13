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

// Helper function to generate a random 4-character code
export const generateCode = async (resourceType: 'text' | 'file', resourceId: string, expiry: string) => {
  // Generate expiry date
  const expiryDate = expiry === "24h" 
    ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() 
    : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  // Generate a random code (4 characters with letters and numbers)
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
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
