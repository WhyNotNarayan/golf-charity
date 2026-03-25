import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function POST(request: Request) {
  const supabase = await createClient()

  // Sign out the user
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Sign Out Error:', error.message)
    // Even if there is an error, we redirect to login to be safe
  }

  revalidatePath('/', 'layout')
  return redirect('/')
}
