-- Add admin flag to profiles table
ALTER TABLE public.profiles ADD COLUMN is_admin BOOLEAN DEFAULT false;

-- Create swipe_actions table
CREATE TABLE public.swipe_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('like', 'dislike', 'super_like')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, target_id)
);

-- Create user_subscriptions table
CREATE TABLE public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('free', 'pro', 'elite', 'starter', 'business', 'enterprise')),
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'expired')) DEFAULT 'active',
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create user_quotas table
CREATE TABLE public.user_quotas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  super_likes_today INTEGER DEFAULT 3,
  super_likes_used_today INTEGER DEFAULT 0,
  matches_this_month INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  last_login DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create ai_analysis table
CREATE TABLE public.ai_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  analysis_data JSONB NOT NULL DEFAULT '{}',
  cerebras_score NUMERIC(5,2) CHECK (cerebras_score >= 0 AND cerebras_score <= 100),
  analysis_type TEXT NOT NULL DEFAULT 'compatibility',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create achievements table
CREATE TABLE public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL CHECK (achievement_type IN ('first_match', 'ten_collaborations', 'ai_power_user', 'streak_master', 'super_matcher', 'profile_optimizer')),
  achievement_data JSONB DEFAULT '{}',
  unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_type)
);

-- Create ghost_profiles table
CREATE TABLE public.ghost_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discovered_data JSONB NOT NULL DEFAULT '{}',
  compatibility_scores JSONB DEFAULT '{}',
  invited_at TIMESTAMP WITH TIME ZONE,
  invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'discovered' CHECK (status IN ('discovered', 'invited', 'joined')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.swipe_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_quotas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ghost_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for swipe_actions
CREATE POLICY "Users can view their own swipe actions" ON public.swipe_actions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own swipe actions" ON public.swipe_actions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own swipe actions" ON public.swipe_actions
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for user_subscriptions
CREATE POLICY "Users can view their own subscriptions" ON public.user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions" ON public.user_subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions" ON public.user_subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for user_quotas
CREATE POLICY "Users can view their own quotas" ON public.user_quotas
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quotas" ON public.user_quotas
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quotas" ON public.user_quotas
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for ai_analysis
CREATE POLICY "Users can view their own AI analysis" ON public.ai_analysis
  FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY "Users can insert their own AI analysis" ON public.ai_analysis
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- RLS Policies for achievements
CREATE POLICY "Users can view their own achievements" ON public.achievements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements" ON public.achievements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for ghost_profiles
CREATE POLICY "Authenticated users can view ghost profiles" ON public.ghost_profiles
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can invite ghost profiles" ON public.ghost_profiles
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Admin policies for all tables
CREATE POLICY "Admins can manage all swipe actions" ON public.swipe_actions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can manage all subscriptions" ON public.user_subscriptions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can manage all quotas" ON public.user_quotas
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can manage all AI analysis" ON public.ai_analysis
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can manage all achievements" ON public.achievements
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can manage all ghost profiles" ON public.ghost_profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND is_admin = true
    )
  );

-- Create function to update quotas daily
CREATE OR REPLACE FUNCTION public.reset_daily_quotas()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.user_quotas 
  SET super_likes_used_today = 0
  WHERE last_login < CURRENT_DATE;
  
  UPDATE public.user_quotas 
  SET streak_days = 0
  WHERE last_login < CURRENT_DATE - INTERVAL '1 day';
END;
$$;

-- Create function to handle new user quotas
CREATE OR REPLACE FUNCTION public.handle_new_user_quotas()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.user_quotas (user_id)
  VALUES (NEW.id);
  
  INSERT INTO public.user_subscriptions (user_id, plan_type)
  VALUES (NEW.id, 'free');
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user quotas
CREATE TRIGGER on_auth_user_created_quotas
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_quotas();