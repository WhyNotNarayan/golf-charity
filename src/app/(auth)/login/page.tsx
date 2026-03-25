import { login } from '../actions'
import Link from 'next/link'

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col font-sans selection:bg-rose-500 selection:text-white relative overflow-hidden">
      {/* Background Decorative Blurs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-rose-500/10 blur-[120px] -translate-x-1/2 -translate-y-1/2 rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] translate-x-1/2 translate-y-1/2 rounded-full"></div>

      <nav className="p-6 md:px-12 relative z-10">
        <Link href="/" className="text-2xl font-black tracking-tighter flex items-center gap-2 w-fit">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-orange-400"></div>
          ImpactDraw
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="bg-slate-900/50 backdrop-blur-3xl border border-slate-800 p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem]"></div>

            <div className="relative z-10">
              <h1 className="text-4xl font-black tracking-tight mb-2">Welcome <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">Back</span></h1>
              <p className="text-slate-400 font-medium mb-10">Sign in to your player dashboard.</p>

              {error && (
                <div className="mb-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-sm font-bold flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                  {error}
                </div>
              )}

              <form className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="name@example.com"
                    className="bg-slate-950 border-2 border-slate-800 p-4 rounded-2xl outline-none focus:border-rose-500/50 focus:ring-4 focus:ring-rose-500/10 text-white font-medium transition-all placeholder:text-slate-700"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center ml-1">
                    <label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-slate-500">Password</label>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    className="bg-slate-950 border-2 border-slate-800 p-4 rounded-2xl outline-none focus:border-rose-500/50 focus:ring-4 focus:ring-rose-500/10 text-white font-medium transition-all placeholder:text-slate-700"
                  />
                </div>

                <button
                  formAction={login}
                  className="mt-4 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-black py-4 rounded-2xl hover:shadow-[0_0_30px_rgba(244,63,94,0.3)] transition-all hover:scale-[1.02] active:scale-95 text-lg"
                >
                  Enter Dashboard
                </button>
              </form>

              <div className="mt-10 pt-8 border-t border-slate-800 text-center">
                <p className="text-slate-500 text-sm font-medium">
                  Don't have an account? <Link href="/signup" className="text-white hover:text-rose-400 font-bold transition-colors">Join the Draw</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
