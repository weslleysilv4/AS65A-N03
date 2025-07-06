import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validation to ensure environment variables have been loaded correctly
if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Supabase URL or Service Role Key are not defined in the .env'
  );
}

// Create and export the Supabase client
// Note the options inside the auth object; these are important when running on the backend
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    // Prevents the client from trying to automatically refresh the token. On the server we handle this manually.
    autoRefreshToken: false,
    // Prevents the client from persisting the session (e.g., in localStorage), which does not make sense on the backend.
    persistSession: false,
  },
});
