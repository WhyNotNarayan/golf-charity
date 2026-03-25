import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
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

    const { numbers, month } = await req.json()

    // 1. Calculate Final Pools (Re-verify logic to prevent manipulation)
    const { count: activeSubs } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')

    const totalRevenue = (activeSubs || 0) * 10
    const pools = {
      match5: totalRevenue * 0.40,
      match4: totalRevenue * 0.35,
      match3: totalRevenue * 0.25
    }

    // 2. Insert Draw Record
    const { data: draw, error: drawErr } = await supabase
      .from('draws')
      .insert({
        month,
        total_pool: totalRevenue,
        winning_combination: numbers,
        status: 'published'
      })
      .select()
      .single()

    if (drawErr) throw drawErr

    // 3. Find Winners & Insert
    const { data: allScores } = await supabase.from('scores').select('user_id, value')
    const userMatches: Record<string, number> = {}
    allScores?.forEach(s => {
      if (numbers.includes(s.value)) {
        userMatches[s.user_id] = (userMatches[s.user_id] || 0) + 1
      }
    })

    const match5Winners = Object.keys(userMatches).filter(uid => userMatches[uid] === 5)
    const match4Winners = Object.keys(userMatches).filter(uid => userMatches[uid] === 4)
    const match3Winners = Object.keys(userMatches).filter(uid => userMatches[uid] === 3)

    const winnerRecords: any[] = []
    
    // Helper to calculate share
    const addWinners = (uids: string[], type: number, pool: number) => {
      if (uids.length === 0) return
      const share = pool / uids.length
      uids.forEach(uid => {
        winnerRecords.push({
          draw_id: draw.id,
          user_id: uid,
          match_type: type,
          prize_amount: share,
          status: 'pending'
        })
      })
    }

    addWinners(match5Winners, 5, pools.match5)
    addWinners(match4Winners, 4, pools.match4)
    addWinners(match3Winners, 3, pools.match3)

    if (winnerRecords.length > 0) {
      await supabase.from('winners').insert(winnerRecords)
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Execution Error:', error)
    return new NextResponse(error.message || 'Internal Error', { status: 500 })
  }
}
