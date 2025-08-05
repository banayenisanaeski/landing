// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

// Ortam değişkenlerinden Supabase URL ve Anon Key alınıyor
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Supabase tipi destekli client oluşturuluyor
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Giriş yapan kullanıcıyı kolayca almak için yardımcı fonksiyon
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) return null
  return data.user
}