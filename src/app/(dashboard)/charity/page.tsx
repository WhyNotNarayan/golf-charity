import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CharityForm } from './CharityForm'
import { updateCharityPreferences } from './actions'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function CharityPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Load the current preference from subscriptions
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('charity_id, charity_percentage')
    .eq('user_id', user.id)
    .maybeSingle()

  let { data: charities } = await supabase
    .from('charities')
    .select('*')
    .order('name')

  // If there are no charities in the DB, inject some defaults exactly once so the user has options
  if (!charities || charities.length === 0) {
    await supabase.from('charities').insert([
      { name: 'World Wildlife Fund', description: 'Conserving nature and reducing the most pressing threats to the diversity of life on Earth.' },
      { name: 'St. Jude Children Research', description: 'Advancing cures, and means of prevention, for pediatric catastrophic diseases.' },
      { name: 'Global Clean Water Initiative', description: 'Providing clean, safe drinking water access to remote villages globally.' }
    ])
    const refreshed = await supabase.from('charities').select('*').order('name')
    charities = refreshed.data
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-8 font-sans selection:bg-rose-500 selection:text-white">
      <div className="max-w-4xl mx-auto flex flex-col gap-10 mt-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              Charitable <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Impact</span>
            </h1>
            <p className="text-lg text-slate-400">Select which foundation you want to support with your monthly subscription. A minimum of 10% is required.</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-2 rounded-2xl flex gap-1">
             <Link href="/dashboard" className="px-6 py-2 hover:bg-slate-800 rounded-xl font-bold text-sm transition text-slate-400 hover:text-white">Overview</Link>
             <Link href="/scores" className="px-6 py-2 hover:bg-slate-800 rounded-xl font-bold text-sm transition text-slate-400 hover:text-white">Scores</Link>
             <Link href="/charity" className="px-6 py-2 bg-slate-800 rounded-xl font-bold text-sm">Charity</Link>
          </div>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-md p-8 md:p-10 rounded-3xl shadow-2xl border border-slate-800">
          <CharityForm sub={sub} charities={charities} action={updateCharityPreferences} />
        </div>
      </div>
    </div>
  )
}
