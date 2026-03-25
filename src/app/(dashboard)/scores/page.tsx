import { createClient } from '@/lib/supabase/server'
import { submitScore } from './actions'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function ScoresPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')
  
  const { data: scores } = await supabase
    .from('scores')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false }) // Reverse chronological
    .limit(5)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-8 font-sans selection:bg-rose-500 selection:text-white">
      <div className="max-w-5xl mx-auto flex flex-col gap-10 mt-4 md:mt-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              My <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Scores</span>
            </h1>
            <p className="text-lg text-slate-400">
              Enter your Stableford scores (1-45). Only your rolling last 5 scores are permanently kept.
            </p>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 p-2 rounded-2xl flex gap-1">
             <Link href="/dashboard" className="px-6 py-2 hover:bg-slate-800 rounded-xl font-bold text-sm transition text-slate-400 hover:text-white">Overview</Link>
             <Link href="/scores" className="px-6 py-2 bg-slate-800 rounded-xl font-bold text-sm">Scores</Link>
             <Link href="/charity" className="px-6 py-2 hover:bg-slate-800 rounded-xl font-bold text-sm transition text-slate-400 hover:text-white">Charity</Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add Score Form */}
          <div className="bg-slate-900/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-slate-800">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl">✍️</div>
              <h2 className="text-2xl font-bold">Log New Score</h2>
            </div>
            
            <form action={submitScore} className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <label htmlFor="score" className="text-sm font-semibold tracking-wide text-slate-300 uppercase">
                  Stableford Score (1-45)
                </label>
                <input 
                  type="number" 
                  id="score" 
                  name="score" 
                  min="1" 
                  max="45" 
                  required 
                  className="bg-slate-950 border-2 border-slate-800 p-4 rounded-xl outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 text-white font-mono text-xl transition-all placeholder-slate-700" 
                  placeholder="e.g. 36" 
                />
              </div>
              
              <div className="flex flex-col gap-3">
                <label htmlFor="date" className="text-sm font-semibold tracking-wide text-slate-300 uppercase">
                  Date Played
                </label>
                <input 
                  type="date" 
                  id="date" 
                  name="date" 
                  required 
                  className="bg-slate-950 border-2 border-slate-800 p-4 rounded-xl outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 text-white font-mono text-xl transition-all [color-scheme:dark]" 
                />
              </div>
              
              <button 
                type="submit" 
                className="mt-6 w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all hover:scale-[1.02] active:scale-95"
              >
                Submit Score
              </button>
            </form>
          </div>

          {/* Recent Scores List */}
          <div className="bg-slate-900/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-slate-800 flex flex-col">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center text-2xl">⛳</div>
              <h2 className="text-2xl font-bold">Recent Scores</h2>
            </div>
            
            {scores && scores.length > 0 ? (
              <ul className="flex flex-col gap-4 flex-1">
                {scores.map((score: any) => (
                  <li key={score.id} className="flex justify-between items-center p-5 bg-slate-950 rounded-2xl border border-slate-800 shadow-inner group transition hover:border-slate-700 hover:bg-slate-900 cursor-default">
                    <span className="font-black text-3xl text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-400 group-hover:from-emerald-300 group-hover:to-teal-300 transition">
                      {score.value} <span className="text-lg opacity-50 font-medium">pts</span>
                    </span>
                    <span className="text-sm text-slate-400 font-medium bg-slate-900 border border-slate-800 px-4 py-2 rounded-full hidden sm:block">
                      {new Date(score.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center flex-1 py-12 px-4 text-center border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
                <span className="text-5xl mb-6 opacity-40">🏌️‍♂️</span>
                <p className="text-slate-300 font-medium text-lg">No scores logged yet.</p>
                <p className="text-slate-500 mt-2">Submit your first score on the left panel to get started.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
