'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateCharityPreferences(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const charityId = formData.get('charityId') as string
  const percentage = parseFloat(formData.get('percentage') as string)

  if (percentage < 10 || percentage > 100) {
    throw new Error('Percentage must be strictly between 10 and 100')
  }

  // Find if they already have an active subscription record
  const { data: sub } = await supabase.from('subscriptions').select('id').eq('user_id', user.id).maybeSingle()

  if (sub) {
    // Update existing subscription preference
    const { error } = await supabase
      .from('subscriptions')
      .update({ charity_id: charityId, charity_percentage: percentage })
      .eq('id', sub.id)
      
    if (error) throw new Error('Database Error: ' + error.message)
  } else {
    // Upsert a pending inactive subscription just to hold the preference
    const { error } = await supabase
      .from('subscriptions')
      .insert({ 
         user_id: user.id, 
         charity_id: charityId, 
         charity_percentage: percentage,
         status: 'inactive'
      })
      
    if (error) throw new Error('Database Error: ' + error.message)
  }

  revalidatePath('/charity')
  revalidatePath('/dashboard')
}
