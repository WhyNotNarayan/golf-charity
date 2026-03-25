import { ReactNode } from 'react'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <nav className="w-full md:w-64 bg-white border-r p-6 flex flex-col gap-6">
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
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
