import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import DrawInterface from '@/app/(admin)/admin/draws/DrawInterface'

export const dynamic = 'force-dynamic'

export default async function AdminDrawsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Check if user is an admin in the database
  const { data: profile } = await supabase
    .from('subscriptions') // We can store it here or in a 'users' table
    .select('is_admin')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!profile?.is_admin) {
    redirect('/')
  }

  // Fetch past draws
  const { data: pastDraws } = await supabase
    .from('draws')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-8 font-sans selection:bg-rose-500 selection:text-white">
      <div className="max-w-6xl mx-auto flex flex-col gap-10 mt-12">
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Command <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400 font-black">Control</span>
          </h1>
          <p className="text-lg text-slate-400 font-medium">Monthly Draw Execution, Prize Distribution, and Winning Logic.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Execution Area */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
              <DrawInterface />
            </div>
          </div>

          {/* History Sidebar */}
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl flex flex-col gap-6 h-fit">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="text-orange-400">📜</span> Draw History
            </h2>
            <div className="flex flex-col gap-4">
              {pastDraws && pastDraws.length > 0 ? pastDraws.map((draw: any) => (
                <div key={draw.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex justify-between items-center group transition hover:border-slate-700">
                  <div>
                    <p className="font-bold text-slate-200">{draw.month}</p>
                    <p className="text-xs text-slate-500">Pool: ${Number(draw.total_pool).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-1">
                    {draw.winning_combination.map((num: number) => (
                      <div key={num} className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold">{num}</div>
                    ))}
                  </div>
                </div>
              )) : (
                <p className="text-slate-500 italic text-sm text-center py-4 bg-slate-950 rounded-2xl border border-dashed border-slate-800">No draws executed yet.</p>
              )}
            </div>
            <Link href="/dashboard" className="text-center py-3 bg-slate-800 rounded-xl text-sm font-bold hover:bg-slate-700 transition">Return to Player Dashboard</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
