import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || ''

export const isSupabaseConfigured = !!(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('seu-projeto')
)

if (!isSupabaseConfigured) {
  console.warn(
    'Supabase não configurado. Crie o arquivo web/.env com VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY (veja .env.example) e reinicie o servidor (npm run dev).'
  )
}

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || '')
