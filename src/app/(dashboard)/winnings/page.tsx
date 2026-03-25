import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function WinningsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: winners } = await supabase
    .from('winners')
    .select('*, draws(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-8 font-sans selection:bg-emerald-500 selection:text-white">
      <div className="max-w-5xl mx-auto flex flex-col gap-10 mt-4 md:mt-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              Hall of <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">Winners</span>
            </h1>
            <p className="text-lg text-slate-400">
              Your legacy of success and charitable impact.
            </p>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 p-2 rounded-2xl flex gap-1">
             <Link href="/dashboard" className="px-6 py-2 hover:bg-slate-800 rounded-xl font-bold text-sm transition text-slate-400 hover:text-white">Overview</Link>
             <Link href="/scores" className="px-6 py-2 hover:bg-slate-800 rounded-xl font-bold text-sm transition text-slate-400 hover:text-white">Scores</Link>
             <Link href="/charity" className="px-6 py-2 hover:bg-slate-800 rounded-xl font-bold text-sm transition text-slate-400 hover:text-white">Charity</Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <div className="bg-slate-900/80 backdrop-blur-md p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/5 blur-[100px] -mr-32 -mt-32"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-10">
                <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 text-yellow-500 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(234,179,8,0.1)]">🏆</div>
                <h2 className="text-2xl font-black">Prize History</h2>
              </div>
              
              {winners && winners.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {winners.map((win: any) => (
                    <div key={win.id} className="group p-6 bg-slate-950 rounded-3xl border border-slate-800 hover:border-yellow-500/30 transition-all duration-500 hover:shadow-[0_0_40px_rgba(234,179,8,0.05)] relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                         <div className="text-6xl font-black italic">#{win.match_type}</div>
                      </div>
                      
                      <div className="flex flex-col gap-6 relative z-10">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Prize Amount</p>
                            <p className="text-4xl font-black text-emerald-400">${Number(win.prize_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                          </div>
                          <div className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${win.status === 'pending' ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>
                            {win.status}
                          </div>
                        </div>

                        <div className="pt-6 border-t border-slate-900 flex justify-between items-center">
                          <div>
                            <p className="text-xs font-bold text-slate-300">Match {win.match_type} Combination</p>
                            <p className="text-[10px] text-slate-500 uppercase font-bold mt-1">
                              {new Date(win.draws.month + '-02').toLocaleString('default', { month: 'long', year: 'numeric' })} Draw
                            </p>
                          </div>
                          <button className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-black transition-all active:scale-95 shadow-lg">
                            {win.status === 'pending' ? 'Claim Prize' : 'View Details'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-24 flex flex-col items-center justify-center text-center">
                  <div className="w-24 h-24 rounded-3xl bg-slate-950 border border-slate-800 flex items-center justify-center text-4xl mb-6 opacity-40">🏟️</div>
                  <p className="text-xl font-bold text-slate-400 mb-2">The arena awaits your first win.</p>
                  <p className="text-sm text-slate-600 max-w-sm">Every monthly draw is a new opportunity. Ensure your scores are logged and subscription is active.</p>
                  <Link href="/dashboard" className="mt-8 px-8 py-3 bg-white text-slate-950 rounded-xl font-black text-sm hover:bg-slate-200 transition-all">Back to Dashboard</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
