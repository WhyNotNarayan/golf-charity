-- Users (Extended from Supabase Auth)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT,
  subscription_status TEXT DEFAULT 'inactive',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Charities
CREATE TABLE public.charities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  website_url TEXT,
  logo_url TEXT,
  total_raised DECIMAL DEFAULT 0.0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id),
  stripe_subscription_id TEXT UNIQUE,
  plan_type TEXT CHECK (plan_type IN ('monthly', 'yearly')),
  status TEXT,
  is_admin BOOLEAN DEFAULT false,
  charity_id UUID REFERENCES public.charities(id),
  charity_percentage DECIMAL DEFAULT 10.0,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scores (Last 5 rolling scores per user)
CREATE TABLE public.scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id),
  value INTEGER CHECK (value >= 1 AND value <= 45),
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Draws
CREATE TABLE public.draws (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  month TEXT NOT NULL, -- Format: YYYY-MM
  total_pool DECIMAL NOT NULL,
  winning_combination INT[],
  status TEXT CHECK (status IN ('pending', 'simulated', 'published', 'paid')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Winners
CREATE TABLE public.winners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  draw_id UUID REFERENCES public.draws(id),
  user_id UUID REFERENCES public.users(id),
  match_type INT CHECK (match_type IN (3, 4, 5)),
  prize_amount DECIMAL NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to create a public.users row on auth.users inserts
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Mock Charities
INSERT INTO public.charities (name, description, website_url) VALUES 
('Golfers Against Cancer', 'Funding cancer research through golf communities.', 'https://example.org/gac'),
('First Tee', 'Impacting the lives of young people by providing educational programs that build character.', 'https://example.org/firsttee'),
('PGA HOPE', 'Introducing golf to Veterans with disabilities to enhance physical, mental, social and emotional well-being.', 'https://example.org/pgahope');
