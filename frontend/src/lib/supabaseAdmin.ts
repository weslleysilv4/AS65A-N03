/**
 * Cliente Supabase simplificado usando Service Role Key
 * Use este arquivo temporariamente se houver problemas com políticas RLS
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    'Supabase URL or Service Role Key are not defined in environment variables'
  );
}

// Cliente com service role - tem permissões completas
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Cliente público padrão (manter para outras operações)
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, anonKey || serviceRoleKey);
