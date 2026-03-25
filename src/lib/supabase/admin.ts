import { createClient } from '@supabase/supabase-js'

// Admin client bypasses RLS, useful for webhooks and background jobs
export function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
