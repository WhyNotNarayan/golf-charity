import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Hero Section with Cinematic Image */}
      <section className="relative min-h-[90vh] flex flex-col">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero.png" 
            alt="Golfing for Impact" 
            className="w-full h-full object-cover opacity-40 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/20 to-slate-950"></div>
        </div>

        {/* Navigation */}
        <nav className="relative z-20 flex items-center justify-between p-6 md:px-12 lg:px-24">
          <div className="text-2xl font-black tracking-tighter flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-orange-400 shadow-lg shadow-rose-500/30"></div>
            ImpactDraw
          </div>
          <div className="flex gap-4 items-center">
            <Link href="/login" className="px-5 py-2.5 text-sm font-bold hover:text-rose-400 transition-colors uppercase tracking-widest">
              Sign In
            </Link>
            <Link href="/signup" className="px-6 py-3 text-sm font-black bg-white text-slate-950 rounded-full hover:bg-slate-200 transition-all hover:scale-105 shadow-xl">
              JOIN THE CAUSE
            </Link>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center pt-20 pb-32">
          <div className="mb-8 inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-sm font-bold text-rose-400 animate-in fade-in slide-in-from-top-4 duration-1000">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            A Global Community of Golfers Giving Back
          </div>
          
          <h1 className="max-w-5xl text-6xl md:text-8xl lg:text-9xl font-black tracking-tight leading-[0.95] mb-10 drop-shadow-2xl">
            Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">Swing,</span><br />
            Their <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 italic">Hope.</span>
          </h1>
          
          <p className="max-w-2xl text-xl md:text-2xl text-slate-300 font-medium mb-14 leading-relaxed opacity-90">
            For just $10/mo, enter monthly prize draws while funding life-saving medical care and clean water initiatives globally.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 w-full justify-center max-w-lg">
            <Link href="/signup" className="group relative flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-rose-500 to-orange-500 rounded-full text-white font-black text-xl overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_50px_rgba(244,63,94,0.4)] active:scale-95">
              Start Your Journey
            </Link>
          </div>
        </div>
      </section>

      {/* Impact Story Section */}
      <section className="py-32 px-6 bg-slate-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-12">
            <div className="inline-block px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl font-black text-xs uppercase tracking-widest">Real Stories, Real Impact</div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
              Golf is just the <span className="text-emerald-400">beginning.</span>
            </h2>
            <p className="text-xl text-slate-400 leading-relaxed font-medium">
              We believe the game of golf has the power to change the world. Every score you log, every monthly draw you enter, contributes directly to foundations that provide pediatric care and clean water to communities in need.
            </p>
            
            <div className="grid grid-cols-2 gap-8 pt-8">
              <div>
                <p className="text-5xl font-black text-white mb-2">$150k+</p>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Total Raised Yearly</p>
              </div>
              <div>
                <p className="text-5xl font-black text-white mb-2">12,400</p>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Lives Transformed</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 relative">
             <div className="space-y-4 pt-12">
                <div className="rounded-[2.5rem] overflow-hidden border-2 border-slate-800 shadow-2xl transition-transform hover:-translate-y-2 duration-500">
                   <img src="/images/impact-medical.png" alt="Medical Impact" className="w-full grayscale hover:grayscale-0 transition-all duration-700" />
                </div>
                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800">
                   <p className="text-sm font-bold text-slate-400 italic">"Because of ImpactDraw, we can fund 100+ surgeries this month alone."</p>
                </div>
             </div>
             <div className="space-y-4">
                <div className="bg-emerald-500 p-8 rounded-[3rem] text-emerald-950 font-black flex flex-col justify-between aspect-square">
                   <span className="text-4xl text-emerald-900/50 italic opacity-40 font-black font-sans tracking-tighter">Impact</span>
                   <p className="text-lg leading-tight">Your $10 subscription provides clean water for a village family of 4 - for an entire year.</p>
                </div>
                <div className="rounded-[2.5rem] overflow-hidden border-2 border-slate-800 shadow-2xl transition-transform hover:-translate-y-2 duration-500">
                   <img src="/images/impact-water.png" alt="Water Project" className="w-full grayscale hover:grayscale-0 transition-all duration-700" />
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Clean UI Feature List */}
      <section className="py-32 px-6 border-t border-slate-900 bg-slate-950/50 backdrop-blur-3xl">
         <div className="max-w-6xl mx-auto">
            <div className="text-center mb-24">
               <h2 className="text-4xl font-black mb-4">The Platform <span className="text-rose-400">Redefined.</span></h2>
               <p className="text-slate-500 font-medium">Modern tools for modern impact.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               {[
                 { icon: '🏌️‍♂️', title: 'Smart Tracking', text: 'Securely log your rolling last 5 Stableford scores with a clean, minimalist interface.' },
                 { icon: '💎', title: 'Premium Rewards', text: 'Match 3, 4, or 5 scores in our randomized monthly draw to win collective jackpots.' },
                 { icon: '🌍', title: 'Global Charity', text: 'Automatically pledge 10% or more to a charity of your choice. Track your direct impact.' }
               ].map((f, i) => (
                 <div key={i} className="flex flex-col gap-6 p-10 rounded-[2.5rem] bg-slate-900/30 border border-slate-800 hover:border-slate-700 transition-all hover:-translate-y-1">
                    <div className="text-4xl">{f.icon}</div>
                    <h3 className="text-xl font-bold">{f.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed font-medium">{f.text}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Footer-ish CTA */}
      <footer className="py-32 bg-slate-950 text-center border-t border-slate-900">
         <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-4xl md:text-6xl font-black mb-8">Ready to make your <span className="text-rose-400">mark?</span></h2>
            <Link href="/signup" className="inline-block px-12 py-5 bg-white text-slate-950 rounded-full font-black text-xl hover:bg-slate-200 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-white/5">
               JOIN THE MOVEMENT
            </Link>
         </div>
      </footer>
    </div>
  );
}
