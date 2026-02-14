import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  console.warn('Warning: SUPABASE_URL not set. Supabase operations will fail.');
}

// Use service role key for server-side operations (bypasses RLS)
// Falls back to anon key if service role key is not available
const supabaseKey = supabaseServiceKey || process.env.VITE_SUPABASE_ANON_KEY;

export const supabaseAdmin = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export default supabaseAdmin;
