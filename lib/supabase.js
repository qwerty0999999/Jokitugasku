import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validasi URL Supabase dasar
const isValidUrl = (url) => {
  try {
    return Boolean(new URL(url))
  } catch {
    return false
  }
}

const safeUrl = isValidUrl(supabaseUrl) ? supabaseUrl : 'https://placeholder-none.supabase.co'
const safeKey = supabaseAnonKey || 'placeholder'

if (!supabaseUrl || !supabaseAnonKey) {
  if (typeof window !== 'undefined') {
    console.warn('⚠️ Supabase environment variables are missing. Connection will fail.')
  }
}

// Client untuk frontend (anon key)
export const supabase = createClient(safeUrl, safeKey)

/**
 * Factory untuk server-side Supabase client dengan Service Role Key.
 * Bypass RLS — gunakan HANYA di API routes / server-side code.
 * @returns {import('@supabase/supabase-js').SupabaseClient}
 */
export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error('Supabase environment variables (URL or Service Role Key) are missing.')
  }

  return createClient(url, key)
}
