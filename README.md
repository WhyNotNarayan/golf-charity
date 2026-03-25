# ⛳️ ImpactDraw: Your Swing, Their Hope.

ImpactDraw is a premium, subscription-based charity platform designed for golfers. It transforms every score into a life-changing contribution, merging the love of the game with global philanthropic impact.

### 🌟 Core Mission
ImpactDraw empowers golfers to give back while they play. For just $10/month, members enter exclusive prize draws, with 10% or more of proceeds funding pediatric medical care and clean water initiatives.

---

### 🚀 Key Features

- **💎 Premium Experience**: A cinematic dark-mode UI designed for an emotional and high-end philanthropic feel.
- **🏌️‍♂️ Smart Score Tracking**: Securely log and verify your last 5 Stableford scores with a minimalist interface.
- **🎲 Monthly Prize Draws**: Automated, randomized draw engine that matches scores (3, 4, or 5 matches) to collective jackpots.
- **🌍 Personalized Impact**: Users choose their cause—Medical Impact (surgeries) or Water Impact (clean water for a year).
- **🛡️ Admin Command Center**: A sophisticated dashboard for authorized admins to simulate, execute, and verify monthly winners.
- **📱 Fully Responsive**: A fluid mobile experience with a dedicated bottom-bar navigation system for effortless phone use.

---

### 💻 Technology Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Proxy, Turbopack)
- **Database & Auth**: [Supabase](https://supabase.com/) (Auth, RLS, Storage)
- **Payments**: [Stripe](https://stripe.com/) (Monthly Subscriptions, Webhooks)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Glassmorphism, Micro-animations)
- **Deployment**: [Vercel](https://vercel.com/) (Automatic CI/CD Pipeline)

---

### 🛠️ Getting Started Locally

1. **Clone & Install**:
   ```bash
   git clone https://github.com/WhyNotNarayan/golf-charity.git
   npm install
   ```

2. **Environment Sync**:
   Create a `.env.local` in the **root directory** with your Supabase and Stripe keys.

3. **Run Dev**:
   ```bash
   npm run dev
   ```

---

**Designed for Impact. Built for the Game.** 🏆🏌️‍♂️🌍
