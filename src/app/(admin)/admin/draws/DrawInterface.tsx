'use client'

import { useState } from 'react'

export default function DrawInterface() {
  const [simulation, setSimulation] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [published, setPublished] = useState(false)
  
  const handleSimulate = async () => {
    setLoading(true)
    setSimulation(null)
    try {
      const res = await fetch('/api/admin/draw/simulate', { method: 'POST' })
      if(res.ok) {
          const data = await res.json()
          setSimulation(data)
      } else {
          const err = await res.text()
          alert('Simulation failed: ' + err)
      }
    } finally {
      setLoading(false)
    }
  }
  
  const handleExecute = async () => {
    if(!confirm('Are you sure you want to officially publish this draw? This will distribute real prize amounts and notify winners.')) return;
      
    setLoading(true)
    try {
      const res = await fetch('/api/admin/draw/execute', { 
         method: 'POST',
         body: JSON.stringify({ numbers: simulation.winningNumbers, month: simulation.month })
      })
      if(res.ok) {
          alert('Draw Published Successfully!')
          setPublished(true)
          setSimulation(null)
      } else {
          const errMsg = await res.text()
          alert('Execution failed: ' + errMsg)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-10">
       <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-b border-slate-800 pb-10">
          <div>
             <h2 className="text-3xl font-black mb-2 flex items-center gap-3">
               <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse"></span>
               Monthly Draw Engine
             </h2>
             <p className="text-slate-400 font-medium italic">Target Window: {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })} Execution</p>
          </div>
          <button 
             onClick={handleSimulate} 
             disabled={loading} 
             className="relative px-10 py-5 bg-white text-slate-950 rounded-[2rem] font-black text-lg hover:bg-slate-200 transition-all disabled:opacity-50 overflow-hidden group active:scale-95 shadow-2xl shadow-white/10"
          >
             <span className="relative z-10 flex items-center gap-3">
               {loading ? 'Processing Logic...' : '⚡ Generate Full Simulation'}
             </span>
             <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-10 transition-opacity"></div>
          </button>
       </div>

       {simulation && !published && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
             <div className="flex flex-col gap-6">
                <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-400 ml-1">Simulated Winning Sequence</p>
                <div className="flex flex-wrap gap-4">
                   {simulation.winningNumbers.map((num: number) => (
                      <div key={num} className="w-20 h-20 rounded-3xl bg-slate-950 border-4 border-emerald-500/30 flex items-center justify-center text-4xl font-black text-emerald-400 shadow-[0_0_50px_rgba(16,185,129,0.15)] group hover:border-emerald-500 transition-all duration-300">
                         {num}
                      </div>
                   ))}
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-8 bg-slate-950 rounded-[2.5rem] border border-slate-800 relative group overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-5 text-4xl font-black">5#</div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Jackpot (5 Match)</p>
                   <p className="text-4xl font-black text-white mb-4">${Number(simulation.pools.jackpot).toLocaleString()}</p>
                   <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-900 w-fit px-3 py-1.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Winners: {simulation.winnerCounts.match5}
                   </div>
                </div>
                <div className="p-8 bg-slate-950 rounded-[2.5rem] border border-slate-800 relative group overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-5 text-4xl font-black">4#</div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Tier 2 (4 Match)</p>
                   <p className="text-4xl font-black text-white mb-4">${Number(simulation.pools.match4).toLocaleString()}</p>
                   <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-900 w-fit px-3 py-1.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                      Winners: {simulation.winnerCounts.match4}
                   </div>
                </div>
                <div className="p-8 bg-slate-950 rounded-[2.5rem] border border-slate-800 relative group overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-5 text-4xl font-black">3#</div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Tier 3 (3 Match)</p>
                   <p className="text-4xl font-black text-white mb-4">${Number(simulation.pools.match3).toLocaleString()}</p>
                   <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-900 w-fit px-3 py-1.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                      Winners: {simulation.winnerCounts.match3}
                   </div>
                </div>
             </div>

             <div className="group p-8 bg-rose-500/5 border-2 border-dashed border-rose-500/20 rounded-[2.5rem] flex flex-col lg:flex-row items-center justify-between gap-10 hover:bg-rose-500/10 transition-colors duration-500">
                <div className="flex items-center gap-6">
                   <div className="w-16 h-16 rounded-[1.5rem] bg-rose-500/20 text-rose-400 flex items-center justify-center text-3xl shadow-lg shadow-rose-950/20 animate-pulse">⚠️</div>
                   <div>
                      <h4 className="font-black text-xl mb-1 italic">Critical Review Required</h4>
                      <p className="text-sm text-slate-400 leading-relaxed max-w-xl">Review these results carefully before finalization. Publishing will commit funds to the database and trigger automated winner notifications.</p>
                   </div>
                </div>
                <button 
                   onClick={handleExecute}
                   className="w-full lg:w-auto px-12 py-5 bg-rose-600 hover:bg-gradient-to-r hover:from-rose-600 hover:to-orange-500 text-white rounded-[2rem] font-black text-lg transition-all active:scale-95 shadow-2xl shadow-rose-900/40 relative overflow-hidden group"
                >
                   <span className="relative z-10 tracking-tight">LOCK & PUBLISH RESULTS</span>
                </button>
             </div>
          </div>
       )}

       {!simulation && !loading && !published && (
          <div className="py-32 flex flex-col items-center justify-center text-center">
             <div className="relative mb-10 text-7xl group">
                <span className="relative z-10">🔋</span>
                <div className="absolute inset-0 bg-white/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
             </div>
             <p className="font-black text-2xl uppercase tracking-[0.2em] mb-3">System Awaiting Data</p>
             <p className="text-slate-500 max-w-sm font-medium">Connect to the monthly draw pool to simulate prize distribution and winner verification.</p>
          </div>
       )}

       {published && (
          <div className="py-32 flex flex-col items-center justify-center text-center text-emerald-400 animate-in zoom-in duration-700">
             <div className="text-8xl mb-10 drop-shadow-[0_0_30px_rgba(16,185,129,0.3)]">🛡️</div>
             <p className="font-black text-4xl tracking-tighter mb-4">Command Locked.</p>
             <p className="text-slate-400 max-w-md font-medium text-lg leading-relaxed">Results have been successfully committed. Prize pools are distributed and winners have been alerted via their dashboard.</p>
             <button onClick={() => setPublished(false)} className="mt-12 px-8 py-3 bg-slate-800 text-white hover:bg-slate-700 transition rounded-xl font-black text-xs uppercase tracking-widest shadow-xl">Return to Simulation Mode</button>
          </div>
       )}
    </div>
  )
}
