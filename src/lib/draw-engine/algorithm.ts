export async function simulateDraw(supabaseAdmin: any) {
  // Fetch subscriptions and pools
  const { data: subs } = await supabaseAdmin.from('subscriptions').select('id').eq('status', 'active')
  const totalSubRevenue = (subs?.length || 0) * 10.00 // Assuming $10/mo default
  
  const pools = {
    match_5_pool: totalSubRevenue * 0.40,
    match_4_pool: totalSubRevenue * 0.35,
    match_3_pool: totalSubRevenue * 0.25,
  }

  // Draw 5 winning numbers (1-45 weighted by frequency)
  const { data: userScores } = await supabaseAdmin.from('scores').select('score')
  
  const freqMap = new Map<number, number>()
  userScores?.forEach(({ score }: any) => {
    freqMap.set(score, (freqMap.get(score) || 0) + 1)
  })

  let weightedPool: number[] = []
  for (let i = 1; i <= 45; i++) {
    const occurrences = freqMap.get(i) || 1
    for (let j = 0; j < occurrences; j++) weightedPool.push(i)
  }

  const draw: number[] = []
  while (draw.length < 5) {
    const randomIndex = Math.floor(Math.random() * weightedPool.length)
    const chosen = weightedPool[randomIndex]
    if (!draw.includes(chosen)) {
      draw.push(chosen)
    }
  }
  
  const winningNumbers = draw.sort((a: number,b: number) => a - b)
  return { winningNumbers, pools }
}
