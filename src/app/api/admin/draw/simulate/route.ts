import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return new NextResponse('Unauthorized', { status: 401 })

    // Check Admin status
    const { data: profile } = await supabase
      .from('subscriptions')
      .select('is_admin')
      .eq('user_id', user.id)
      .maybeSingle()

    if (!profile?.is_admin) {
      return new NextResponse('Forbidden', { status: 403 })
    }

    // 1. Calculate the Monthly Revenue & Prize Pools
    // For this demo, we assume each 'active' subscription is $10
    const { count: activeSubs } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')

    const totalRevenue = (activeSubs || 0) * 10
    // Split: 40% Match-5, 35% Match-4, 25% Match-3
    const match_5_pool = totalRevenue * 0.40
    const match_4_pool = totalRevenue * 0.35
    const match_3_pool = totalRevenue * 0.25

    // 2. Generate Winning Combination (5 unique numbers 1-45)
    const winningNumbers: number[] = []
    while (winningNumbers.length < 5) {
      const num = Math.floor(Math.random() * 45) + 1
      if (!winningNumbers.includes(num)) winningNumbers.push(num)
    }
    winningNumbers.sort((a, b) => a - b)

    // 3. Find Winners
    // Fetch all scores for the current period
    const { data: allScores } = await supabase
      .from('scores')
      .select('user_id, value')

    // Group by user
    const userMatches: Record<string, number> = {}
    allScores?.forEach(s => {
      if (winningNumbers.includes(s.value)) {
        userMatches[s.user_id] = (userMatches[s.user_id] || 0) + 1
      }
    })

    const winners = {
      match5: Object.values(userMatches).filter(m => m === 5).length,
      match4: Object.values(userMatches).filter(m => m === 4).length,
      match3: Object.values(userMatches).filter(m => m === 3).length,
    }

    return NextResponse.json({
      month: new Date().toISOString().slice(0, 7), // YYYY-MM
      winningNumbers,
      pools: {
        jackpot: match_5_pool,
        match4: match_4_pool,
        match3: match_3_pool
      },
      winnerCounts: winners,
      totalRevenue
    })
  } catch (error: any) {
    console.error('Simulation Error:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
