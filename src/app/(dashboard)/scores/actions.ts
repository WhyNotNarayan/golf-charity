'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitScore(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const scoreValue = parseInt(formData.get('score') as string)
  const scoreDate = formData.get('date') as string

  if (scoreValue < 1 || scoreValue > 45 || !scoreDate) {
     throw new Error('Invalid score data')
  }

  // Fetch current scores
  const { data: currentScores } = await supabase
    .from('scores')
    .select('id')
    .eq('user_id', user.id)
    .order('date', { ascending: true })

  // Implement Rolling 5-Score logic
  if (currentScores && currentScores.length >= 5) {
    const idsToDelete = currentScores.slice(0, currentScores.length - 4).map(s => s.id)
    await supabase.from('scores').delete().in('id', idsToDelete)
  }

  // Insert the new score
  const { error } = await supabase.from('scores').insert({
    user_id: user.id,
    value: scoreValue,
    date: scoreDate
  })

  if (error) {
    console.error('Score insert error:', error)
    throw new Error('Database Error: ' + error.message)
  }

  // Revalidate to update UI immediately
  revalidatePath('/scores')
  revalidatePath('/dashboard')
}
