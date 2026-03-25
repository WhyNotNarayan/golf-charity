'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

export function CharityForm({ sub, charities, action }: any) {
  const [pct, setPct] = useState(sub?.charity_percentage || 10)
  const [selected, setSelected] = useState(sub?.charity_id || null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        await action(formData)
        // Refresh to get latest data
        router.refresh()
      } catch (err: any) {
        alert(err.message)
      }
    })
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold tracking-wide">1. Select a Foundation</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          {charities?.map((charity: any) => (
            <label key={charity.id} className={`border-2 p-5 rounded-2xl cursor-pointer flex flex-col gap-2 transition-all ${selected === charity.id ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'border-slate-800 bg-slate-950 hover:border-slate-700'}`}>
              <div className="flex items-center gap-3">
                <input 
                  type="radio" 
                  name="charityId" 
                  value={charity.id} 
                  required
                  checked={selected === charity.id}
                  onChange={() => setSelected(charity.id)}
                  className="w-5 h-5 accent-emerald-500 cursor-pointer"
                />
                <span className="font-bold text-lg">{charity.name}</span>
              </div>
              <p className="text-sm text-slate-400 pl-8">{charity.description}</p>
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold tracking-wide">2. Donation Percentage</h2>
        <p className="text-sm text-slate-400">Decide how much of your monthly subscription is forwarded. (Min: 10%, Max: 100%)</p>
        <div className="flex items-center gap-6 mt-2 p-6 bg-slate-950 rounded-2xl border border-slate-800">
          <input 
            type="range" 
            name="percentage" 
            min="10" 
            max="100" 
            value={pct} 
            onChange={(e) => setPct(e.target.value)}
            className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <span className="font-black text-4xl text-emerald-400 w-24 text-right">
            {pct}%
          </span>
        </div>
      </div>

      <button disabled={isPending} type="submit" className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-5 rounded-xl font-bold text-lg hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:pointer-events-none self-start px-12 mt-4 flex items-center gap-3">
        {isPending ? 'Saving...' : 'Save Preferences'}
      </button>
    </form>
  )
}
