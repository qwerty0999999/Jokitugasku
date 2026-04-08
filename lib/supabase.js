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

export const supabase = createClient(safeUrl, safeKey)
