import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get subscription status and charity info
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('status, plan_type, charity_percentage, charities(name)')
    .eq('user_id', user.id)
    .maybeSingle()

  // Get user winnings
  const { data: winners } = await supabase
    .from('winners')
    .select('prize_amount, status')
    .eq('user_id', user.id)

  const totalWinnings = winners?.reduce((sum, w) => sum + Number(w.prize_amount), 0) || 0
  const winCount = winners?.length || 0

  // Get last draw
  const { data: lastDraw } = await supabase
    .from('draws')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  // Get last 5 scores
  const { data: scores } = await supabase
    .from('scores')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .limit(5)

  const isActive = sub?.status === 'active'

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-8 font-sans selection:bg-rose-500 selection:text-white">
      <div className="max-w-6xl mx-auto flex flex-col gap-10 mt-4 md:mt-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              Player <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">Dashboard</span>
            </h1>
            <p className="text-lg text-slate-400">Manage your game, tracking your impact, and prep for the draw.</p>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 p-2 rounded-2xl flex gap-1">
             <Link href="/dashboard" className="px-6 py-2 bg-slate-800 rounded-xl font-bold text-sm">Overview</Link>
             <Link href="/scores" className="px-6 py-2 hover:bg-slate-800 rounded-xl font-bold text-sm transition text-slate-400 hover:text-white">Scores</Link>
             <Link href="/charity" className="px-6 py-2 hover:bg-slate-800 rounded-xl font-bold text-sm transition text-slate-400 hover:text-white">Charity</Link>
          </div>
        </div>

        {/* Status Banner */}
        {!isActive ? (
          <div className="group relative p-8 bg-slate-900 rounded-3xl border border-rose-500/30 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 blur-3xl -mr-20 -mt-20"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-black text-rose-400 mb-2 flex items-center gap-3 justify-center md:justify-start">
                  <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse"></span>
                  Action Required
                </h2>
                <p className="text-slate-300 font-medium">Your subscription is currently inactive. You must subscribe to enter this month's $10,000+ prize pool draw.</p>
              </div>
              <form action="/api/stripe/checkout" method="POST">
                <button type="submit" className="px-10 py-5 bg-rose-600 text-white rounded-2xl font-black text-lg hover:bg-rose-500 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-rose-900/40">
                  Subscribe Now ($10/mo)
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="p-8 bg-slate-900 rounded-3xl border border-emerald-500/30">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-black text-emerald-400 mb-2">Subscription Active</h2>
                <p className="text-slate-300">You are fully eligible for this month's draw. Good luck!</p>
              </div>
              <div className="px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 font-bold">
                {sub.plan_type === 'yearly' ? 'Yearly VIP Member' : 'Monthly Member'}
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Recent Scores Card */}
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <span className="text-rose-400">⛳</span> Recent Scores
              </h3>
              <Link href="/scores" className="text-xs font-bold text-slate-500 hover:text-emerald-400 transition uppercase tracking-widest">View All</Link>
            </div>
            
            <div className="flex gap-3">
              {[0, 1, 2, 3, 4].map((i) => {
                const score = scores?.[i]
                return (
                  <div key={i} className={`flex-1 flex items-center justify-center aspect-square rounded-2xl border-2 font-black text-xl transition-all ${score ? 'bg-slate-950 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'bg-slate-950/50 border-slate-800 text-slate-800'}`}>
                    {score ? score.value : '—'}
                  </div>
                )
              })}
            </div>
            {!scores?.length && <p className="text-slate-500 text-sm italic">You haven't logged any scores yet.</p>}
          </div>

          {/* Charity Card */}
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <span className="text-sky-400">🌍</span> Charity Impact
              </h3>
              <Link href="/charity" className="text-xs font-bold text-slate-500 hover:text-emerald-400 transition uppercase tracking-widest">Manage</Link>
            </div>
            
            <div className="flex-1 flex flex-col justify-center">
              {sub?.charities ? (
                <div className="space-y-4">
                  <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Current Beneficiary</p>
                    <p className="text-xl font-black text-white">{(sub.charities as any).name}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${sub.charity_percentage}%` }}></div>
                    </div>
                    <span className="font-black text-2xl text-emerald-400">{sub.charity_percentage}%</span>
                  </div>
                </div>
              ) : (
                <div className="p-8 bg-slate-950/50 border border-dashed border-slate-800 rounded-2xl text-center">
                   <p className="text-slate-400 font-medium mb-4">No charity selected yet.</p>
                   <Link href="/charity" className="inline-block px-6 py-3 bg-slate-800 hover:bg-slate-700 transition rounded-xl font-bold text-sm">Choose Your Cause</Link>
                </div>
              )}
            </div>
          </div>

          {/* Winnings/Draw Card (Spans both cols on desktop) */}
          <div className="md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-8 rounded-3xl flex flex-col md:flex-row gap-8 items-center overflow-hidden relative">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <div className="text-9xl font-black italic tracking-tighter">WIN</div>
             </div>
             
             <div className="flex-1 space-y-4 relative z-10 text-center md:text-left">
                <h3 className="text-xl font-bold flex items-center gap-2 justify-center md:justify-start">
                  <span className="text-yellow-400">🏆</span> Prize Status
                </h3>
                <p className="text-slate-400">Monthly draws are executed on the 1st of every month. Ensure your 5 scores are up to date.</p>
                <div className="flex gap-4 justify-center md:justify-start items-center">
                   <div className="bg-slate-800 border border-slate-700 px-6 py-4 rounded-2xl">
                      <p className="text-[10px] font-black uppercase text-slate-500 mb-1">Total Winnings</p>
                      <p className="text-2xl font-black text-emerald-400">${totalWinnings.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                   </div>
                   <div className="bg-slate-800 border border-slate-700 px-6 py-4 rounded-2xl">
                      <p className="text-[10px] font-black uppercase text-slate-500 mb-1">Confirmed Wins</p>
                      <p className="text-2xl font-black text-white">{winCount}</p>
                   </div>
                </div>
             </div>

             <div className="w-px h-24 bg-slate-800 hidden md:block"></div>

             <div className="flex flex-col gap-4 text-center md:text-right relative z-10">
                <p className="text-xs font-black uppercase tracking-widest text-slate-500">{lastDraw ? 'Latest Draw Numbers' : 'Next Official Draw'}</p>
                <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                   {lastDraw ? 
                    new Date(lastDraw.month + '-02').toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : 
                    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}
                </p>
                <div className="flex gap-2 justify-center md:justify-end">
                   {(lastDraw?.winning_combination || [0, 0, 0, 0, 0]).map((num: number, i: number) => (
                      <div key={i} className={`w-8 h-8 rounded-lg border flex items-center justify-center text-xs font-bold transition-all ${num ? 'bg-slate-950 border-emerald-500 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                        {num || '?'}
                      </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
