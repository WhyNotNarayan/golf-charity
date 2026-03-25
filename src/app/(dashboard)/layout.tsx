import { ReactNode } from 'react'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b sticky top-0 z-50">
        <h2 className="font-bold text-xl text-blue-600">Golf Charity</h2>
        <div className="flex gap-4">
           {/* Simple mobile nav links */}
           <a href="/dashboard" className="text-xs font-bold text-gray-500 uppercase">Home</a>
           <form action="/auth/signout" method="POST">
             <button type="submit" className="text-xs font-bold text-red-500 uppercase">Exit</button>
           </form>
        </div>
      </div>

      {/* Desktop Sidebar / Mobile Bottom Nav */}
      <nav className="w-full md:w-64 bg-white border-r p-6 hidden md:flex flex-col gap-6 sticky top-0 h-screen">
        <h2 className="font-bold text-2xl text-blue-600">Golf Charity</h2>
        <ul className="flex flex-col gap-3">
          <li><a href="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">Overview</a></li>
          <li><a href="/scores" className="text-gray-700 hover:text-blue-600 font-medium">My Scores</a></li>
          <li><a href="/charity" className="text-gray-700 hover:text-blue-600 font-medium">Charity Settings</a></li>
          <li><a href="/winnings" className="text-gray-700 hover:text-blue-600 font-medium">Draw & Winnings</a></li>
        </ul>
        <div className="mt-auto">
          <form action="/auth/signout" method="POST">
             <button type="submit" className="text-gray-600 hover:text-red-600 text-sm font-medium">Sign Out</button>
          </form>
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-3 z-50">
        <a href="/dashboard" className="text-[10px] font-bold uppercase text-gray-500 flex flex-col items-center gap-1">
          <span>🏠</span> Dash
        </a>
        <a href="/scores" className="text-[10px] font-bold uppercase text-gray-500 flex flex-col items-center gap-1">
          <span>⛳️</span> Scores
        </a>
        <a href="/winnings" className="text-[10px] font-bold uppercase text-gray-500 flex flex-col items-center gap-1">
          <span>🏆</span> Win
        </a>
      </nav>

      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        <div className="p-4 sm:p-8 md:p-12 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
